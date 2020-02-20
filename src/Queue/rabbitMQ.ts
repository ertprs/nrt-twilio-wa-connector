import {injectable} from "inversify";
import * as amqp from 'amqp-ts';
import {RabbitMQConstants} from './rabbitMQConstants';

@injectable()
export class RabbitMQ {
    private incomingQueue: amqp.Queue;
    private outgoingQueue: amqp.Queue;

    constructor() {
        const connection = new amqp.Connection(RabbitMQConstants.QUEUE_HOST);
        this.incomingQueue = connection.declareQueue(RabbitMQConstants.QUEUE_NAME_INCOMING, {durable: true});
        this.outgoingQueue = connection.declareQueue(RabbitMQConstants.QUEUE_NAME_OUTGOING, {durable: true});


        // TODO Should be removed
        //  Added just for test RabbitMQ
        // this.outgoingQueue = connection.declareQueue(RabbitMQConstants.QUEUE_NAME_INCOMING, {durable: true});
    }

    public send(message: any): boolean {
        this.incomingQueue.send(new amqp.Message(message));
        return true;
    }

    public receive(callbackFunction: any) {
        // TODO Later can replace to Promises
        this.outgoingQueue.activateConsumer((message) => {
            callbackFunction(message.getContent());
        })
    }
}