import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from '../database/entities/post.entity';
import { PostMapper } from './mapper/post.mapper';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResDto } from './dto/post-res.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
    private readonly postsRepository: Repository<Post>,
    private readonly postMapper: PostMapper,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostResDto> {
    const post = this.postsRepository.create(createPostDto);
    const savedPost = await this.postsRepository.save(post);
    return this.postMapper.toResponseDto(savedPost);
  }

  async findAll(): Promise<PostResDto[]> {
    const posts = await this.postsRepository.find();
    return this.postMapper.toResponseDtoArray(posts);
  }

  async findOne(id: string): Promise<PostResDto> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return this.postMapper.toResponseDto(post);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostResDto> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    Object.assign(post, updatePostDto);
    const updatedPost = await this.postsRepository.save(post);
    return this.postMapper.toResponseDto(updatedPost);
  }

  async patch(id: string, updatePostDto: UpdatePostDto): Promise<PostResDto> {
    return this.update(id, updatePostDto);
  }

  async remove(id: string): Promise<{ message: string }> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    await this.postsRepository.softDelete(id);
    return { message: 'Post deleted successfully' };
  }
}
