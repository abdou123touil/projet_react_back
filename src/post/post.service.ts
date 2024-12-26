import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { Comment } from './schemas/comment.schema';
import { CreatePostDto } from './dto/create-post.dto'; // Define DTO for creating posts

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    return await newPost.save();
  }
  async addCommentToPost(
    postId: string,
    content: string,
    authorId: string,
  ): Promise<Comment> {
    // Create a new comment
    const newComment = new this.commentModel({
      content,
      authorId,
      postId,
    });

    // Save the new comment
    await newComment.save();

    // Populate the author's details
    const populatedComment = await this.commentModel
      .findById(newComment._id)
      .populate('authorId', 'firstName lastName') // Make sure to populate firstName and lastName
      .exec();

    // Add the comment to the post's comments array
    await this.postModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            _id: newComment._id,
            content: newComment.content,
            authorId: populatedComment.authorId, // Push the populated authorId with details
          },
        },
      },
      { new: true },
    );

    // Return the populated comment with author details
    return populatedComment;
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postModel
      .find()
      .populate({
        path: 'comments',
        populate: {
          path: 'authorId', // Populate the author inside each comment
          select: 'firstName lastName', // Include firstName and lastName from the author
        },
      })
      .exec();
  }

  // Get a post by its ID
  async getPostById(postId: string): Promise<Post> {
    const post = await this.postModel
      .findById(postId)
      .populate({
        path: 'comments', // Populate the comments array
        populate: {
          path: 'authorId', // Populate the author inside each comment
          select: 'firstName lastName', // Include firstName and lastName from the author
        },
      })
      .exec();

    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }
}
