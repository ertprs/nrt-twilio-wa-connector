import WhatsappTwilioConnector from './connectors/WhatsappTwilioConnector';
import * as dotenv from "dotenv";

dotenv.config();

new WhatsappTwilioConnector(
    Number(process.env.APP_INCOMING_PORT),
    Number(process.env.APP_OUTGOING_PORT),
);