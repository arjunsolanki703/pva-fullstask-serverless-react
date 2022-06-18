import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceResponseInterface, tellabotNumber } from '../../utils';
import { Model } from 'mongoose';
import {
	TellabotService,
	TellabotServiceDocument,
} from './tellabot-services.model';
import {
	NewTellabotService,
	TellabotServiceRequestCredits,
} from '../tellatbot-transaction.model';
import {
	ListWebsiteDto,
	AddorUpdateWebsiteDto,
	DisableServiceDto,
} from './dto/InputArgs';

import {
	RecentWebsite,
	RecentWebsiteDocument,
} from '../tellabot-recentwebsite.model';

@Injectable()
export class TellabotServicesService {
	constructor(
		@InjectModel(TellabotService.name)
		private tellabotServiceModel: Model<TellabotServiceDocument>,
		@InjectModel(RecentWebsite.name)
		private recentWebsiteModel: Model<RecentWebsiteDocument>
	) {}

	async disableservice(
		input: DisableServiceDto
	): Promise<ServiceResponseInterface> {
		try {
			const result = await this.tellabotServiceModel.updateMany(
				{
					_id: { $in: input.serviceIds },
				},
				{ enable: false }
			);
			// console.log(result);
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'SERVICE_DISABLED_SUCCESSFULLY',
				data: {},
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async isserviceactive(
		websitename: string,
		is_ltr: boolean
	): Promise<boolean> {
		try {
			const active = await this.tellabotServiceModel.findOne({
				name: websitename,
			});
			if (is_ltr) {
				return active.enable_ltr;
			} else {
				return active.enable;
			}
		} catch (err) {
			throw new Error(err);
		}
	}

	async GetServiceCount(): Promise<number> {
		const count = await this.tellabotServiceModel.countDocuments();
		return count;
	}

	async DeleteWebsite(id: string): Promise<boolean> {
		try {
			const service = await this.tellabotServiceModel.findByIdAndDelete(id);
			const recent_website = await this.recentWebsiteModel.remove({"service_id":id});
			return true;
		} catch (err) {
			throw new Error(err);
		}
	}

	async AddorUpdateWebsite(
		input: AddorUpdateWebsiteDto
	): Promise<ServiceResponseInterface> {
		try {
			if (input.id) {
				const service = await this.tellabotServiceModel.findOneAndUpdate(
					{ _id: input.id },
					input
				);
				const recent_web = await this.recentWebsiteModel.updateMany(
					{
						name: input.name,
						is_ltr: false,
					},
					{ $set: { credit: input.credit, is_active: input.enable } }
				);
				const recent_web_ltr = await this.recentWebsiteModel.updateMany(
					{
						name: input.name,
						is_ltr: true,
					},
					{ $set: { credit: input.ltr_price, is_active: input.enable_ltr } }
				);
				return {
					success: true,
					status: HttpStatus.OK,
					message: 'WEBSITE_UPDATED_SUCCESSFULLY',
					data: {},
				};
			} else {
				const newAdminService = await this.tellabotServiceModel.create(input);
				return {
					success: true,
					status: HttpStatus.OK,
					message: 'WEBSITE_CREATED_SUCCESSFULLY',
					data: {},
				};
			}
		} catch (err) {
			throw new Error(err);
		}
	}

	async GetAllServices(
		query: ListWebsiteDto
	): Promise<ServiceResponseInterface> {
		try {
			const search_data = query.search_data ? query.search_data : '';
			const limit = query.limit ? Number(query.limit) : 10;
			const page = query.page ? Number(query.page) : 1;
			const skip = limit * (page - 1);
			const order_by = query.order_by ? query.order_by : 'name';
			const order = query.order ? 1 : -1;
			let filter_data = [];
			if (query.filter_data === true) {
				filter_data.push(true);
			} else if (query.filter_data === false) {
				filter_data.push(false);
			} else {
				filter_data.push(true, false);
			}
			const { status, message } = await tellabotNumber();
			if (status === 'error') {
				return {
					success: false,
					status: HttpStatus.NOT_FOUND,
					message: 'Error in fetching available numbers',
					data: {},
				};
			}
			let data: any = await this.tellabotServiceModel
				.find({
					$or: [ { name: { $regex: search_data, $options: 'i' } }, { custom_name: { $regex: search_data, $options: 'i' } } ] ,
					enable: { $in: filter_data },
				})
				.skip(skip)
				.limit(limit)
				.sort([[order_by, order]]);
			for (let index = 0; index < data.length; index++) {
				for (let temp = 0; temp < message.length; temp++) {
					if (data[index].name === message[temp].name) {
						data[index]._doc = {
							...data[index]._doc,
							available: message[temp].available,
							ltr_available: message[temp].ltr_available,
						};
					}
				}
			}
			const totalwebsite = await this.tellabotServiceModel.countDocuments({
				name: { $regex: search_data, $options: 'i' },
				enable: { $in: filter_data },
			});

			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: { data: data, totalwebsite: totalwebsite },
			};
		} catch (err) {
			// console.log(err);
			throw new Error(err);
		}
	}

	async GetAllTellabotServices(): Promise<ServiceResponseInterface> {
		const tellabotServices = await this.tellabotServiceModel.find({});
		return {
			status: HttpStatus.OK,
			success: true,
			message: 'GET_TELLABOT_WEBSITE_SERVICE_LIST',
			data: tellabotServices,
		};
	}

	async AddServiceSeeds(): Promise<ServiceResponseInterface> {
		const data = [
			{
				credit: 1.39,
				name: 'Website A',
				enable: true,
				tellabot: false,
				agent_accept_time: '5',
				agent_handle_request: true,
			},

			/* 2 */
			{
				credit: 1.5,
				name: 'Craigslist',
				enable: true,
				tellabot: true,
				agent_accept_time: '10',
				agent_handle_request: false,
			},

			/* 3 */
			{
				credit: 2.5,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Ebay',
				enable: true,
				tellabot: true,
			},

			/* 4 */
			{
				credit: 2.5,
				name: 'Amazon',
				enable: true,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
			},

			/* 5 */
			{
				credit: 1,
				name: 'Website B',
				enable: true,
				tellabot: false,
				agent_accept_time: '10',
				agent_handle_request: true,
			},

			/* 6 */
			{
				credit: 2.5,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Unknown',
				enable: true,
				tellabot: true,
			},

			/* 7 */
			{
				credit: 3,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Dave',
				enable: true,
				tellabot: true,
			},

			/* 8 */
			{
				credit: 2.5,
				name: 'Facebook',
				enable: true,
				tellabot: true,
				agent_accept_time: '10',
				agent_handle_request: false,
			},

			/* 9 */
			{
				credit: 2.5,
				name: 'Uber',
				enable: true,
				tellabot: true,
				agent_accept_time: '10',
				agent_handle_request: false,
			},

			/* 10 */
			{
				credit: 2.5,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Tinder',
				enable: true,
				tellabot: true,
			},

			/* 11 */
			{
				credit: 2,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Swagbucks',
				enable: true,
				tellabot: true,
			},

			/* 12 */
			{
				credit: 1.5,
				name: 'Whatsapp',
				enable: true,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
			},

			/* 13 */
			{
				credit: 2.5,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'MoneyLion',
				enable: true,
				tellabot: true,
			},

			/* 14 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Ticketmaster',
				enable: true,
			},

			/* 15 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Chowbus/FoodHwy',
				enable: true,
			},

			/* 16 */
			{
				credit: 2.75,
				tellabot: false,
				agent_accept_time: '15',
				agent_handle_request: true,
				name: 'Website c',
				enable: true,
			},

			/* 17 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: '3Fun',
				enable: true,
			},

			/* 18 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Adidas',
				enable: true,
			},

			/* 19 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'AdItUp',
				enable: true,
			},

			/* 20 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Airbnb',
				enable: true,
			},

			/* 21 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Ando',
				enable: true,
			},

			/* 22 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Apple',
				enable: true,
			},

			/* 23 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'AWS',
				enable: true,
			},

			/* 24 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Bumble',
				enable: true,
			},

			/* 25 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'CashApp',
				enable: true,
			},

			/* 26 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Chime',
				enable: true,
			},

			/* 27 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Clickworker',
				enable: true,
			},

			/* 28 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Coupons',
				enable: true,
			},

			/* 29 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Deliveroo',
				enable: true,
			},

			/* 30 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Discord',
				enable: true,
			},

			/* 31 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'DoorDash',
				enable: true,
			},

			/* 32 */
			{
				credit: 1.5,
				tellabot: false,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Fiverr',
				enable: true,
			},

			/* 33 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'G2A',
				enable: true,
			},

			/* 34 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'GreenDot',
				enable: true,
			},

			/* 35 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Hotmail',
				enable: true,
			},

			/* 36 */
			{
				credit: 1.25,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Instagram',
				enable: true,
			},

			/* 37 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'LuckyLand',
				enable: true,
			},

			/* 38 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Match',
				enable: true,
			},

			/* 39 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'MicrosoftRewards',
				enable: true,
			},

			/* 40 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Nike',
				enable: true,
			},

			/* 41 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'OfferUp',
				enable: true,
			},

			/* 42 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'OffGamers',
				enable: true,
			},

			/* 43 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'PayPal',
				enable: true,
			},

			/* 44 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'POF',
				enable: true,
			},

			/* 45 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Postmates',
				enable: true,
			},

			/* 46 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Skype',
				enable: true,
			},

			/* 47 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Smoreapp',
				enable: true,
			},

			/* 48 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Snapchat',
				enable: true,
			},

			/* 49 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Steam',
				enable: true,
			},

			/* 50 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'SurveyJunkie',
				enable: true,
			},

			/* 51 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Telegram',
				enable: true,
			},

			/* 52 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'TikTok',
				enable: true,
			},

			/* 53 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Twitter',
				enable: true,
			},

			/* 54 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'ValuedOpinions',
				enable: true,
			},

			/* 55 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Venmo',
				enable: true,
			},

			/* 56 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Walmart',
				enable: true,
			},

			/* 57 */
			{
				credit: 1.25,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Yahoo',
				enable: true,
			},

			/* 58 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Hinge',
				enable: true,
			},

			/* 59 */
			{
				credit: 3,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Womply',
				enable: true,
			},

			/* 60 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Burner',
				enable: true,
			},

			/* 61 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'CoinFlip',
				enable: true,
			},

			/* 62 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'CreditKarma',
				enable: true,
			},

			/* 63 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Lyft',
				enable: true,
			},

			/* 64 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Netflix',
				enable: true,
			},

			/* 65 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'NiftyGateway',
				enable: true,
			},

			/* 66 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'OkCupid',
				enable: true,
			},

			/* 67 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'OneOpinion',
				enable: true,
			},

			/* 68 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'OpinionOutpost',
				enable: true,
			},

			/* 69 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Outlook',
				enable: true,
			},

			/* 70 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Paxful',
				enable: true,
			},

			/* 71 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Payoneer',
				enable: true,
			},

			/* 72 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Prolific',
				enable: true,
			},

			/* 73 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Skout',
				enable: true,
			},

			/* 74 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Twilio',
				enable: true,
			},

			/* 75 */
			{
				credit: 1.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'WeChat',
				enable: true,
			},

			/* 76 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Moonpay',
				enable: true,
			},

			/* 77 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Badoo',
				enable: true,
			},

			/* 78 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'BitClout',
				enable: true,
			},

			/* 79 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Bitmo',
				enable: true,
			},

			/* 80 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'BlueAcorn',
				enable: true,
			},

			/* 81 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Dapper',
				enable: true,
			},

			/* 82 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Fantuan',
				enable: true,
			},

			/* 83 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Flypay/Target',
				enable: true,
			},

			/* 84 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'G2G',
				enable: true,
			},

			/* 85 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'GetJerry',
				enable: true,
			},

			/* 86 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Gobranded/Branded',
				enable: true,
			},

			/* 87 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Gojek',
				enable: true,
			},

			/* 88 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Gopuff',
				enable: true,
			},

			/* 89 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Hily',
				enable: true,
			},

			/* 90 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'HungryPanda',
				enable: true,
			},

			/* 91 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'IDme',
				enable: true,
			},

			/* 92 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Imgur',
				enable: true,
			},

			/* 93 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Inspire',
				enable: true,
			},

			/* 94 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'iPlum',
				enable: true,
			},

			/* 95 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'KakaoTalk',
				enable: true,
			},

			/* 96 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Mercari',
				enable: true,
			},

			/* 97 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'MoneyGram',
				enable: true,
			},

			/* 98 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'OKCoin',
				enable: true,
			},

			/* 99 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Oracle',
				enable: true,
			},

			/* 100 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Oxygen',
				enable: true,
			},

			/* 101 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'PaddyPower',
				enable: true,
			},

			/* 102 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Passbook',
				enable: true,
			},

			/* 103 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'PaySending',
				enable: true,
			},

			/* 104 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'PingPong',
				enable: true,
			},

			/* 105 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Pointclub',
				enable: true,
			},

			/* 106 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'RetailMeNot',
				enable: true,
			},

			/* 107 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'SEAGM',
				enable: true,
			},

			/* 108 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Sendwave',
				enable: true,
			},

			/* 109 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Sezzle',
				enable: true,
			},

			/* 110 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Shopkick',
				enable: true,
			},

			/* 111 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Strike',
				enable: true,
			},

			/* 112 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'SwissBorg',
				enable: true,
			},

			/* 113 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'TurboTax',
				enable: true,
			},

			/* 114 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Weee',
				enable: true,
			},

			/* 115 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Yubo',
				enable: true,
			},

			/* 116 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Zogo',
				enable: true,
			},

			/* 117 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'ZoomInfo',
				enable: true,
			},

			/* 118 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Zoosk',
				enable: true,
			},

			/* 119 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'Poshmark',
				enable: true,
			},

			/* 120 */
			{
				credit: 3.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'QuadPay',
				enable: true,
			},

			/* 121 */
			{
				credit: 2.5,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: true,
				name: 'GMail/GVoice',
				enable: true,
			},

			/* 122 */
			{
				credit: 2,
				tellabot: true,
				agent_accept_time: '15',
				agent_handle_request: false,
				name: 'GrabPoints',
				enable: true,
			},
		];
		await this.tellabotServiceModel.deleteMany({});
		await this.tellabotServiceModel.insertMany(data);
		return {
			success: true,
			status: HttpStatus.OK,
			data: {},
			message: 'SEED_EXECUTED',
		};
	}

	async GetServiceById(id: string): Promise<ServiceResponseInterface> {
		const service = await this.tellabotServiceModel.findOne({ _id: id });
		if (!service) {
			return {
				status: HttpStatus.NOT_FOUND,
				success: false,
				data: {},
				message: 'NOT_FOUND',
			};
		}
		return {
			status: HttpStatus.OK,
			success: true,
			data: service,
			message: 'GET_SERVICE_BY_ID',
		};
	}

	async GetServiceCreditsLTR(id: string): Promise<any> {
		const service = await this.tellabotServiceModel.findOne({ _id: id });
		const totalCreditCharge = service.ltr_price;
		const obj = {
			service_id: service._id,
			name: service.name,
			credit: service.credit,
			tellabot: service.tellabot,
			enable: service.enable,
			is_price_surge: service.is_price_surge,
			price_after_surge: service.price_after_surge,
			ltr_price: service.ltr_price,
		};
		let services = [];
		services.push(obj);
		return {
			services,
			totalCreditCharge,
		};
	}

	async GetServiceCredits(ids: [string], is_ltr: boolean): Promise<any> {
		const service = await this.tellabotServiceModel.find({
			_id: { $in: [...ids] },
		});
		let totalCreditCharge = 0;
		if (is_ltr) {
			service.forEach((s) => {
				if (s.enable && s.tellabot) {
					const amt = s.ltr_price;
					totalCreditCharge = totalCreditCharge + amt;
				}
			});
		} else {
			service.forEach((s) => {
				if (s.enable && s.tellabot) {
					const amt = s.is_price_surge ? s.price_after_surge : s.credit;
					totalCreditCharge = totalCreditCharge + amt;
				}
			});
		}
		const services = [];
		service.forEach(function (item, index) {
			const obj = {
				service_id: item._id,
				name: item.name,
				custom_name: item.custom_name,
				credit: item.credit,
				tellabot: item.tellabot,
				enable: item.enable,
				is_price_surge: item.is_price_surge,
				price_after_surge: item.price_after_surge,
				ltr_price: item.ltr_price,
			};
			services.push(obj);
		});
		return {
			services,
			totalCreditCharge,
		};
	}
}
