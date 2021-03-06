import { Pool } from 'pg';
import { IDatabaseClient } from './IDatabaseClient';

export default class PostgresDatabaseClient implements IDatabaseClient {
    private pool: Pool;
    private tableName: string = "url_info";

    constructor(private config: any) {
        this.pool = new Pool(this.config);
    }

    public async getUrlInfo(id: number) {
        try {
            const results = await this.pool.query(`SELECT * from ${this.tableName} WHERE id = $1`, [id]);
            if (results.rows.length !== 0) {
                return results.rows[0];
            }
            return null;
        } catch (err) {
            throw new Error(`Failed to retrieve record: ${err.message}`);
        }
    }

    public async createNewUrlRecord(originalUrl: string): Promise<number> {
        try {
            const results = await this.pool.query(`INSERT INTO ${this.tableName}(original_url) VALUES($1) RETURNING id`, [originalUrl]);
            return results.rows[0].id;
        } catch (err) {
            throw new Error(`Failed to insert new record: ${err.message}`);
        }
    }

    public async setShortenedUrl(id: number, shortenedUrl: string): Promise<void> {
        try {
            await this.pool.query(`UPDATE ${this.tableName} SET shortened_url = $1 WHERE id = $2;`, [shortenedUrl, id]);
        } catch (err) {
            throw new Error(`Failed to update record: ${err.message}`);
        }
    }
}
