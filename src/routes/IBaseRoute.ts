import Express from "express";

export interface IBaseRoute {
    getRouter(): Express.Router;
    getBasePath(): string;
}
