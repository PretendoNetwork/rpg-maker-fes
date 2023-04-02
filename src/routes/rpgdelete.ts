import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { getRPGByID } from '@/database';
import { HydratedRPGDocument } from '@/types/mongoose/rpg';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/rpgdelete
 * Description: Deletes an RPG
 */
router.post('/rpgdelete', async (request: express.Request, response: express.Response) => {
	if (request.args.sid === undefined) {
		// TODO - Find better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	const rpg: HydratedRPGDocument | null = await getRPGByID(request.args.sid);

	if (!rpg || rpg.maker_id !== request.maker?.id) {
		// TODO - Find better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	rpg.deleted = true;

	await rpg.save();

	response.send(jsonEncodeUTF16LE({
		EndCode: 0
	}));
});

export default router;