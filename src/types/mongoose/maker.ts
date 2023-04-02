import { Model, HydratedDocument } from 'mongoose';

export interface IMaker {
	id: number;
	nex_pid: number;
	username: string;
	region: string;
	language: string;
	flags: {
		flag1: number; // * These are the real names. Wtf
		flag2: number; // * These are the real names. Wtf
		flag3: number; // * These are the real names. Wtf
	}
}

export interface IMakerMethods {}

interface IMakerQueryHelpers {}

export interface MakerModel extends Model<IMaker, IMakerQueryHelpers, IMakerMethods> {}

export type HydratedMakerDocument = HydratedDocument<IMaker, IMakerMethods>