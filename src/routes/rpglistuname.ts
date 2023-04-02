import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { getRPGListByUsername } from '@/database';
import { RPGList } from '@/types/common/rpg-list';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/rpglistuname
 * Description: Searches for RPGs by nickname
 */
router.post('/rpglistuname', async (request: express.Request, response: express.Response) => {
	if (request.args.keyword === undefined || request.args.offset === undefined || request.args.recnum === undefined) {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	const username: string = Buffer.from(request.args.keyword, 'base64').toString();
	const rpgList: RPGList = await getRPGListByUsername(username, request.args.offset, request.args.recnum);

	response.send(jsonEncodeUTF16LE(rpgList));
});

export default router;