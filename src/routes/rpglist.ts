import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { getRPGListByDownloads } from '@/database';
import { RPGList } from '@/types/common/rpg-list';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/rpglist
 * Description: Gets a list of available RPGs
 */
router.post('/rpglist', async (request: express.Request, response: express.Response) => {
	if (request.args.offset === undefined || request.args.recnum === undefined) {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	let body: RPGList;

	if (request.args.sortdlcount !== undefined) {
		body = await getRPGListByDownloads(request.args.sortdlcount, request.args.offset, request.args.recnum);
	} else {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	response.send(jsonEncodeUTF16LE(body));
});

export default router;