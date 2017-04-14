/// <reference path="../../../typings/index.d.ts" />

import * as express from 'express';
import * as base from './baseController';

export class HomeController extends base.BaseController {    
    constructor() {
        super();

        this.route.get('/', this.Index);
    }

    private Index(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.end('Hello Killpippo');
    }
}