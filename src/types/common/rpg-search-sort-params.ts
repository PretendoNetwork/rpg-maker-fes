import mongoose from 'mongoose';

export interface RPGSearchSortParams {
	[key: string]: mongoose.SortOrder;
}