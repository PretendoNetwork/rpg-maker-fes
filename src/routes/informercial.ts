import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { getRPGByID, reportedRPG } from '@/database';
import { Report } from '@/models/report';
import { HydratedRPGDocument } from '@/types/mongoose/rpg';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/informercial
 * Description: Reports an RPG
 */
router.post('/informercial', async (request: express.Request, response: express.Response) => {
	if (
		request.args.sid === undefined ||
		request.args.info1 === undefined ||
		request.args.info2 === undefined ||
		request.args.info3 === undefined ||
		request.args.info4 === undefined ||
		request.args.info5 === undefined ||
		request.args.info6 === undefined ||
		request.args.text === undefined
	) {
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	const rpg: HydratedRPGDocument | null = await getRPGByID(request.args.sid);

	if (!rpg) {
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	if (await reportedRPG(request.maker?.id, rpg.id)) {
		return response.send(jsonEncodeUTF16LE({
			EndCode: 103
		}));
	}

	const details: string = Buffer.from(request.args.text, 'base64').toString();

	if (details.length === 0 || details.length > 160) {
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	const report = await Report.create({
		rpg_id: rpg.id,
		maker_id: request.maker?.id,
		details: details,
		contained_slander: Boolean(request.args.info1),
		contained_personal_information: Boolean(request.args.info2),
		contained_cruel_expressions: Boolean(request.args.info3),
		contained_sexual_expressions: Boolean(request.args.info4),
		bugs_preventing_progress: Boolean(request.args.info5),
		copyright_infringement: Boolean(request.args.info6)
	});

	await report.save();

	response.send(jsonEncodeUTF16LE({
		endcode: 0
	}));
});

export default router;