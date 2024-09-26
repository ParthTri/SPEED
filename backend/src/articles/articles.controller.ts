import { Controller, Get } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './schemas/article.schema';

@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getAllArticles(): Promise<Article[]> {
    return this.articlesService.getAllArticles(); // Return the articles from the service
  }
}
