import Express from "express";
import { Converter } from "../../utils/converter";
import { IDatabaseClient } from "../../database/IDatabaseClient";
import Route from "../route";
import UrlValidator from "../../utils/urlValidator";

type UrlDetails = {
    id: number,
    shortenedUrl: string,
    originalUrl: string,
}

export default class UrlShortener extends Route {
    constructor(private databaseClient: IDatabaseClient) {
        super("/");
    }

    public initializeRoutes() {
        this.router.post("/shorten/", this.getShortenedUrl.bind(this));
        this.router.get("/urls/:urlHash", this.getUrlDetailsFromHash.bind(this));
        this.router.get("/:urlHash", this.redirectToFullUrl.bind(this));
    }

    public async getShortenedUrl(request: Express.Request, response: Express.Response): Promise<Express.Response> {
        const originalUrl = request.body.url;

        if (!originalUrl || typeof originalUrl !== "string") {
            return response.status(400).send("Please provide a payload with a url parameter of type string.");
        }
        if (!UrlValidator.isValidHttpUrl(originalUrl)) {
            return response.status(400).send("Please provide a valid URL.");
        }

        try {
            const id = await this.databaseClient.createNewUrlRecord(originalUrl);
            const shortenedUrl = Converter.encodeNumberToString(id);
            await this.databaseClient.setShortenedUrl(id, request.headers.host + "/" + shortenedUrl);
            const dbRecord = await this.databaseClient.getUrlInfo(id);
        
            const apiResponse: UrlDetails = {
                id: dbRecord.id,
                originalUrl: dbRecord.original_url,
                shortenedUrl: dbRecord.shortened_url,
            };
            return response.status(200).send(apiResponse);      
        } catch (err) {
            return response.status(500).send(err.message);
        }
    }

    public async getUrlDetailsFromHash(request: Express.Request, response: Express.Response): Promise<Express.Response> {
        const urlHash = request.params.urlHash;
        const id = Converter.decodeStringToNumber(urlHash);

        try {
            const dbRecord = await this.databaseClient.getUrlInfo(id);
            if (!dbRecord) {
                return response.status(404).send("No record for the given URL hash.");
            }
            const urlDetails: UrlDetails = {
                id: dbRecord.id,
                originalUrl: dbRecord.original_url,
                shortenedUrl: dbRecord.shortened_url,
            };
            return response.status(200).send(urlDetails)
        } catch (err) {
            return response.status(500).send(err.message);
        }
        
    }

    public async redirectToFullUrl(request: Express.Request, response: Express.Response): Promise<void | Express.Response> {
        const urlHash = request.params.urlHash;
        const id = Converter.decodeStringToNumber(urlHash);

        try {
            const dbRecord = await this.databaseClient.getUrlInfo(id);
            if (!dbRecord) {
                return response.status(404).send("Invalid short URL.");
            }
            const fullUrl = dbRecord.original_url;
            return response.redirect(fullUrl);
        } catch (err) {
            return response.status(500).send(err.message);
        }
    }
}