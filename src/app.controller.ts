import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ScrapService } from './binance/binance.service';
import { EthplorerService } from './ethplorer/ethplorer.service';

const TESTNET_BINANCE_PROVIDER = 'https://data-seed-prebsc-1-s1.binance.org:8545';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly ethplorerService: EthplorerService, private scrapService: ScrapService) {
    appService.init(TESTNET_BINANCE_PROVIDER);
  }

  @Get()
  async getHello() {
    return await this.appService.checkTransBLocks();
  }

  @Get('parse/:address')
  async getEth(@Param('address') address) {
    const eth = await this.ethplorerService.init(address);
    const bsc = await this.scrapService.init(address);
    return {
      ...eth,
      ...bsc,
    };
  }

  @Post('parse')
  async getAddressesInfo(@Body() addresses: string[] | Set<string>) {
    const bundle = [];
    addresses = new Set(addresses)
    for (const addr of addresses) {
      const eth = await this.ethplorerService.init(addr);
      const bsc = await this.scrapService.init(addr);
      bundle.push({
        address: addr,
        info: {
          ...eth,
          ...bsc,
        }
      })
    }
    return bundle;
  }

}
