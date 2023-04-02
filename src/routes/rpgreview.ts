import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { reviewedRPG, addRPGReview } from '@/database';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/rpgreview
 * Description: Reviews an RPG
 */
router.post('/rpgreview', async (request: express.Request, response: express.Response) => {
	if (request.args.review === undefined || request.args.sid === undefined) {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	if (await reviewedRPG(request.maker?.id, request.args.sid)) {
		return response.send(jsonEncodeUTF16LE({
			EndCode: 103
		}));
	}

	let review: number = request.args.review < 1 ? 1 : request.args.review;
	review = review > 5 ? 5 : review;
	review = Math.round(review);

	await addRPGReview(request.args.sid, request.maker?.id, review);

	response.send(jsonEncodeUTF16LE({
		EndCode: 0
	}));
});

export default router;