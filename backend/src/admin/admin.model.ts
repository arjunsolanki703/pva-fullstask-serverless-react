import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class AdminSetting {
	@Prop({ required: true })
	maintenance: boolean;

	@Prop({ required: false })
	message: string;

	@Prop({ required: false ,default: false })
	signupmode: boolean;
}

export const AdminSettingSchema = SchemaFactory.createForClass(AdminSetting);

export type AdminSettingDocument = AdminSetting & Document;
