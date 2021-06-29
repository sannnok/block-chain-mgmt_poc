import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapService } from './binance/binance.service';
import { EthplorerService } from './ethplorer/ethplorer.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EthplorerService, ScrapService],
})
export class AppModule {}
