import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { getRPGListByUpdateDate, getRPGListByDownloads, getRPGListByRating } from '@/database';
import { RPGList } from '@/types/common/rpg-list';
import { RPGSearchFilterParams } from '@/types/common/rpg-search-filter-params';
import { GenreID } from '@/types/common/genres';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/rpglist
 * Description: Gets a list of available RPGs
 */
router.post('/rpglist', async (request: express.Request, response: express.Response) => {
	// * Request also sends a "startupdt" value, not sure what that is for
	if (request.args.offset === undefined || request.args.recnum === undefined) {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	// TODO - Finish filter params
	const filter: RPGSearchFilterParams = {};

	const hasGenres: boolean = Object.keys(request.args).some(key => key.startsWith('genre'));

	// TODO - Find a better error, this is a guess
	let rpgList: RPGList = {
		endcode: 100
	};

	if (request.args.sortdlcount !== undefined) {
		rpgList = await getRPGListByDownloads(filter, request.args.sortdlcount, request.args.offset, request.args.recnum);
	}

	if (request.args.sortupdt !== undefined) {
		if (hasGenres) {
			filter.genres = {
				$in: []
			};

			for (const key in request.args) {
				if (key.startsWith('genre')) {
					const genre: GenreID = <GenreID>Number(key.split('genre')[1]);
					filter.genres.$in.push(genre);
				}
			}
		}

		rpgList = await getRPGListByUpdateDate(filter, request.args.sortupdt, request.args.offset, request.args.recnum);
	}

	if (request.args.sortreviewave !== undefined) {
		rpgList = await getRPGListByRating(filter, request.args.sortreviewave, request.args.offset, request.args.recnum);
	}

	response.send(jsonEncodeUTF16LE(rpgList));
});

export default router;