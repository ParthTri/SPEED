import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import Mongoose
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesController } from './articles/articles.controller'; // Import the Articles controller
import { ArticlesService } from './articles/articles.service'; // Import the Articles service
import { Article, ArticleSchema } from './articles/schemas/article.schema'; // Import the Article schema
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI), // Connect to MongoDB
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]), // Register the Article schema
  ],
  controllers: [AppController, ArticlesController], // Include the Articles controller
  providers: [AppService, ArticlesService], // Include the Articles service
})
export class AppModule {}
