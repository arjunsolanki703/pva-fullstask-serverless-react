import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class News {
	@Prop({ required: true, type: String })
	title: string;

	@Prop({ required: true, type: String })
	description: string;

	@Prop({ required: true, type: String })
	createdAt: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);

export type NewsDocument = News & Document;
