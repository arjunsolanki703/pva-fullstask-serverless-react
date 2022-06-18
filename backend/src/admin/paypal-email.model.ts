import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class PaypalEmail {
	@Prop({ required: false })
	paypalEmail: string;
}

export const PaypalEmailSchema = SchemaFactory.createForClass(PaypalEmail);

export type PaypalEmailDocument = PaypalEmail & Document;
