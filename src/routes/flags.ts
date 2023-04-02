import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/flags
 * Description: Gets the flags for the current user
 */
router.post('/flags', async (request: express.Request, response: express.Response) => {
	let body: string;

	if (!request.maker) {
		body = jsonEncodeUTF16LE({
			id: 1,
			region: request.args.region,
			lang: request.args.lang,
			maintenance: 0,
			serchcontest: 0,
			serchfamer: 0,
			serchothercountries: 1,
			contestmode: 0,
			flag1: -1,
			flag2: -1,
			flag3: -1,
			endcode: 0
		});
	} else {
		body = jsonEncodeUTF16LE({
			id: 1,
			region: request.args.region,
			lang: request.args.lang,
			maintenance: 0,
			serchcontest: 0,
			serchfamer: 0,
			serchothercountries: 1,
			contestmode: 0,
			suid: request.maker.id,
			uname: Buffer.from(request.maker.username).toString('base64'),
			flag1: request.maker.flags.flag1,
			flag2: request.maker.flags.flag2,
			flag3: request.maker.flags.flag3,
			endcode: 0
		});
	}

	response.send(body);
});

export default router;