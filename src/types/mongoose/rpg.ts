import { Model, HydratedDocument } from 'mongoose';
import { GenreIDs } from '@/types/common/genres';

export interface IRPG {
	id: number;
	password: string;
	updated: number;
	maker_id: number;
	maker_username: string;
	title: string;
	comment: string;
	rating: number;
	genres: GenreIDs[];
	version: number;
	package_version: number;
	editable: boolean;
	language: string;
	attribute: number;
	owner: number;
	award: number;
	famer: number;
	contest: boolean;
	downloads: number;
	block_size: number;
	reviews: {
		user_id: number;
		rating: number;
	}[];
}

export interface IRPGMethods {}

interface IRPGQueryHelpers {}

export interface RPGModel extends Model<IRPG, IRPGQueryHelpers, IRPGMethods> {}

export type HydratedRPGDocument = HydratedDocument<IRPG, IRPGMethods>