import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import Mongoose
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

@Module({
  imports: [
    // Connect to MongoDB using the connection string from the .env file
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
