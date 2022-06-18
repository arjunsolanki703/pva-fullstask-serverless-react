// lambda.ts

import * as redis from 'redis';

import { Context, Handler } from 'aws-lambda';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './environments';
import { createServer, proxy } from 'aws-serverless-express';

import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Server } from 'http';
import { eventContext } from 'aws-serverless-express/middleware';

const client = redis.createClient({
	host: REDIS_HOST,
	port: REDIS_PORT,
	password: REDIS_PASSWORD,
});

client.on('connect', function () {});

(global as any).redisCache = client;

const express = require('express');

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

// function setupSwagger(app: INestApplication) {
// 	const options = new DocumentBuilder()
// 		.setTitle('PVA Deals')
// 		.setDescription('The PVA Deals API docs')
// 		.setVersion('1.0')
// 		.addServer('/dev')
// 		.addBearerAuth(
// 			{ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
// 			'x-token'
// 		)
// 		.build();
// 	const document = SwaggerModule.createDocument(app, options);
// 	SwaggerModule.setup('/api', app, document);
// }

async function bootstrapServer(): Promise<Server> {
	if (!cachedServer) {
		const expressApp = express();
		const nestApp = await NestFactory.create(
			AppModule,
			new ExpressAdapter(expressApp),
			{ logger: [] }
		);
		nestApp.enableCors({ origin: '*', credentials: true });
		nestApp.use(eventContext());
		// setupSwagger(nestApp);
		await nestApp.init();
		cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
	}
	return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
	// if (event.path === '/api') {
	// 	event.path = '/api/';
	// }
	// if (event.path?.includes('swagger-ui') != undefined) {
	// 	event.path = event.path.includes('swagger-ui')
	// 		? `/api${event.path}`
	// 		: event.path;
	// }

	cachedServer = await bootstrapServer();
	context.sourceIp = event.requestContext.identity.sourceIp;
	context.callbackWaitsForEmptyEventLoop = false;
	return proxy(cachedServer, event, context, 'PROMISE').promise;
};
