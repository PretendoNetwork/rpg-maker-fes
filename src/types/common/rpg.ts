import { Genres } from '@/types/common/genres';

export interface RPG extends Genres {
	sid: number;
	suid: number;
	title: string;
	uname: string;
	password: string;
	updt: string;
	datablocksize: number;
	version:  number;
	packageversion: number;
	reviewave: number;
	lang: string;
	edit: number;
	attribute: number;
	award: number;
	famer: number;
	comment: string;
	contest: number;
	owner: number;
}