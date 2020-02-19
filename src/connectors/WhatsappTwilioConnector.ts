import Connector from "./Connector";
import {Logger} from "@overnightjs/logger";
const twilio = require('twilio');

export class WhatsappTwilioConnector extends Connector {
    private static readonly CONNECTOR_NAME: string = 'Whatsapp Twilio Connector';
    private readonly incomingPort:number;
    private readonly outgoingPort:number;

    constructor(incomingPort: number, outgoingPort: number) {
        super();
        this.incomingPort = incomingPort;
        this.outgoingPort = outgoingPort;
        this.listen();
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
        // TODO Should send data into queue
        console.log (message);
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