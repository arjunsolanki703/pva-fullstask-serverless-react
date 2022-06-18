import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/users.model';

@Schema({})
export class NewTellabotService {
	@Prop({ type: String, required: false })
	service_id: string;

	@Prop({ type: String, required: false })
	name: string;
	@Prop({ type: String, required: false })
	custom_name: string;

	@Prop({ type: Number, required: false })
	credit: number;

	@Prop({ type: Number, required: false })
	ltr_price: number;

	@Prop({ type: Boolean, required: false })
	tellabot: boolean;

	@Prop({ type: Boolean, required: false })
	enable: boolean;

	@Prop({ type: Boolean, required: false })
	is_price_surge: boolean;

	@Prop({ type: Number, required: false })
	price_after_surge: number;

	@Prop({ type: String, required: false, default: '' })
	message_id: string;

	@Prop({ type: String, required: false, default: '' })
	state: string;
}

export class TellabotServiceRequestCredits {
	@Prop({ type: [NewTellabotService], required: true })
	services: NewTellabotService[];
	@Prop({ type: Number, required: true })
	totalCreditCharge: number;
}

@Schema({ timestamps: true })
export class TellabotTransaction {
	@Prop({ raw: TellabotServiceRequestCredits, required: true })
	credit: TellabotServiceRequestCredits;

	@Prop({ required: false, type: String })
	number: string;

	@Prop({ required: true, type: String }) // INITIALIZE | NUMBER_ASSIGNED | OUT_OF_STOCK | COMPLETED | CANCELLED | TIMEOUT
	status: string;

	@Prop({
		required: true,
		type: MongooseSchema.Types.ObjectId,
		ref: User.name,
	})
	user_id: string;

	@Prop({ required: true, type: String })
	user_name: string;

	@Prop({ required: true, type: String })
	user_email: string;

	@Prop({ type: String, required: false })
	served_by: string;

	@Prop({ type: String, required: false })
	agent: string;

	@Prop({ type: String, required: false })
	endtime: string;

	@Prop({ type: Boolean, required: true, default: false })
	is_reactivate: boolean;

	@Prop({ type: Boolean, required: true, default: false })
	is_charge_cut: boolean;

	@Prop({ type: Boolean, required: true, default: false })
	active: boolean;

	@Prop({ type: Boolean, required: true, default: false })
	is_ltr: boolean;

	@Prop({ type: Boolean, required: true, default: false })
	ltr_autorenew: boolean;

	@Prop({ type: Number, required: false })
	old_credit: number;

	@Prop({ type: String })
	LTRNumberStatus: string;

	@Prop({ type: String, })
	LTRActiveTime: string;

	@Prop({ type: String, })
	LTRActiveTimeDate: string;
}

export const TellabotTransactionSchema =
	SchemaFactory.createForClass(TellabotTransaction);

export type TellabotTransactionDocument = TellabotTransaction & Document;
