import express from 'express';
import { decryptAndUnpackToken, jsonEncodeUTF16LE } from '@/util';

function tokenMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
	if (!request.token) {
		response.send(jsonEncodeUTF16LE({
			EndCode: 102
		}));

		return;
	}

	try {
		// * RPG Maker appends a single F character to each service token, for some reason
		request.token = decryptAndUnpackToken(request.args.token.substring(1));
	} catch (error) {
		response.send(jsonEncodeUTF16LE({
			EndCode: 102
		}));

		return;
	}

	const expireTime: number = Math.floor((Number(request.token.expire_time) / 1000));

	if (Math.floor(Date.now() / 1000) > expireTime) {
		response.send(jsonEncodeUTF16LE({
			EndCode: 102
		}));
	} else {
		next();
	}
}

export default tokenMiddleware;