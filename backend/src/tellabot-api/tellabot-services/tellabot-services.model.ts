import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TellabotService {
	@Prop({ required: true })
	name!: string;

	@Prop({ required: false, default: '' })
	custom_name!: string;

	@Prop({ required: true })
	credit: number;

	@Prop({ required: true, default: true })
	tellabot: boolean;

	@Prop({ required: false, default: '15m' })
	agent_accept_time: string;

	@Prop({ required: false, default: false })
	agent_handle_request: boolean;

	@Prop({ required: true, default: true })
	enable?: boolean;

	@Prop({ required: true, default: true })
	enable_ltr?: boolean;

	@Prop({ required: true, default: false })
	is_price_surge: boolean;

	@Prop({ required: false, default: 0 })
	price_after_surge: number;

	@Prop({ required: true, default: 0 })
	ltr_price: number;
}

export const TellabotServiceSchema =
	SchemaFactory.createForClass(TellabotService);

export type TellabotServiceDocument = TellabotService & Document;
