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

  //get all articles with submitted state
  @Get('submitted')
  async getSubmittedArticles(): Promise<Article[]> {
    return this.articlesService.getArticlesByState('submitted');
  }

  // Get a single article by ID
  @Get(':id')
  async getArticleById(@Param('id') id: string): Promise<Article> {
    return this.articlesService.getArticleById(id);
  }

  @Post()
  async submitArticle(@Body() article: CreateArticleDTO[]): Promise<boolean> {
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

  //set article to submitted
  @Patch(':id/submitted')
  async setArticleSubmitted(@Param('id') id: string): Promise<boolean> {
    return this.articlesService.updateArticleState(id, 'submitted');
  }

  @Patch(':id/update-claim-evidence')
  async updateClaimAndEvidence(
    @Param('id') id: string,
    @Body('claim') claim: string,
    @Body('evidence') evidence: string,
  ): Promise<boolean> {
    return this.articlesService.updateClaimAndEvidence(id, claim, evidence);
  }
}
