import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { getRPGListByMakerID } from '@/database';
import { RPGList } from '@/types/common/rpg-list';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/myrpglist
 * Description: Gets a list of active contests
 */
router.post('/myrpglist', async (request: express.Request, response: express.Response) => {
	const rpgList: RPGList = await getRPGListByMakerID(request.maker?.id, 0, 0);

	response.send(jsonEncodeUTF16LE(rpgList));
});

export default router;