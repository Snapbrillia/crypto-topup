import httpClient from '../net/http';
import { EstimateAmount, Currency } from '../model';

import { FLOW_TYPES } from '../../utils/constant';
const BASE_URL = 'https://api.changenow.io/v2';

export class Fiat {
  constructor(options) {
    this.apiKey = options?.apiKey;
    this.httpClient = httpClient(BASE_URL, {
      'x-api-key': this.apiKey
    });
  }
  async estimate({ fromCurrency = '', fromNetwork = '', toCurrency = '', toNetwork = '', fromAmount = '', depositType = '', payoutType = '' }) {
    const response = await this.httpClient(
      '/fiat-estimate?' +
      new URLSearchParams({
        from_currency: fromCurrency,
        from_network: fromNetwork,
        to_currency: toCurrency,
        to_network: toNetwork,
        from_amount: fromAmount,
        deposit_type: depositType,
        payout_type: payoutType,
      })
    );
    let result = await response.json();
    return result;
  }

  async createTransaction({ fromCurrency, toCurrency, toNetwork, toAddress, amount }) {
    const response = await this.httpClient('/fiat-transaction', {
      method: 'post',
      body: JSON.stringify({
        "from_currency": fromCurrency,
        "to_currency": toCurrency,
        "from_network": null,
        "to_network": toNetwork,
        "from_amount": amount,
        "payout_address": toAddress,
        // "payout_extra_id": "1",
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    let result = await response.json();
    return result;
  }

  async getTransaction(id) {
    const response = await this.httpClient(
      '/fiat-status?' +
      new URLSearchParams({
        id: id,
      })
    );
    let result = await response.json();
    return result;
  }
  async getFiatCurrencies({}) {
    const response = await this.httpClient('/fiat-currencies/fiat?');
    let results = await response.json();
    return results;
  }
  async getCryptoCurrencies({}) {
    const response = await this.httpClient('/fiat-currencies/crypto?');
    let results = await response.json();
    return results;
  }
}
