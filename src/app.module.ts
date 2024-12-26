import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { User, UserSchema } from './users/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PostController } from './post/post.controller'; // Import PostsController
import { PostService } from './post/post.service'; // Import PostService
import { Post, PostSchema } from './post/schemas/post.schema';
import { Comment, CommentSchema } from './post/schemas/comment.schema'; // Import Comment schema here

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Folder where files will be stored
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
    MongooseModule.forRoot('mongodb://localhost/auth-app'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, PostController], // Add PostsController here
  providers: [UserService, PostService], // Add PostService here
})
export class AppModule {}
