import mongoose from 'mongoose';
import { Genres } from '@/types/common/genres';

export interface PostRequestArgs extends Genres {
	// * Always present
	region: string;
	lang: string;
	token: string;

	// * Only present during signup
	uname?: string;

	// * Only present when getting RPG list
	startupdt?: number;
	contest?: number;
	sortupdt?: mongoose.SortOrder; // * Only if filtering by upload date
	sortdlcount?: mongoose.SortOrder; // * Only if filtering via download count
	sortreviewave?: string; // * Only if filtering via review count
	offset?: number;
	recnum?: number;
	award?: number;
	famer?: number;

	// * Only present when searching by title/password
	keyword?: string;

	// * Only present when downloading/reviewing/deleteing an RPG
	sid?: string;

	// * Only present when downloading an RPG
	ver?: string;

	// * Only present when reviewing an RPG
	review?: number;

	// * Only present when uploading an RPG
	title?: string;
	version?: string;
	packageversion?: number;
	edit?: number;
	attribute?: number;
	comment?: string;
	owner?: number;
	crc32?: number;
	datablocksize?: number;

	// * Only present when reporting an RPG
	info1?: number; // * Contained slander
	info2?: number; // * Contained personal information
	info3?: number; // * Contained cruel expressions
	info4?: number; // * Contained sexual expressions
	info5?: number; // * Bugs preventing game progress
	info6?: number; // * Copyright infringement
	text?: string;
}