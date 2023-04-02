import express from 'express';
import * as multipart from 'parse-multipart-data';
import { jsonEncodeUTF16LE } from '@/util';
import { Input } from '@/types/multipart';

async function multipartMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
	if (request.headers['content-type']?.startsWith('multipart/form-data')) {
		const parts: Input[] = multipart.parse(request.body, 't9Sf4yfjf1RtvDu3AA');
		const fileInput: Input | undefined = parts.find(({ name }) => name === 'rpgdata');
		const argsInput: Input | undefined = parts.find(({ name }) => name === 'args');

		if (!fileInput || !argsInput) {
			console.log(parts);
			// TODO - Find better error, this is a guess
			response.send(jsonEncodeUTF16LE({
				EndCode: 102
			}));

			return;
		}

		// * Define args on the body for request-params middleware
		request.body = {
			args: argsInput.data.toString()
		};

		request.file = fileInput.data;
	}

	return next();
}

export default multipartMiddleware;