import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { Maker } from '@/models/maker';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/username
 * Description: Signs in the user
 */
router.post('/username', async (request: express.Request, response: express.Response) => {
	// TODO - Check if username already in use?

	if (!request.maker) {
		const username: string | undefined = request.args.uname;

		if (!username || username.trim() === '') {
			// TODO - Find better error, this is a guess
			response.send(jsonEncodeUTF16LE({
				EndCode: 100
			}));
		}

		const maker = await Maker.create({
			nex_pid: request.token.pid,
			username: Buffer.from(username as string, 'base64').toString(),
			region: request.args.region,
			language: request.args.lang,
			flags: {
				flag1: -1,
				flag2: -1,
				flag3: -1
			}
		});

		await maker.save();
	}

	response.send(jsonEncodeUTF16LE({
		EndCode: 0
	}));
});

export default router;