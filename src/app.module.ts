import { Module } from '@nestjs/common';
import { UrlModule } from './url/url.module';
import { AppController } from './app.controller';

@Module({
  imports: [UrlModule],
  controllers: [AppController],
})
export class AppModule { }
