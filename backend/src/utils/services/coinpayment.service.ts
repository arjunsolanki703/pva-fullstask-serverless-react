import * as CoinGecko from 'coingecko-api';

import {
	COINPAYMENT_IPN_SECRET,
	COINPAYMENT_KEY,
	COINPAYMENT_SECRET,
} from '../../environments';

import Coinpayments from 'coinpayments';
import { CoinpaymentsCreateTransactionOpts } from 'coinpayments/dist/types/options';
import { CoinpaymentsCreateTransactionResponse } from 'coinpayments/dist/types/response';
import { createHmac } from 'crypto';

//​import Verify from 'coinpayments-ipn';


const qs = require(`querystring`);

const client = new Coinpayments({
	key: COINPAYMENT_KEY,
	secret: COINPAYMENT_SECRET,
});
const convertor = new CoinGecko();
function verify(hmac: string, ipnSecret: string, payload: object) {
	if (!hmac || typeof hmac !== `string`) return false;
	if (!ipnSecret || typeof ipnSecret !== `string`) return false;
	if (typeof payload !== `object`) return false;
	const paramString = qs.stringify(payload).replace(/%20/g, `+`);
	const calcHmac = createHmac(`sha512`, ipnSecret)
		.update(paramString)
		.digest(`hex`);
	if (hmac !== calcHmac) return false;
	return true;
}
export const createCoinPaymentTransaction = async (
	input: CoinpaymentsCreateTransactionOpts
): Promise<CoinpaymentsCreateTransactionResponse> => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await client.createTransaction(input);
			return resolve(response);
		} catch (error) {
			reject(error);
		}
	});
};
export const verifyCoinPaymentBody = async (
	hmac: string,
	payload: object
): Promise<Boolean> => {
	return new Promise((resolve, reject) => {
		try {
			const isVerified = verify(hmac, COINPAYMENT_IPN_SECRET, payload);
			return resolve(true);
		} catch (error) {
			return resolve(false);
		}
	});
};
export const convertUSDToCrypto = async (
	to: string,
	amt: number,
	coin_id: string
): Promise<number> => {
	return new Promise(async (resolve, reject) => {
		const data = await convertor.exchanges.fetchTickers('bitfinex', {
			coin_ids: [coin_id],
		});
		var _coinList = {};
		var _datacc = data.data.tickers.filter((t) => t.target == 'USD');
		if(to === 'LTCT'){
			const add_ltct = {
				base: 'LTCT',
				target: 'USD',
				market: {
				  name: 'Bitfinex',
				  identifier: 'bitfinex',
				  has_trading_incentive: false
				},
				last: 38961.02518405,
    			volume: 5527.41275443,
    			converted_last: { btc: 0.99981146, eth: 13.43976, usd: 38961 },
    			converted_volume: { btc: 5526, eth: 74287, usd: 215353668 },
				trust_score: 'green',
				bid_ask_spread_percentage: 0.0999,
				timestamp: '2022-04-27T09:18:27+00:00',
				last_traded_at: '2022-04-27T09:18:27+00:00',
				last_fetch_at: '2022-04-27T09:18:27+00:00',
				is_anomaly: false,
				is_stale: false,
				trade_url: 'https://www.bitfinex.com/t/BTCUSD',
				token_info_url: null,
				coin_id: 'tether'
			}
			_datacc.push(add_ltct)
		}
		[to].forEach((i) => {
			var _temp = _datacc.filter((t) => t.base == i);
			var _res = _temp.length == 0 ? [] : _temp[0];
			_coinList[i] = _res.last;
		});
		return resolve(amt / _coinList[to]);
	});
};
