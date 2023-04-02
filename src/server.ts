import express from 'express';
import subdomain from 'express-subdomain';
import morgan from 'morgan';
import multipartMiddleware from '@/middleware/multipart';
import requestParamsMiddleware from '@/middleware/request-params';
import tokenMiddleware from '@/middleware/token';
import makerMiddleware from '@/middleware/maker';
import { connect as connectDatabase } from '@/database';
import { fullUrl, getValueFromHeaders } from '@/util';
import { LOG_INFO, LOG_SUCCESS, LOG_WARN } from '@/logger';

// * Import API routes
import flags from '@/routes/flags';
import signin from '@/routes/signin';
import username from '@/routes/username';
import contestlist from '@/routes/contestlist';
import rpglist from '@/routes/rpglist';
import rpglistpassword from '@/routes/rpglistpassword';
import rpglisttitle from '@/routes/rpglisttitle';
import myrpglist from '@/routes/myrpglist';
import rpgupload from '@/routes/rpgupload';

import { config } from '@/config-manager';

const { http: { port } } = config;
const app = express();

// * START APPLICATION

// * Setup middleware
LOG_INFO('Setting up Middleware');
app.use(morgan('dev'));
app.use(express.raw({
	limit: '50mb',
	type: 'multipart/form-data'
}));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(multipartMiddleware);
app.use(requestParamsMiddleware);
app.use(tokenMiddleware);
app.use(makerMiddleware);

// * Create the API endpoint router

const api = express.Router();

// * Setup API routes
LOG_INFO('[RPG Maker] Applying imported routes');
api.use((_request: express.Request, response: express.Response, next: express.NextFunction): void => {
	response.set('Content-Type', 'text/html; charset=UTF-8');

	return next();
});
api.use('/api', flags);
api.use('/api', signin);
api.use('/api', username);
api.use('/api', contestlist);
api.use('/api', rpglist);
api.use('/api', rpglistpassword);
api.use('/api', rpglisttitle);
api.use('/api', myrpglist);
api.use('/api', rpgupload);

// * Create router for subdomain
const apiSubdomain = express.Router();

LOG_INFO('[RPG Maker] Creating \'rpg-maker\' subdomain');
apiSubdomain.use(subdomain('rpg-maker', api));

app.use(apiSubdomain);

// 404 handler
LOG_INFO('Creating 404 status handler');
app.use((request: express.Request, response: express.Response) => {
	const url: string = fullUrl(request);
	let deviceId: string | undefined = getValueFromHeaders(request.headers, 'X-Nintendo-Device-ID');

	if (!deviceId) {
		deviceId = 'Unknown';
	}

	LOG_WARN(`HTTP 404 at ${url} from ${deviceId}`);

	response.sendStatus(404);
});

// non-404 error handler
LOG_INFO('Creating non-404 status handler');
app.use((error: any, request: express.Request, response: express.Response, _next: express.NextFunction) => {
	const status: number = error.status || 500;
	const url: string = fullUrl(request);
	let deviceId: string | undefined = getValueFromHeaders(request.headers, 'X-Nintendo-Device-ID');

	if (!deviceId) {
		deviceId = 'Unknown';
	}

	LOG_WARN(`HTTP ${status} at ${url} from ${deviceId}: ${error.message}`);

	response.status(status);
	response.json({
		app: 'rpg-maker',
		status: status,
		error: error.message
	});
});

async function main(): Promise<void> {
	// Starts the server
	LOG_INFO('Starting server');

	await connectDatabase();

	app.listen(port, () => {
		LOG_SUCCESS(`Server started on port ${port}`);
	});
}

main().catch(console.error);