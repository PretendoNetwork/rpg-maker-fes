import fs from 'fs-extra';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LOG_INFO, LOG_WARN, LOG_ERROR } from '@/logger';
import { Config, DisabledFeatures } from '@/types/common/config';

dotenv.config();

export const disabledFeatures: DisabledFeatures = {
	s3: false
};

LOG_INFO('Loading config');

let mongooseConnectOptions: mongoose.ConnectOptions = {};

if (process.env.PN_RPG_MAKER_CONFIG_MONGOOSE_CONNECT_OPTIONS_PATH) {
	mongooseConnectOptions = fs.readJSONSync(process.env.PN_RPG_MAKER_CONFIG_MONGOOSE_CONNECT_OPTIONS_PATH);
}

export const config: Config = {
	http: {
		port: Number(process.env.PN_RPG_MAKER_CONFIG_HTTP_PORT || '')
	},
	mongoose: {
		connection_string: process.env.PN_RPG_MAKER_CONFIG_MONGO_CONNECTION_STRING || '',
		options: mongooseConnectOptions
	},
	s3: {
		endpoint: process.env.PN_RPG_MAKER_CONFIG_S3_ENDPOINT || '',
		region: process.env.PN_RPG_MAKER_CONFIG_S3_REGION || '',
		bucket: process.env.PN_RPG_MAKER_CONFIG_S3_BUCKET || '',
		key: process.env.PN_RPG_MAKER_CONFIG_S3_ACCESS_KEY || '',
		secret: process.env.PN_RPG_MAKER_CONFIG_S3_ACCESS_SECRET || ''
	},
	cdn: {
		disk_path: process.env.PN_RPG_MAKER_CONFIG_CDN_DISK_PATH || ''
	},
	aes_key: process.env.PN_RPG_MAKER_CONFIG_AES_KEY || ''
};

LOG_INFO('Config loaded, checking integrity');

if (!config.http.port) {
	LOG_ERROR('Failed to find HTTP port. Set the PN_RPG_MAKER_CONFIG_HTTP_PORT environment variable');
	process.exit(0);
}

if (!config.mongoose.connection_string) {
	LOG_ERROR('Failed to find MongoDB connection string. Set the PN_RPG_MAKER_CONFIG_MONGO_CONNECTION_STRING environment variable');
	process.exit(0);
}

if (!config.s3.endpoint) {
	LOG_WARN('Failed to find s3 endpoint config. Disabling feature. To enable feature set the PN_RPG_MAKER_CONFIG_S3_ENDPOINT environment variable');
	disabledFeatures.s3 = true;
}

if (!config.s3.region) {
	LOG_WARN('Failed to find s3 region config. Disabling feature. To enable feature set the PN_RPG_MAKER_CONFIG_S3_REGION environment variable');
	disabledFeatures.s3 = true;
}

if (!config.s3.bucket) {
	LOG_WARN('Failed to find s3 bucket config. Disabling feature. To enable feature set the PN_RPG_MAKER_CONFIG_S3_BUCKET environment variable');
	disabledFeatures.s3 = true;
}

if (!config.s3.key) {
	LOG_WARN('Failed to find s3 access key config. Disabling feature. To enable feature set the PN_RPG_MAKER_CONFIG_S3_ACCESS_KEY environment variable');
	disabledFeatures.s3 = true;
}

if (!config.s3.secret) {
	LOG_WARN('Failed to find s3 secret key config. Disabling feature. To enable feature set the PN_RPG_MAKER_CONFIG_S3_ACCESS_SECRET environment variable');
	disabledFeatures.s3 = true;
}

if (disabledFeatures.s3) {
	if (!config.cdn.disk_path) {
		LOG_ERROR('s3 file storage is disabled and no CDN disk path was set. Set the PN_RPG_MAKER_CONFIG_CDN_DISK_PATH environment variable');
		process.exit(0);
	}
}

if (!config.http.port) {
	LOG_ERROR('Failed to find HTTP port. Set the PN_RPG_MAKER_CONFIG_HTTP_PORT environment variable');
	process.exit(0);
}

if (!config.aes_key) {
	LOG_ERROR('Token AES key is not set. Set the PN_RPG_MAKER_CONFIG_AES_KEY environment variable to your AES-256-CBC key');
	process.exit(0);
}