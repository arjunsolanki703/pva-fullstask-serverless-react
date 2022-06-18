import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: false })
	password: string;

	@Prop()
	country: string;

	@Prop({ required: false })
	contact: string;

	@Prop({ default: 0, type: Number })
	credits: number;

	@Prop({ default: 0, type: Number })
	hold_credit: number;

	@Prop()
	skype: string;

	@Prop({ default: 'notverified' })
	status: string;

	@Prop({ required: false })
	usage: number;

	@Prop({ required: true, default: 'client' })
	user_type: string;

	@Prop({ required: false })
	api_key: string;

	@Prop({ type: Date, required: false })
	last_login: Date;

	@Prop({ type: Boolean, required: true, default: false })
	unreaded_news: Boolean;

	@Prop({required: true ,default: true})
	active: Boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
