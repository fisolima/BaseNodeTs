/// <reference path="../../typings/index.d.ts" />

class App {
    constructor(/* your injections here */) {
    }

    public Start() {
        console.log('Client start');

        let div = document.createElement("div");

        div.innerHTML = 'Killpippo';

        document.body.appendChild(div);
    }
}