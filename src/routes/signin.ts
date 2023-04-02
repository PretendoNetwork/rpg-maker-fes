import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/signin
 * Description: Signs in the user
 */
router.post('/signin', async (request: express.Request, response: express.Response) => {
	// TODO - Check ban status?
	response.send(jsonEncodeUTF16LE({
		EndCode: 0
	}));
});

export default router;