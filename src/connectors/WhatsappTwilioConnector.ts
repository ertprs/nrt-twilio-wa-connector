import Connector from "./Connector";
import {Logger} from "@overnightjs/logger";
import {injectable} from "inversify";
import {RabbitMQ} from '../Queue/rabbitMQ';
import {TYPES} from '../../types';
import container from "../../inversify.config";
const twilio = require('twilio');

@injectable()
export class WhatsappTwilioConnector extends Connector {
    private static readonly CONNECTOR_NAME: string = 'Whatsapp Twilio Connector';
    private readonly incomingPort:number;
    private readonly outgoingPort:number;
    private rabbitMQ: RabbitMQ;

    constructor(incomingPort: number, outgoingPort: number) {
        super();
        this.incomingPort = incomingPort;
        this.outgoingPort = outgoingPort;
        this.rabbitMQ = container.get<RabbitMQ>(TYPES.RabbitMQ);
        this.listen();
    }

    private listen (): void {
        this.app.listen(this.incomingPort, () => {
            Logger.Imp(WhatsappTwilioConnector.CONNECTOR_NAME + this.incomingPort);
            this.app.post('/twilio-incoming-message', (request, response) => {
                this.messageIn(request.body);
            });
        });


        this.rabbitMQ.receive((message: string) => {
            console.log ('[x] Get object from outgoing queue');
            // TODO This data will be get from queue
            //  just now hardcoded

            const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
            let testOutgoingMessage = {
                'from': twilioPhoneNumber,
                'to': 'whatsapp:' + '+380971303915',
                'body': 'test body message'
            };

            this.messageOut(testOutgoingMessage);

            // this.messageOut(message);
        });
    }

    public messageIn(message: any): void {
        // Should send data into queue
        this.rabbitMQ.send(message);
        console.log(' [x] Sent \'' + message + '\'');
    }

    public messageOut(message: any): void {
        // TODO remove later these lines, because later
        //  this data will be already in message object
        const accountId           = process.env.TWILIO_ACCOUNT_ID;
        const authToken           = process.env.TWILIO_AUTH_TOKEN;
        const client              = twilio(accountId, authToken);

        client.messages.create(message).then((response: any) => {
            console.log(response);
        }).catch((error: any) =>  {
            console.log(error);
        })
    }

}

export default WhatsappTwilioConnector;