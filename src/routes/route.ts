import BodyParser from "body-parser";
import Express, { Router } from "express";
import { IBaseRoute } from "./IBaseRoute";

export default abstract class Route implements IBaseRoute {
    protected router: Express.Router = Router();

    constructor(private path: string) {
        this.initializeMiddleware();
        this.initializeRoutes();
    }
    public abstract initializeRoutes(): void;

    public getRouter(): Express.Router {
        return this.router;
    }
    public getBasePath(): string {
        return this.path;
    }

    private initializeMiddleware(): void {
        this.router.use(BodyParser.json({ limit: "50mb" }));
    }
}
