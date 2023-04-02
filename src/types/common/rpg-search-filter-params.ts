import { GenreID } from '@/types/common/genres';

export interface RPGSearchFilterParams {
	password?: string;
	maker_id?: number;
	title?: {
		$regex: string;
		$options: 'i';
	};
	maker_username?: {
		$regex: string;
		$options: 'i';
	};
	contest?: boolean;
	award?: number;
	famer?: number;
	genres?: {
		$in: GenreID[]
	},
	deleted?: boolean;
}