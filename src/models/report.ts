import mongoose from 'mongoose';
import { AutoIncrementID }  from '@typegoose/auto-increment';
import { IReport, IReportMethods, ReportModel } from '@/types/mongoose/report';

const ReportSchema = new mongoose.Schema<IReport, ReportModel, IReportMethods>({
	id: Number,
	rpg_id: Number,
	maker_id: Number,
	details: String,
	contained_slander: Boolean,
	contained_personal_information: Boolean,
	contained_cruel_expressions: Boolean,
	contained_sexual_expressions: Boolean,
	bugs_preventing_progress: Boolean,
	copyright_infringement: Boolean
}, { id: false });

ReportSchema.plugin(AutoIncrementID, {
	startAt: 1,
	field: 'id'
});

export const Report: ReportModel = mongoose.model<IReport, ReportModel>('Report', ReportSchema);