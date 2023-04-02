import express from 'express';
import { getMakerByPID } from '@/database';

async function makerMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
	request.maker = await getMakerByPID(request.token.pid);

	next();
}

export default makerMiddleware;