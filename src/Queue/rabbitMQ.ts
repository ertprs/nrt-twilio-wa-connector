import {inject, injectable} from "inversify";
import * as amqp from 'amqp-ts';
import {RabbitMQConstants} from './rabbitMQConstants';

@injectable()
export class RabbitMQ {
    private queue: any;

    constructor() {
        const connection = new amqp.Connection(RabbitMQConstants.QUEUE_HOST);
        this.queue = connection.declareQueue(RabbitMQConstants.QUEUE_NAME, {durable: true});
    }

    public send(message: any) {
        this.queue.send(message);
        return true;
    }
}