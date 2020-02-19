import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';

export default class Connector extends Server {
    constructor() {
        super()
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }
}