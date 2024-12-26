export class CreatePostDto {
  content: string;
  imageUrl?: string;
  authorId: string;
  likes: string[]; // Array of user IDs for likes
}
