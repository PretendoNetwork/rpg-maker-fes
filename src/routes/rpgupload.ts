import express from 'express';
import moment from 'moment';
import { jsonEncodeUTF16LE, uploadCDNAsset } from '@/util';
import { RPG } from '@/models/rpg';
import { GenreID } from '@/types/common/genres';
import { buf as crc32 } from 'crc-32';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/rpgupload
 * Description: Uploads an RPG
 */
router.post('/rpgupload', async (request: express.Request, response: express.Response) => {
	if (crc32(request.file) !== request.args.crc32) {
		// TODO - Find better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	const rpg = await RPG.create({
		updated: moment().format('YYYY-MM-DD HH-mm-ss'),
		maker_id: request.maker?.id,
		maker_username: request.maker?.username,
		title: Buffer.from(request.args.title || '', 'base64').toString(),
		comment: Buffer.from(request.args.comment || '', 'base64').toString(),
		rating: 0,
		genres: [],
		version: Number(request.args.version),
		package_version: request.args.packageversion,
		editable: Boolean(request.args.edit),
		language: request.args.lang,
		region: request.args.region,
		attribute: request.args.attribute,
		owner: request.args.owner,
		award: request.args.award !== undefined ? request.args.award : 0,
		famer: request.args.famer !== undefined ? request.args.famer : 0,
		contest: request.args.contest !== undefined ? Boolean(request.args.contest) : false,
		downloads: 0,
		block_size: request.args.datablocksize,
		reviews: [],
		deleted: false
	});

	for (const key in request.args) {
		if (key.startsWith('genre')) {
			const genre: GenreID = <GenreID>Number(key.split('genre')[1]);

			rpg.genres.push(genre);
		}
	}

	await rpg.generatePassword();
	await rpg.save();

	await uploadCDNAsset(`rpgs/${rpg.maker_id}/${rpg.id}.bin`, request.file);

	response.send(jsonEncodeUTF16LE({
		EndCode: 0
	}));
});

export default router;