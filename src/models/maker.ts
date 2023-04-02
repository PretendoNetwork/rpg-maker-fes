import mongoose from 'mongoose';
import { AutoIncrementID }  from '@typegoose/auto-increment';
import { IMaker, IMakerMethods, MakerModel } from '@/types/mongoose/maker';

const MakerSchema = new mongoose.Schema<IMaker, MakerModel, IMakerMethods>({
	id: Number,
	nex_pid: Number,
	username: String,
	region: String,
	language: String,
	flags: {
		flag1: Number, // * These are the real names. Wtf
		flag2: Number, // * These are the real names. Wtf
		flag3: Number  // * These are the real names. Wtf
	}
}, { id: false });

MakerSchema.plugin(AutoIncrementID, {
	startAt: 1,
	field: 'id'
});

export const Maker: MakerModel = mongoose.model<IMaker, MakerModel>('Maker', MakerSchema);