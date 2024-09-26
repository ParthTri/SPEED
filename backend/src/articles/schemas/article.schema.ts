import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
