import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  // Method to fetch all articles
  async getAllArticles(): Promise<Article[]> {
    return this.articleModel.find().exec(); // Fetches all articles from MongoDB
  }

  // Additional methods for creating, updating, or deleting articles can go here
}
