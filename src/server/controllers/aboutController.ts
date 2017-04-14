/// <reference path="../../../typings/index.d.ts" />

import * as express from 'express';
import * as base from './baseController';

export class AboutController extends base.BaseController {    
    constructor() {
        super();

        this.route.get('/about', this.Index);
    }

    private Index(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.end('About Killpippo');
    }
}