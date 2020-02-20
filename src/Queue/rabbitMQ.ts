import {inject, injectable} from "inversify";
import * as amqp from 'amqp-ts';

@injectable()
export class RabbitMQ {
    private queue: any;

    constructor() {
        console.log('constructoooooooor');
        const connection = new amqp.Connection();
        this.queue = connection.declareQueue('whatsapp-connector', {durable: true});
    }

    public send(message: any) {
        this.queue.send(message);
        return true;
    }
}