import express from 'express';

async function requestParamsMiddleware(request: express.Request, _response: express.Response, next: express.NextFunction): Promise<void> {
	request.args = JSON.parse(request.body.args);

	return next();
}

export default requestParamsMiddleware;