import mongoose from 'mongoose';
import { AutoIncrementID }  from '@typegoose/auto-increment';
import { IRPG, IRPGMethods, RPGModel } from '@/types/mongoose/rpg';
import { GenreIDs } from '@/types/common/genres';

const RPGSchema = new mongoose.Schema<IRPG, RPGModel, IRPGMethods>({
	id: Number,
	password: String,
	updated: Number,
	maker_id: Number,
	maker_username: String,
	title: String,
	comment: String,
	rating: Number,
	genres: Array<GenreIDs>,
	version: Number,
	package_version: Number,
	editable: Boolean,
	language: String,
	attribute: Number,
	owner: Number,
	award: Number,
	famer: Number,
	contest: Boolean,
	downloads: Number,
	block_size: Number,
	reviews: Array<{
		user_id: number,
		rating: number
	}>
}, { id: false });

RPGSchema.plugin(AutoIncrementID, {
	startAt: 1,
	field: 'id'
});

export const RPG: RPGModel = mongoose.model<IRPG, RPGModel>('RPG', RPGSchema);