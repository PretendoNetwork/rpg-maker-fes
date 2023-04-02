import crypto from 'node:crypto';
import path from 'node:path';
import { Readable } from 'node:stream';
import { IncomingHttpHeaders } from 'node:http';
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import fs from 'fs-extra';
import express from 'express';
import { config, disabledFeatures } from '@/config-manager';
import { Token } from '@/types/common/token';
import { HydratedRPGDocument } from './types/mongoose/rpg';
import { RPG } from '@/types/common/rpg';
import { RPGList } from './types/common/rpg-list';

let s3: S3;

if (!disabledFeatures.s3) {
	s3 = new S3({
		forcePathStyle: false,
		endpoint: config.s3.endpoint,
		region: config.s3.region,
		credentials: {
			accessKeyId: config.s3.key,
			secretAccessKey: config.s3.secret
		}
	});
}

export function decryptAndUnpackToken(token: string): Token {
	const decrypted: Buffer = decryptToken(nintendoBase64Decode(token));

	return unpackToken(decrypted);
}

export function decryptToken(token: Buffer): Buffer {
	const key: Buffer = Buffer.from(config.aes_key, 'hex');
	const iv: Buffer = Buffer.alloc(16);
	const decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

	return Buffer.concat([
		decipher.update(token),
		decipher.final()
	]);
}

export function unpackToken(token: Buffer): Token {
	return {
		system_type: token.readUInt8(0x0),
		token_type: token.readUInt8(0x1),
		pid: token.readUInt32LE(0x2),
		expire_time: token.readBigUInt64LE(0x6),
		title_id: token.readBigUInt64LE(0xE),
		access_level: token.readUInt8(0x16)
	};
}

export async function getCDNFileStream(key: string): Promise<Readable | fs.ReadStream | null> {
	try {
		if (disabledFeatures.s3) {
			return await getLocalCDNFile(key);
		} else {
			const response = await s3.send(new GetObjectCommand({
				Key: key,
				Bucket: config.s3.bucket
			}));

			if (!response.Body) {
				return null;
			}

			return response.Body as Readable;
		}
	} catch (error) {
		return null;
	}
}

export async function getLocalCDNFile(key: string): Promise<fs.ReadStream | null> {
	const filePath: string = `${config.cdn.disk_path}/${key}`;

	if (await !fs.exists(filePath)) {
		return null;
	}

	return fs.createReadStream(filePath);
}

export async function uploadCDNAsset(key: string, data: Buffer): Promise<void> {
	if (disabledFeatures.s3) {
		await writeLocalCDNFile(key, data);
	} else {
		await s3.send(new PutObjectCommand({
			Key: key,
			Bucket: config.s3.bucket,
			Body: data,
			ACL: 'private'
		}));
	}
}

export async function writeLocalCDNFile(key: string, data: Buffer): Promise<void> {
	const filePath: string = config.cdn.disk_path;
	const folder: string = path.dirname(filePath);

	await fs.ensureDir(folder);
	await fs.writeFile(filePath, data);
}

export function getValueFromHeaders(headers: IncomingHttpHeaders, key: string): string | undefined {
	let header: string | string[] | undefined = headers[key];
	let value: string | undefined;

	if (header) {
		if (Array.isArray(header)) {
			header = header[0];
		}

		value = header;
	}

	return value;
}

export function jsonEncodeUTF16LE(input: object): string {
	const string: string = JSON.stringify(input);
	const array: Uint8Array = new Uint8Array(string.length*2);

	for (let i: number = 0; i < string.length; i++) {
		array[i*2] = string.charCodeAt(i);
	}

	return Buffer.from(array).toString();
}

export function makeRPGListFromQueryResults(rpgs: HydratedRPGDocument[]): RPGList {
	const rpgList: RPGList = {
		endcode: 0
	};

	for (let i = 0; i < rpgs.length; i++) {
		const rpg = rpgs[i];
		const rpgData: RPG = {
			sid: rpg.id,
			suid: rpg.maker_id,
			title: Buffer.from(rpg.title).toString('base64'),
			uname: Buffer.from(rpg.maker_username).toString('base64'),
			password: rpg.password,
			updt: rpg.updated,
			datablocksize: rpg.block_size,
			version:  rpg.version,
			packageversion: rpg.package_version,
			reviewave: 0,
			lang: rpg.language,
			edit: rpg.editable ? 1 : 0,
			attribute: rpg.attribute,
			award: rpg.award,
			famer: rpg.famer,
			comment: Buffer.from(rpg.comment).toString('base64'),
			contest: rpg.contest ? 1 : 0,
			owner: rpg.owner
		};

		for (const review of rpg.reviews) {
			rpgData.reviewave += review.rating;
		}

		rpgData.reviewave = rpgData.reviewave / rpg.reviews.length;
		rpgData.reviewave = Number(rpgData.reviewave.toFixed(5));

		for (const genre of rpg.genres) {
			rpgData[`genre${genre}`] = 1;
		}

		rpgList[`${i}`] = rpgData;
	}

	return rpgList;
}

export function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function nintendoBase64Decode(encoded: string): Buffer {
	encoded = encoded.replaceAll('.', '+').replaceAll('-', '/').replaceAll('*', '=');
	return Buffer.from(encoded, 'base64');
}

export function generateRPGPassword(): string {
	const chars = '0123456789abcdefghiklmnopqrstuvwxyz';
	let password = '';

	for (let i = 0; i < 8; i++) {
		password += chars[Math.floor(Math.random() * chars.length)];
	}

	return password;
}

export function fullUrl(request: express.Request): string {
	const protocol: string = request.protocol;
	const host: string = request.host;
	const opath: string = request.originalUrl;

	return `${protocol}://${host}${opath}`;
}