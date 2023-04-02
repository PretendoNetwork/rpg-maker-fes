import { Model, HydratedDocument } from 'mongoose';
import { GenreID } from '@/types/common/genres';

export interface IRPG {
	id: number;
	password: string;
	updated: string;
	maker_id: number;
	maker_username: string;
	title: string;
	comment: string;
	genres: GenreID[];
	version: number;
	package_version: number;
	editable: boolean;
	language: string;
	region: string;
	attribute: number;
	owner: number;
	award: number;
	famer: number;
	contest: boolean;
	downloads: number;
	block_size: number;
	reviews: {
		maker_id: number;
		rating: number;
	}[];
	deleted: boolean;
}

export interface IRPGMethods {
	generatePassword(): Promise<void>;
}

interface IRPGQueryHelpers {}

export interface RPGModel extends Model<IRPG, IRPGQueryHelpers, IRPGMethods> {}

export type HydratedRPGDocument = HydratedDocument<IRPG, IRPGMethods>