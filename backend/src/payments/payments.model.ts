import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '../users/users.model';

@Schema({ timestamps: true })
export class PaymentTransactionHistory {
	@Prop({ required: true, type: String })
	txn_id: string;

	@Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
	user_id: string;

	@Prop({ required: true, type: String })
	user_name: string;

	@Prop({ required: true, type: String })
	user_email: string;

	@Prop({ required: true, type: String })
	status: string; // INITIALIZE_TRANSACTION | TRANSACTION_COMPLETE | TRANSACTION_FAILED

	@Prop({ required: true, type: Number })
	amount: number;

	@Prop({ required: true, type: Number })
	old_amount: number;

	@Prop({ required: true, type: String })
	currency: string;

	@Prop({ required: true, type: String })
	payment_method: string;

	@Prop({ required: true, type: String })
	status_url: string;

	@Prop({ required: true, type: String })
	address: string;

	@Prop({ required: true, type: Boolean, default: false })
	is_credit_added: boolean;

	@Prop({ required: false, type: Boolean, default: false })
	is_by_admin: boolean;
}

export const PaymentTransactionHistorySchema = SchemaFactory.createForClass(
	PaymentTransactionHistory
);

export type PaymentTransactionHistoryDocument = PaymentTransactionHistory &
	Document;
