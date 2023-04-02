import express from 'express';
import { jsonEncodeUTF16LE } from '@/util';
import { getRPGListByDownloads } from '@/database';
import { HydratedRPGDocument } from '@/types/mongoose/rpg';
import { RPG } from '@/types/common/rpg';
import { RPGList } from '@/types/common/rpg-list';

const router: express.Router = express.Router();

/**
 * [POST]
 * Replacement for: https://rtk3dsf-lb01-1291588867.us-east-1.elb.amazonaws.com/api/rpglist
 * Description: Gets a list of available RPGs
 */
router.post('/rpglist', async (request: express.Request, response: express.Response) => {
	if (request.args.offset === undefined || request.args.recnum === undefined) {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	const body: RPGList = {
		endcode: 0
	};

	let rpgs: HydratedRPGDocument[];

	if (request.args.sortdlcount !== undefined) {
		rpgs = await getRPGListByDownloads(request.args.sortdlcount, request.args.offset, request.args.recnum);
	} else {
		// TODO - Better error, this is a guess
		return response.send(jsonEncodeUTF16LE({
			EndCode: 100
		}));
	}

	for (let i = 0; i < rpgs.length; i++) {
		const rpg = rpgs[i];
		const rpgData: RPG = {
			sid: rpg.id,
			suid: rpg.maker_id,
			title: Buffer.from(rpg.title).toString('base64'),
			uname: Buffer.from(rpg.maker_username).toString('base64'),
			password: rpg.password,
			updt: '',
			datablocksize: rpg.block_size,
			version:  rpg.version,
			packageversion: rpg.package_version,
			reviewave: rpg.rating,
			lang: rpg.language,
			edit: rpg.editable ? 1 : 0,
			attribute: rpg.attribute,
			award: rpg.award,
			famer: rpg.famer,
			comment: Buffer.from(rpg.comment).toString('base64'),
			contest: rpg.contest ? 1 : 0,
			owner: rpg.owner
		};

		for (const genre of rpg.genres) {
			rpgData[`genre${genre}`] = 1;
		}

		body[`${i}`] = rpgData;
	}

	response.send(jsonEncodeUTF16LE(body));
});

export default router;