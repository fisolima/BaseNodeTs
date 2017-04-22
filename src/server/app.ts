/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import * as path from 'path';
import * as home from './controllers/homeController';
import * as about from './controllers/aboutController';

export class App {
    app: express.Application;

    constructor(/* your injections here */) {
        this.app = express();

        this.RouteConfig();
    }

    public RouteConfig() {
        let homeController = new home.HomeController();
        let aboutController = new about.AboutController();

        this.app.use(express.static(path.join(__dirname, "../public")));

        this.app.get('/favicon.ico', (req: express.Request, res: express.Response) => {
            res.end();
        });

        this.app.use(homeController.Route());
        this.app.use(aboutController.Route());

        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            next(new Error('[404] Not Found: ' + req.url));
        });
    }

    public Start() {
        this.app.listen(3000, () => {
            console.log('listening on 3000');
        });
    }
}