import { Injectable } from '@nestjs/common';
import { Ethplorer } from 'ethplorer-js';
import axios, { Method } from 'axios';
import web3 from 'web3';
import { AppService } from 'src/app.service';


const URL = 'https://api.ethplorer.io/';
const ADDRESS = '0x45245aCA2e6b1141dc20fad9c5910DDE0A454Bf8';

interface TokenInfo {
    name: string;
    symbol: string;
    image: string;

}

interface Token {
    tokenInfo: TokenInfo;
    balance: number;
}

@Injectable()
export class EthplorerService {

    constructor(private appService: AppService) {}


  public async init(addr: string) {
    // let api = new Ethplorer('EK-dyf9M-rbdT3qs-QC5wo');
    // return await api.getTokenInfo(address);
    return await this.get('getAddressInfo/', addr || ADDRESS);
  }

  async get(path: string, addr: string) {
    try {
        const res = await axios({
          method: 'GET',
          url: `${URL}${path}${addr}?apiKey=EK-dyf9M-rbdT3qs-QC5wo`,
        });
        return {
            EthNetwork: {
                ethBalance: res.data.ETH.balance,
                tokens: (res.data.tokens as Token[]).map(t => ({
                    name: t.tokenInfo.name,
                    symbol: t.tokenInfo.symbol,
                    balance: t.balance / 1000000,
                }))
            }
        };
      }
      catch (err) {
        console.log(err);
      }
  }
}
