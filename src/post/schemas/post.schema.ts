import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/user.schema';
import { Comment } from './comment.schema'; // The Comment schema will be defined next

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  content: string;

  @Prop()
  imageUrl?: string;

  @Prop({ type: String, ref: 'User', required: true })
  authorId: string;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  likes: string[];

  @Prop({ type: [{ type: Comment, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
