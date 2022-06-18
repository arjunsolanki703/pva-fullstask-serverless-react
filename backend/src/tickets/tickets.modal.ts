import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ObjectId } from 'mongoose';
import { User } from '../users/users.model';

@Schema({})
export class MessageService {
	@Prop({ type: String, required: false })
	user_name: string;

	@Prop({ type: String, required: false })
	user_id: string;

	@Prop({ type: String, required: false })
	user_email: string;

	@Prop({ type: String, required: false })
	user_type: string;

	@Prop({ type: String, required: false })
	message: string;
}

@Schema({ timestamps: true })
export class Ticket {
	@Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
	user_id: string;

	@Prop({ required: true, type: String })
	user_name: string;

	@Prop({ required: true, type: String })
	user_email: string;

	@Prop({ required: true, type: String })
	subject: string;

	@Prop({ required: true, type: String })
	status: string;

	@Prop({
		required: false,
		type: MongooseSchema.Types.ObjectId,
	})
	to_id: string;

	@Prop({
		required: false,
		type: String ,
	})
	to_user: string;

	@Prop({
		required: false,
		type: String,
	})
	to_email: string;

	@Prop({ required: true, raw: [MessageService] })
	messages: MessageService[];
}

export const ToicketSchema = SchemaFactory.createForClass(Ticket);
export type ToicketDocument = Ticket & Document;
