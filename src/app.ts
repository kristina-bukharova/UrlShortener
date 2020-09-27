import Server from './server';
import Dotenv from "dotenv";
import UrlShortener from './routes/controllers/urlShortener';
import PostgresDatabaseClient from './database/postgresClient';
import { PoolConfig } from 'pg';

Dotenv.config();

const main = (() => {
    const appPort: number | undefined = Number(process.env.APP_PORT);
    const user: string | undefined = process.env.PG_USER;
    const host: string | undefined = process.env.PG_HOST;
    const password: string | undefined = process.env.PG_PASSWORD;
    const database: string | undefined = process.env.PG_DATABASE;
    const dbPort: number | undefined = Number(process.env.PG_PORT);

    if (appPort && user && host && password && database && dbPort) {
        const postgresDatabaseConfig: PoolConfig = {
            user,
            host,
            database,
            password,
            port: dbPort,
        }
        const databaseClient = new PostgresDatabaseClient(postgresDatabaseConfig);
        const server: Server = new Server(
            appPort,
            [
                new UrlShortener(databaseClient),
            ],
        );
        server.start();
    } else {
        console.log("Please provide a populated .env file");
    }
});
main();