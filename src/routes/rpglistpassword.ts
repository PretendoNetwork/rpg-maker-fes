import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { getRPGListByPassword } from '@/database';
import { RPGList } from '@/types/common/rpg-list';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/rpglistpassword
 * Description: Gets an RPG by the RPG password
 */
router.post('/rpglistpassword', async (request: express.Request, response: express.Response) => {
	if (request.args.keyword === undefined) {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	const password: string = Buffer.from(request.args.keyword, 'base64').toString();
	const rpgList: RPGList = await getRPGListByPassword(password);

	response.send(jsonEncodeUTF16LE(rpgList));
});

export default router;