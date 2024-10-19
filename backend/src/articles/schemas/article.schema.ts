import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Rating {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;
}

@Schema()
export class Article extends Document {
  @Prop()
  title: string;

  @Prop([String])
  authors: string[];

  @Prop()
  source: string;

  @Prop()
  pubyear: number;

  @Prop()
  doi: string;

  @Prop()
  summary: string;

  @Prop()
  linked_discussion: string;

  @Prop()
  state: string;

  @Prop()
  claim: string;

  @Prop()
  evidence: string;
  @Prop({ type: [{ user_id: String, rating: Number }], default: [] })
  ratings: Rating[];

  @Prop({ default: 0 })
  average_rating: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
