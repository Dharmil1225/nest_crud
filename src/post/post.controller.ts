import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResDto } from './dto/post-res.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResDto,
  })
  async create(@Body() createPostDto: CreatePostDto) {
    const data = await this.postService.create(createPostDto);
    return {
      data,
      message: 'Post created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    type: [PostResDto],
  })
  async findAll() {
    const data = await this.postService.findAll();
    return {
      data,
      message: 'Posts retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    type: PostResDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.postService.findOne(id);
    return {
      data,
      message: 'Post retrieved successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post (replace)' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const data = await this.postService.update(id, updatePostDto);
    return {
      data,
      message: 'Post updated successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post (partial)' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async patch(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const data = await this.postService.patch(id, updatePostDto);
    return {
      data,
      message: 'Post updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id') id: string) {
    const data = await this.postService.remove(id);
    return {
      data,
      message: data.message,
    };
  }
}
