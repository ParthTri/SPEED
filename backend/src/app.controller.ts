import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Article } from './articles/schemas/article.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Fetch all articles
  @Get('articles')
  async getAllArticles(): Promise<Article[]> {
    return this.appService.findAll();
  }

  // Search articles by a term
  @Get('articles/search')
  async searchArticles(@Query('q') searchTerm: string): Promise<Article[]> {
    return this.appService.searchArticles(searchTerm);
  }

  // Default route
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
