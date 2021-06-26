import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

import axios from 'axios';
import { Method } from 'axios';
import crypto from 'crypto';
import QueryString from 'qs';

const BINANCE_API_KEY = 'sB0lkUDIEmNpUjdZw4SaS2XOw605vGISyja1crohBR49VNzqIWpssePdY5CWYEXu';
const BINANCE_API_SECRET = 'lfOV5xf9yP0aPzeiFgjiD2XLTYi7z3mIi2viQCoGCvhAzEj7WFtoaOA2uSqCUiax';
const BINANCE_API_URL = 'https://api.binance.com';
const SYMBOL = "BTCB"

const BINANCE_PROVIDER = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const ROPSTEN_PROVIDER = 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const LOCAL_PROVIDER = 'http://localhost:8545';

const TEST_METAMASK_WALLET_ADDRESS = '0xe2B7f19B3DE874a58aA55eeCf6ED825A584b08c4';
const CONTRACT_TOKENS = [];

@Injectable()
export class AppService {

  public async init() {
    // The First way - Request All Transactions for analysis. / ERC-20. ROPSTEN Network.
    return JSON.stringify(await this.checkBlock());

    // The Other Way - Use Web Scan App that has all the transactions analized. BEP-20. BinanceScan web app. 
    return JSON.stringify(await this.privateBinanceScanRequest('/sapi/v1/capital/config/getall'));
  }

  async privateBinanceScanRequest(path, data = {}, method: Method = 'GET') {
    const timestamp = Date.now();
    const signature = crypto.createHmac('sha256', BINANCE_API_SECRET)
      .update(`${ QueryString.stringify({ ...data, timestamp }) }`)
      .digest('hex');
    const newData = { ...data, signature, timestamp };
    const qs = `?${ QueryString.stringify(newData) }`;

    try {
      const res = await axios({
        method,
        url: `${BINANCE_API_URL}${path}${qs}`,
        headers: {'X-MBX-APIKEY': BINANCE_API_KEY},
      });
      return res.data;
    }
    catch (err) {
      console.log(err);
    }
  }

  async checkBlock() {
    const [web3, addr] = this.getRobstenNetworkChain() as [Web3, string];
    let block = await web3.eth.getBlock('latest');
    let number = block.number;
    console.log('Searching block ', number);

    let i=0;
    if (block?.transactions) {
      for (let txHash of block.transactions) {
        console.log(`txHash: `, txHash);
        try {
          let tx = await web3.eth.getTransaction(txHash);
          console.log(`Transaction_${++i}: `, tx);

          if (TEST_METAMASK_WALLET_ADDRESS?.toLowerCase() == tx.to?.toLowerCase()) {
            console.log('Transaction found on block: ', number);
            console.log({
              address: tx.from,
              value: web3.utils.fromWei(tx.value, 'ether'),
              timestamp: Date.now(),
            })
          }
        }
        catch (err) {
          console.log(err)
        }

      }
    }
  }

  getBinanceNetworkChain() {
    return [this.getNetwork(BINANCE_PROVIDER), TEST_METAMASK_WALLET_ADDRESS];
  }

  getRobstenNetworkChain() {
    return [this.getNetwork(ROPSTEN_PROVIDER), TEST_METAMASK_WALLET_ADDRESS];
  }

  getEthLocalChain() {
    return [this.getNetwork(LOCAL_PROVIDER), '0x315209B4ae28EB49Ce0d1cbD2F21E54Bb5722336'];
  }


  getNetwork(provider: string) {
    let web3Provider = new Web3.providers.HttpProvider(provider);
    return new Web3(web3Provider);
  }
}

// let [web3, addr] = this.getBep20() as [Web3, string];
// web3.eth.getBalance(addr).then(amnt => console.log('Amount ETH:', web3.utils.fromWei(amnt, 'ether')));
// web3.eth.net.getId().then(networkId => console.log('networkId: ', networkId));
// web3.eth.getChainId().then(networkId => console.log('chainId: ', networkId));

// const api = BSC.init('uUt200DYRTp5lEPLLWx9afqV0Of6MrHcyUzicPbx09xwaxa4PyLkVxiYLq0jG9PF');
// var balance = api.account.balance("0xe2B7f19B3DE874a58aA55eeCf6ED825A584b08c4");
// balance.then(function (balanceData) {
//   console.log('balanceData: ', balanceData);
// });

// var api = require('etherscan-api').init('8A2XTKXH2N44JRRSZWJDJ1MMK6ARHKV6NU','ropsten', 3000);

