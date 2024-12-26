// comment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })  // Ensure correct type and reference
  authorId: string;

  @Prop({ required: true })
  postId: string; // Reference to the post
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

