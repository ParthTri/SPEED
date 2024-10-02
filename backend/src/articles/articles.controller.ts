import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './schemas/article.schema';
import { CreateArticleDTO } from './createArticle.dto';

@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getAllArticles(): Promise<Article[]> {
    return this.articlesService.getAllArticles(); // Return the articles from the service
  }

  //get all articles with pending state
  @Get('pending')
  async getPendingArticles(): Promise<Article[]> {
    return this.articlesService.getArticlesByState('pending');
  }

  //get all articles with approved state
  @Get('rejected')
  async getRejectedArticles(): Promise<Article[]> {
    return this.articlesService.getArticlesByState('approved');
  }

  //get all articles with approved state
  @Get('approved')
  async getApprovedArticles(): Promise<Article[]> {
    return this.articlesService.getArticlesByState('approved');
  }

  @Post()
  async submitArticle(@Body() article: CreateArticleDTO): Promise<boolean> {
    return this.articlesService.addArticle(article);
  }

  //approve pending articles
  @Patch(':id/approved')
  async approve(@Param('id') id: string): Promise<boolean> {
    return this.articlesService.updateArticleState(id, 'approved');
  }

  //reject pending articles
  @Patch(':id/reject')
  async rejectArticle(@Param('id') id: string): Promise<boolean> {
    return this.articlesService.updateArticleState(id, 'rejected');
  }
}
