import 'reflect-metadata';
import {Container} from 'inversify';
import {TYPES} from './types';
import {RabbitMQ} from './src/Queue/rabbitMQ';

const container = new Container();

container.bind<RabbitMQ>(TYPES.RabbitMQ).to(RabbitMQ).inSingletonScope();

export default container;