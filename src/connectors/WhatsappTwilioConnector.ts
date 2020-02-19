import Connector from "./Connector";
import {Logger} from "@overnightjs/logger";
import * as Amqp from "amqp-ts";
const twilio = require('twilio');

export class WhatsappTwilioConnector extends Connector {
    private static readonly CONNECTOR_NAME: string = 'Whatsapp Twilio Connector';
    private readonly incomingPort: number;
    private readonly outgoingPort: number;
    private readonly exchangeName: string = 'connectors';
    private readonly queueName: string = 'WATwilioConnector';
    private queue: Amqp.Queue;

    constructor(incomingPort: number, outgoingPort: number) {
        super();
        this.initRabbitMQConnection();
        this.incomingPort = incomingPort;
        this.outgoingPort = outgoingPort;
        this.listen();
    }

    private initRabbitMQConnection(): void {
        const connection = new Amqp.Connection("amqp://localhost");
        const exchange = connection.declareExchange(this.exchangeName);
        this.queue = connection.declareQueue(this.queueName);
        this.queue.bind(exchange);
    }

    private listen (): void {
        this.app.listen(this.incomingPort, () => {
            Logger.Imp(WhatsappTwilioConnector.CONNECTOR_NAME + this.incomingPort);
            this.app.post('/twilio-incoming-message', (request, response) => {
                this.messageIn(request.body);
            });
        });


        // TODO Don't know, do we need to listen port
        //  Or just to create queue client and listen on the event
        this.app.listen(this.outgoingPort, () => {
            Logger.Imp(WhatsappTwilioConnector.CONNECTOR_NAME + this.outgoingPort);
            this.app.post('/twilio-outgoing-message', (request, response) => {
                console.log(request.body);

                // TODO This data will be get from queue
                //  just now hardcoded
                const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
                let testOutgoingMessage = {
                    'from': twilioPhoneNumber,
                    'to': 'whatsapp:' + '+380971303915',
                    'body': 'test body message'
                };

                this.messageOut(testOutgoingMessage);

                // this.messageOut(request.body);
            });
        })
    }

    public messageIn(message: any): void {
        this.queue.send(new Amqp.Message(message));
    }

    public messageOut(message: any): void {
        // TODO remove later these lines, because later
        //  this data will be already in message object
        const accountId           = process.env.TWILIO_ACCOUNT_ID;
        const authToken           = process.env.TWILIO_AUTH_TOKEN;
        const client              = twilio(accountId, authToken);

        // TODO Code above will be replaced to code below
        // const client              = twilio(message.accountId, message.authToken);
        // delete message.accountId;
        // delete message.authToken;


        client.messages.create(message).then((response: any) => {
            console.log(response);
        }).catch((error: any) =>  {
            console.log(error);
        })
    }

}

export default WhatsappTwilioConnector;