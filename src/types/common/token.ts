export interface Token {
	system_type: number;
	token_type: number;
	pid: number;
	expire_time: bigint;
	title_id: bigint;
	access_level: number;
}