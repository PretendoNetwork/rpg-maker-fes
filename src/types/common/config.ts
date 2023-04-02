import mongoose from 'mongoose';

export interface Config {
	http: {
		port: number;
	};
	mongoose: {
		connection_string: string;
		options: mongoose.ConnectOptions;
	};
	s3: {
		endpoint: string;
		region: string;
		bucket: string;
		key: string;
		secret: string;
	};
	cdn: {
		disk_path: string;
	};
	aes_key: string;
}

export interface DisabledFeatures {
	s3: boolean
}