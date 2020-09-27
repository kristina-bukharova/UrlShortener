import BodyParser from 'body-parser';
import Express from "express";

class Server {
    private app: any;

    constructor(private port: number, controllers: any[]) {
        this.port = port;
        this.app = Express();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
    }

    public start(): void {
        this.app.listen(this.port, (err: Error) => {
            if (err) {
                console.log(`Error starting server: ${err}`);
            } else {
                console.log(`Server started on port ${this.port}`);
            }
        });
    }

    private initializeMiddleware(): void {
        this.app.use(BodyParser.urlencoded({ extended:true }));
        this.app.use(BodyParser.json({ limit: '50mb' }));
    }

    private initializeControllers(controllers: any[]): void {
        controllers.forEach((controller: any) => {
            this.app.use(controller.getBasePath(), controller.getRouter());
        });
    }
}

export default Server;