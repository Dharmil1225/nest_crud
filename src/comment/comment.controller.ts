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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResDto } from './dto/comment-res.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentResDto,
  })
  async create(@Body() createCommentDto: CreateCommentDto) {
    const data = await this.commentService.create(createCommentDto);
    return {
      data,
      message: 'Comment created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: [CommentResDto],
  })
  async findAll() {
    const data = await this.commentService.findAll();
    return {
      data,
      message: 'Comments retrieved successfully',
    };
  }

  @Get('task/:taskId')
  @ApiOperation({ summary: 'Get comments by task ID' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: [CommentResDto],
  })
  async findByTaskId(@Param('taskId') taskId: string) {
    const data = await this.commentService.findByTaskId(taskId);
    return {
      data,
      message: 'Comments retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
    type: CommentResDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.commentService.findOne(id);
    return {
      data,
      message: 'Comment retrieved successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment (replace)' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: CommentResDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const data = await this.commentService.update(id, updateCommentDto);
    return {
      data,
      message: 'Comment updated successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment (partial)' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: CommentResDto,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async patch(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const data = await this.commentService.patch(id, updateCommentDto);
    return {
      data,
      message: 'Comment updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async remove(@Param('id') id: string) {
    const data = await this.commentService.remove(id);
    return {
      data,
      message: data.message,
    };
  }
}
