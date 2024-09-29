import { Controller, Get, Post, Body } from '@nestjs/common';
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

  @Post()
  async submitArticle(@Body() article: CreateArticleDTO): Promise<boolean> {
    return this.articlesService.addArticle(article);
  }
}
