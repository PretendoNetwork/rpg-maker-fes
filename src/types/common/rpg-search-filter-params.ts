import { GenreID } from '@/types/common/genres';

export interface RPGSearchFilterParams {
	contest?: boolean;
	award?: number;
	famer?: number;
	genres?: {
		$in: GenreID[]
	}
}