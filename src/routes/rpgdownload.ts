import { Readable } from 'node:stream';
import express from 'express';
import fs from 'fs-extra';
import { jsonEncodeUTF16LE, getCDNFileStream } from '@/util';
import { getRPGByID } from '@/database';
import { HydratedRPGDocument } from '@/types/mongoose/rpg';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/rpgdownload
 * Description: Downloads an RPG
 */
router.post('/rpgdownload', async (request: express.Request, response: express.Response) => {
	if (request.args.sid === undefined) {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	const rpg: HydratedRPGDocument | null = await getRPGByID(request.args.sid);

	if (!rpg) {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	const rpgStream: Readable | fs.ReadStream | null = await getCDNFileStream(`rpgs/${rpg.maker_id}/${rpg.id}.bin`);

	if (!rpgStream) {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	response.setHeader('Content-Disposition', 'attachment; filename="rpg.bin"');
	response.setHeader('Content-Type', 'application/octet-stream; name="rpg.bin"');

	rpgStream.pipe(response);
});

export default router;