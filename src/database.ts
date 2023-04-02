import mongoose from 'mongoose';
import { escapeRegExp, makeRPGListFromQueryResults } from '@/util';
import { config } from '@/config-manager';
import { Maker } from '@/models/maker';
import { RPG } from '@/models/rpg';
import { HydratedMakerDocument } from '@/types/mongoose/maker';
import { HydratedRPGDocument } from '@/types/mongoose/rpg';
import { RPGList } from '@/types/common/rpg-list';
import { RPGSearchFilterParams } from '@/types/common/rpg-search-filter-params';
import { RPGSearchSortParams } from './types/common/rpg-search-sort-params';

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

async function getRPGList(filter: RPGSearchFilterParams, sort: RPGSearchSortParams, offset: number, limit: number): Promise<RPGList> {
	verifyConnected();

	filter.deleted = false;

	try {
		const queryResults: HydratedRPGDocument[] = await RPG.find(filter).sort(sort).skip(offset).limit(limit).exec();
		return makeRPGListFromQueryResults(queryResults);
	} catch (err) {
		// TODO - Better error
		return {
			endcode: 100
		};
	}
}

export async function getMakerByPID(pid: number): Promise<HydratedMakerDocument | null> {
	verifyConnected();

	return await Maker.findOne<HydratedMakerDocument>({
		nex_pid: pid
	});
}

export async function getRPGByID(id: number): Promise<HydratedRPGDocument | null> {
	verifyConnected();

	return await RPG.findOne<HydratedRPGDocument>({ id: id });
}

export async function getRPGListByPassword(password: string): Promise<RPGList> {
	return await getRPGList({ password: password }, {}, 0, 0);
}

export async function getRPGListByTitle(title: string, offset: number, limit: number): Promise<RPGList> {
	title = escapeRegExp(title);
	return await getRPGList({ title: { $regex: `^${title}*`, $options: 'i' } }, {}, offset, limit);
}

export async function getRPGListByMakerID(makerID: number, offset: number, limit: number): Promise<RPGList> {
	return await getRPGList({ maker_id: makerID }, {}, offset, limit);
}

export async function getRPGListByUsername(username: string, offset: number, limit: number): Promise<RPGList> {
	username = escapeRegExp(username);
	return await getRPGList({ maker_username: { $regex: `^${username}*`, $options: 'i' } }, {}, offset, limit);
}

export async function getRPGListByUpdateDate(filter: RPGSearchFilterParams, order: mongoose.SortOrder, offset: number, limit: number): Promise<RPGList> {
	return await getRPGList(filter, { updated: order }, offset, limit);
}

export async function getRPGListByDownloads(filter: RPGSearchFilterParams, order: mongoose.SortOrder, offset: number, limit: number): Promise<RPGList> {
	return await getRPGList(filter, { downloads: order }, offset, limit);
}

export async function getRPGListByRating(filter: RPGSearchFilterParams, order: mongoose.SortOrder, offset: number, limit: number): Promise<RPGList> {
	return await getRPGList(filter, { rating: order }, offset, limit);
}