import { RPG } from '@/types/common/rpg';

export interface RPGList {
	endcode: number;

	[key: string]: RPG | number;
}