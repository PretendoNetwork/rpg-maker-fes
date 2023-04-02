import mongoose from 'mongoose';
import { escapeRegExp, makeRPGListFromQueryResults } from '@/util';
import { config } from '@/config-manager';
import { Maker } from '@/models/maker';
import { RPG } from '@/models/rpg';
import { HydratedMakerDocument } from '@/types/mongoose/maker';
import { HydratedRPGDocument } from '@/types/mongoose/rpg';
import { RPGList } from '@/types/common/rpg-list';
import { RPGSearchFilterParams } from '@/types/common/rpg-search-filter-params';

const connection_string: string = config.mongoose.connection_string;
const options: mongoose.ConnectOptions = config.mongoose.options;

let _connection: mongoose.Connection;

export async function connect(): Promise<void> {
	await mongoose.connect(connection_string, options);

	_connection = mongoose.connection;
	_connection.on('error', console.error.bind(console, 'connection error:'));
}

export function connection(): mongoose.Connection {
	return _connection;
}

export function verifyConnected(): void {
	if (!connection()) {
		throw new Error('Cannot make database requets without being connected');
	}
}

export async function getMakerByPID(pid: number): Promise<HydratedMakerDocument | null> {
	verifyConnected();

	return await Maker.findOne<HydratedMakerDocument>({
		nex_pid: pid
	});
}

export async function getRPGListByPassword(password: string): Promise<RPGList> {
	verifyConnected();

	try {
		const queryResults: HydratedRPGDocument[] = await RPG.find({ password: password }).exec();
		return makeRPGListFromQueryResults(queryResults);
	} catch (err) {
		// TODO - Better error
		return {
			endcode: 100
		};
	}
}

export async function getRPGListByTitle(title: string, offset: number, limit: number): Promise<RPGList> {
	verifyConnected();

	try {
		title = escapeRegExp(title);
		const queryResults: HydratedRPGDocument[] = await RPG.find({ title: { $regex: `^${title}*`, $options: 'i' } }).skip(offset).limit(limit).exec();
		return makeRPGListFromQueryResults(queryResults);
	} catch (err) {
		// TODO - Better error
		return {
			endcode: 100
		};
	}
}

export async function getRPGListByMakerID(makerID: number, offset: number, limit: number): Promise<RPGList> {
	verifyConnected();

	try {
		const queryResults: HydratedRPGDocument[] = await RPG.find({ maker_id: makerID }).skip(offset).limit(limit).exec();
		return makeRPGListFromQueryResults(queryResults);
	} catch (err) {
		// TODO - Better error
		return {
			endcode: 100
		};
	}
}

export async function getRPGListByUsername(username: string, offset: number, limit: number): Promise<RPGList> {
	verifyConnected();

	try {
		username = escapeRegExp(username);
		const queryResults: HydratedRPGDocument[] = await RPG.find({ maker_username: { $regex: `^${username}*`, $options: 'i' } }).skip(offset).limit(limit).exec();
		return makeRPGListFromQueryResults(queryResults);
	} catch (err) {
		// TODO - Better error
		return {
			endcode: 100
		};
	}
}

export async function getRPGListByUpdateDate(filter: RPGSearchFilterParams, order: mongoose.SortOrder, offset: number, limit: number): Promise<RPGList> {
	verifyConnected();

	try {
		const queryResults: HydratedRPGDocument[] = await RPG.find(filter).sort({ updated: order }).skip(offset).limit(limit).exec();
		return makeRPGListFromQueryResults(queryResults);
	} catch (err) {
		// TODO - Better error
		return {
			endcode: 100
		};
	}
}

export async function getRPGListByDownloads(filter: RPGSearchFilterParams, order: mongoose.SortOrder, offset: number, limit: number): Promise<RPGList> {
	verifyConnected();

	try {
		const queryResults: HydratedRPGDocument[] = await RPG.find(filter).sort({ downloads: order }).skip(offset).limit(limit).exec();
		return makeRPGListFromQueryResults(queryResults);
	} catch (err) {
		// TODO - Better error
		return {
			endcode: 100
		};
	}
}

export async function getRPGListByRating(filter: RPGSearchFilterParams, order: mongoose.SortOrder, offset: number, limit: number): Promise<RPGList> {
	verifyConnected();

	try {
		const queryResults: HydratedRPGDocument[] = await RPG.find(filter).sort({ rating: order }).skip(offset).limit(limit).exec();
		return makeRPGListFromQueryResults(queryResults);
	} catch (err) {
		// TODO - Better error
		return {
			endcode: 100
		};
	}
}