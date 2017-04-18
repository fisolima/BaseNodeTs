/// <reference path="../../typings/index.d.ts" />

//import * as express from 'express';

class App {
    constructor() {
    }

    public Start() {
        console.log('Client start');

        let div = document.createElement("div");

        div.innerHTML = 'Killpippo2';

        document.body.appendChild(div);
    }
}