import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Announcement {
	@Prop({ required: true, type: String })
	message: string;

	@Prop({ required: true })
	is_enable: boolean;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
export type AnnouncementDocument = Announcement & Document;
