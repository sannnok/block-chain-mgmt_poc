import { Injectable } from '@nestjs/common';
import axios, { Method } from 'axios';

const URL = 'https://graphql.bitquery.io/';
const BINANCE_PROVIDER = 'https://data-seed-prebsc-1-s1.binance.org:8545';

interface TokenInfo {
  tokenType: string;
  symbol: string;
  address: string;
}

interface Token {
  currency: TokenInfo;
  value: number;
}



@Injectable()
export class ScrapService {

  public async init(addr: string) {
    // let api = new Ethplorer('EK-dyf9M-rbdT3qs-QC5wo');
    // return await api.getTokenInfo(address);
    return await this.check(addr);
  }

  async check(addr: string) {
    const queryBody = {
      operationName: null,
      query: "query ($network: EthereumNetwork!, $address: String!) {\n  ethereum(network: $network) {\n    address(address: {is: $address}) {\n      balances {\n        value\n        currency {\n          address\n          symbol\n          tokenType\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
      variables: {
        address: addr,
        limit: 10,
        // network: "ethereum",
        network: "bsc",
        offset: 0
      }
    }

    try {
      const res = await axios({
        method: 'POST',
        url: `${URL}`,
        data: queryBody,
      });
      return {
        BSCNetwork: {
          bnbBalance: '?',
          tokens: (res.data.data?.ethereum?.address[0].balances as Token[])?.map(t => ({
              name: t.currency.symbol,
              symbol: t.currency.symbol,
              balance: t.value,
          }))
        }
      };
    }
    catch (err) {
      console.log(err);
    }
  }
  

promiseWithTimeout(timeoutMs: number) {
    return Promise.race([
      new Promise((resolve, reject) => setTimeout(() => reject(), timeoutMs)),
    ]);
  }
}
