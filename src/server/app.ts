/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import * as home from './controllers/homeController';
import * as about from './controllers/aboutController';

export class App {
    app: express.Application;

    constructor() {
        this.app = express();

        this.RouteConfig();
    }

    public RouteConfig() {
        let homeController = new home.HomeController();
        let aboutController = new about.AboutController();

        this.app.use(homeController.Route());
        this.app.use(aboutController.Route());
    }

    public Start() {
        this.app.listen(3000, function() {
            console.log('listening on 3000');
        });
    }
}