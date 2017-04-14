/// <reference path="../../../typings/index.d.ts" />

import * as express from 'express';

export class BaseController {
    protected route: express.Router;

    constructor() {
        this.route = express.Router();
    }

    public Route() {
        return this.route;
    }
}