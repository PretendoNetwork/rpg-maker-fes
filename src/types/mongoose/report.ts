import { Model, HydratedDocument } from 'mongoose';

export interface IReport {
	id: number;
	rpg_id: number;
	maker_id: number;
	details: string;
	contained_slander: boolean;
	contained_personal_information: boolean;
	contained_cruel_expressions: boolean;
	contained_sexual_expressions: boolean;
	bugs_preventing_progress: boolean;
	copyright_infringement: boolean;
}

export interface IReportMethods {
	generatePassword(): Promise<void>;
}

interface IReportQueryHelpers {}

export interface ReportModel extends Model<IReport, IReportQueryHelpers, IReportMethods> {}

export type HydratedReportDocument = HydratedDocument<IReport, IReportMethods>