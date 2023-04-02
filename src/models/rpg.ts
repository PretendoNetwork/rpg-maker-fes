import mongoose from 'mongoose';
import { AutoIncrementID }  from '@typegoose/auto-increment';
import { generateRPGPassword }  from '@/util';
import { HydratedRPGDocument, IRPG, IRPGMethods, RPGModel } from '@/types/mongoose/rpg';
import { GenreID } from '@/types/common/genres';

const RPGSchema = new mongoose.Schema<IRPG, RPGModel, IRPGMethods>({
	id: Number,
	password: String,
	updated: String,
	maker_id: Number,
	maker_username: String,
	title: String,
	comment: String,
	genres: Array<GenreID>,
	version: Number,
	package_version: Number,
	editable: Boolean,
	language: String,
	region: String,
	attribute: Number,
	owner: Number,
	award: Number,
	famer: Number,
	contest: Boolean,
	downloads: Number,
	block_size: Number,
	reviews: Array<{
		maker_id: number,
		rating: number
	}>,
	deleted: Boolean
}, { id: false });

RPGSchema.plugin(AutoIncrementID, {
	startAt: 1,
	field: 'id'
});

RPGSchema.method('generatePassword', async function generatePassword(): Promise<void> {
	const password = generateRPGPassword();
	const inuse: HydratedRPGDocument | null = await RPG.findOne({ password });

	if (inuse) {
		await this.generatePassword();
	} else {
		this.password = password;
	}
});

export const RPG: RPGModel = mongoose.model<IRPG, RPGModel>('RPG', RPGSchema);