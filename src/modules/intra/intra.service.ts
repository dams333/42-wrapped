import { Client } from '42.js';
import { AuthProcess } from '42.js/dist/auth/auth_manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntraService {
	private _client: Client;
	private _auth_process: AuthProcess;

	constructor() {
		this._client = new Client(
			<string>process.env.API_CLIENT_ID,
			<string>process.env.API_CLIENT_SECRET,
		);
	}

	get apiClient(): Client {
		return this._client;
	}

	async getAuthProcess(url: string | null): Promise<AuthProcess> {
		if (!this._auth_process && url) {
			this._auth_process =
				await this.apiClient.auth_manager.init_auth_process(url, [
					'public',
				]);
		}
		return this._auth_process;
	}
}
