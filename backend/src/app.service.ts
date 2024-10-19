import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './articles/schemas/article.schema'; // Correct import path

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
  ) {}

  // Default message, can be kept for the root route
  getHello(): string {
    return 'Hello World!';
  }

  // Fetch all articles
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec(); // Fetch all articles from the MongoDB collection
  }

  // Search articles based on a search term
  async searchArticles(searchTerm: string): Promise<Article[]> {
    const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search term
    return this.articleModel
      .find({
        $or: [
          { title: searchRegex },
          { authors: searchRegex },
          { source: searchRegex },
          { doi: searchRegex },
          { claim: searchRegex },
          { evidence: searchRegex },
        ],
      })
      .exec(); // Perform search in multiple fields
  }
}
