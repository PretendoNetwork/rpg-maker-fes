import { PostRequestArgs } from '@/types/common/post-request-args';
import { Token } from '@/types/common/token';
import { HydratedMakerDocument } from '@/types/mongoose/maker';

declare global {
	namespace Express {
		interface Request {
			file: Buffer;
			args: PostRequestArgs;
			token: Token;
			maker: HydratedMakerDocument | null;
		}
	}
}