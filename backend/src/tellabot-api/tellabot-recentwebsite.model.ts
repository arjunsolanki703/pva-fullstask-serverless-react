import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/users.model';

@Schema({ timestamps: true })
export class RecentWebsite {
	@Prop({
		required: true,
		type: MongooseSchema.Types.ObjectId,
		ref: User.name,
	})
	user_id: string;

	@Prop({ required: true, type: String })
	user_email: string;

	@Prop({ type: String, required: false })
	service_id: string;

	@Prop({ type: String, required: false })
	name: string;
	@Prop({ type: String, required: false })
	custom_name: string;

	@Prop({ type: Number, required: false })
	credit: number;

	@Prop({ type: Boolean, required: false })
	is_ltr: boolean;

	@Prop({ type: Boolean, required: false })
	is_active: boolean;
}

export const RecentWebsiteSchema = SchemaFactory.createForClass(RecentWebsite);

export type RecentWebsiteDocument = RecentWebsite & Document;
