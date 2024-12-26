import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto'; // Define DTO for creating posts
import { Post as PostModel } from './schemas/post.schema'; // Import Post schema
import { Comment } from './schemas/comment.schema';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Route to create a post
  @Post('create')
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  // Route to add a comment to a post
  @Post(':postId/comment')
  async addComment(
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Body('authorId') authorId: string,
  ): Promise<Comment> {
    return this.postService.addCommentToPost(postId, content, authorId);
  }

  // Route to get all posts
  @Get()
  async getAllPosts(): Promise<PostModel[]> {
    return this.postService.getAllPosts();
  }

  // Route to get a post by its ID
  @Get(':postId')
  async getPostById(@Param('postId') postId: string): Promise<PostModel> {
    const post = await this.postService.getPostById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }
}
