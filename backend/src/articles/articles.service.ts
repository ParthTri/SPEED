import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';
import { CreateArticleDTO } from './createArticle.dto';
import { SubmitRatingDTO } from './rating.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  // Method to fetch all articles
  async getAllArticles(): Promise<Article[]> {
    return this.articleModel.find().exec(); // Fetches all articles from MongoDB
  }

  // Method to fetch all articles based on state
  async getArticlesByState(state: string): Promise<Article[]> {
    return this.articleModel.find({ state }).exec(); // Fetches all articles with the specified state
  }

  // Additional methods for creating, updating, or deleting articles can go here
  async addArticle(articles: CreateArticleDTO[]): Promise<boolean> {
    try {
      articles.forEach((article) => {
        const newArticle = new this.articleModel(article);
        newArticle.state = 'pending';
        newArticle.save();
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  // Method to update the state of an article
  async updateArticleState(
    articleId: string,
    newState: string,
  ): Promise<boolean> {
    try {
      await this.articleModel
        .findByIdAndUpdate(articleId, { state: newState })
        .exec();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async submitRating(
    articleId: string,
    ratingData: SubmitRatingDTO,
  ): Promise<boolean> {
    try {
      const article = await this.articleModel.findById(articleId);

      if (!article) {
        throw new NotFoundException('Article not found');
      }

      if (ratingData.rating < 1 || ratingData.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }

      // Check if user has already rated
      const existingRatingIndex = article.ratings.findIndex(
        (r) => r.user_id === ratingData.user_id,
      );

      if (existingRatingIndex !== -1) {
        // Update existing rating
        article.ratings[existingRatingIndex].rating = ratingData.rating;
      } else {
        // Add new rating
        article.ratings.push({
          user_id: ratingData.user_id,
          rating: ratingData.rating,
        });
      }

      // Calculate new average
      const totalRating = article.ratings.reduce((sum, r) => sum + r.rating, 0);
      article.average_rating = totalRating / article.ratings.length;

      await article.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getArticleRating(articleId: string): Promise<{
    average_rating: number;
    total_ratings: number;
  }> {
    const article = await this.articleModel.findById(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return {
      average_rating: article.average_rating,
      total_ratings: article.ratings.length,
    };
  }
}
