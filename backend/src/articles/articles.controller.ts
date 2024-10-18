import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query, // Keep this from your current branch (HEAD)
  NotFoundException, // Keep this from the 'development' branch
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './schemas/article.schema';
import { CreateArticleDTO } from './createArticle.dto';
import { SubmitRatingDTO } from './rating.dto';

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

  @Get('search') // Ensure the 'search' route is properly defined
  async searchArticles(@Query('term') searchTerm: string) {
    return this.articlesService.searchArticles(searchTerm);
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

  @Get(':id')
  async getArticleById(@Param('id') id: string): Promise<Article> {
    const article = await this.articlesService.getArticleById(id);
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  @Post(':id/rate')
  async rateArticle(
    @Param('id') id: string,
    @Body() ratingData: SubmitRatingDTO,
  ) {
    const result = await this.articlesService.submitRating(id, ratingData);
    if (!result) {
      throw new NotFoundException('Article not found');
    }
    return result;
  }

  @Get(':id/rating')
  async getArticleRating(@Param('id') id: string) {
    const rating = await this.articlesService.getArticleRating(id);
    if (!rating) {
      throw new NotFoundException('Article not found');
    }
    return rating;
  }
}
