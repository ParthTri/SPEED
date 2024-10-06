import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';
import { CreateArticleDTO } from './createArticle.dto';

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
}
