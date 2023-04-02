import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/contestlist
 * Description: Gets a list of active contests
 */
router.post('/contestlist', async (request: express.Request, response: express.Response) => {
	response.send(jsonEncodeUTF16LE({
		endcode: 0
	}));
});

export default router;