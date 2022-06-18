import { COINPAYMENT_IPN_URL } from '../environments';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	convertUSDToCrypto,
	createCoinPaymentTransaction,
	ServiceResponseInterface,
} from '../utils';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { AddFundsDto, ListPaymentDto, PaymentStatusDto } from './dto/InputArgs';
import {
	PaymentTransactionHistory,
	PaymentTransactionHistoryDocument,
} from './payments.model';

@Injectable()
export class PaymentsService {
	constructor(
		@InjectModel(PaymentTransactionHistory.name)
		private paymentTransactionHistoryModel: Model<PaymentTransactionHistoryDocument>,
		private userService: UsersService
	) {}

	async getpaymenthistorybyID(
		query: ListPaymentDto,
		userid: string
	): Promise<ServiceResponseInterface> {
		try {
			const search_data = query.search_data ? query.search_data : '';
			const limit = query.limit ? Number(query.limit) : 10;
			const page = query.page ? Number(query.page) : 1;
			const skip = limit * (page - 1);
			const order_by = query.order_by ? query.order_by : 'name';
			const order = query.order ? 1 : -1;
			let filter_data = [];
			if (query.filter_data === 'COMPLETE') {
				filter_data.push('Complete');
			} else if (query.filter_data === 'INIT') {
				filter_data.push('INIT', 'Waiting for buyer funds...');
			} else if (query.filter_data === 'CANCELLED') {
				filter_data.push('Cancelled / Timed Out');
			} else {
				filter_data.push(
					'Cancelled / Timed Out',
					'INIT',
					'Waiting for buyer funds...',
					'Complete'
				);
			}
			const data = await this.paymentTransactionHistoryModel
				.find({
					$and: [
						{ user_id: userid },
						{
							$or: [
								{ user_name: { $regex: search_data, $options: 'i' } },
								{ user_email: { $regex: search_data, $options: 'i' } },
								{ txn_id: { $regex: search_data, $options: 'i' } },
								{ currency: { $regex: search_data, $options: 'i' } },
								{ payment_method: { $regex: search_data, $options: 'i' } },
							],
						},
						{ status: { $in: filter_data } },
					],
				})
				.sort([[order_by, order]])
				.skip(skip)
				.limit(limit);
			const totaltransaction =
				await this.paymentTransactionHistoryModel.countDocuments({
					$and: [
						{ user_id: userid },
						{
							$or: [
								{ user_name: { $regex: search_data, $options: 'i' } },
								{ user_email: { $regex: search_data, $options: 'i' } },
								{ txn_id: { $regex: search_data, $options: 'i' } },
								{ currency: { $regex: search_data, $options: 'i' } },
								{ payment_method: { $regex: search_data, $options: 'i' } },
							],
						},
						{ status: { $in: filter_data } },
					],
				});
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: { data: data, totalusers: totaltransaction },
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async getallhistory(
		query: ListPaymentDto
	): Promise<ServiceResponseInterface> {
		try {
			const search_data = query.search_data ? query.search_data : '';
			const limit = query.limit ? Number(query.limit) : 10;
			const page = query.page ? Number(query.page) : 1;
			const skip = limit * (page - 1);
			const order_by = query.order_by ? query.order_by : 'name';
			const order = query.order ? 1 : -1;
			let filter_data = [];
			if (query.filter_data === 'COMPLETE') {
				filter_data.push('Complete');
			} else if (query.filter_data === 'INIT') {
				filter_data.push('INIT', 'Waiting for buyer funds...');
			} else if (query.filter_data === 'CANCELLED') {
				filter_data.push('Cancelled / Timed Out');
			} else {
				filter_data.push(
					'INIT',
					'Waiting for buyer funds...',
					'Cancelled / Timed Out',
					'Complete'
				);
			}
			const data = await this.paymentTransactionHistoryModel
				.find({
					$or: [
						{ user_name: { $regex: search_data, $options: 'i' } },
						{ user_email: { $regex: search_data, $options: 'i' } },
						{ txn_id: { $regex: search_data, $options: 'i' } },
						{ currency: { $regex: search_data, $options: 'i' } },
						{ payment_method: { $regex: search_data, $options: 'i' } },
					],
					status: { $in: filter_data },
				})
				.sort([[order_by, order]])
				.skip(skip)
				.limit(limit);

			const totaltransaction =
				await this.paymentTransactionHistoryModel.countDocuments({
					$or: [
						{ user_name: { $regex: search_data, $options: 'i' } },
						{ user_email: { $regex: search_data, $options: 'i' } },
						{ txn_id: { $regex: search_data, $options: 'i' } },
						{ currency: { $regex: search_data, $options: 'i' } },
						{ payment_method: { $regex: search_data, $options: 'i' } },
					],
					status: { $in: filter_data },
				});
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: { data: data, totalusers: totaltransaction },
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async getpaymentstatus(
		input: PaymentStatusDto
	): Promise<ServiceResponseInterface> {
		try {
			const data = await this.paymentTransactionHistoryModel.findOne({
				_id: input.id,
			});
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: data.status,
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async ChangeFundsByAdmin(
		amount: Number,
		user: any
	): Promise<ServiceResponseInterface> {
		const newpayment = await this.paymentTransactionHistoryModel.create({
			txn_id: '-',
			currency: '-',
			user_id: user.id,
			amount: amount,
			status: 'Complete',
			user_email: user.email,
			user_name: user.name,
			payment_method: 'admin',
			status_url: '-',
			address: '-',
			is_credit_added: true,
			is_by_admin: true,
			old_amount:user.credits
		});
		return {
			data: { ...newpayment, id: newpayment._id },
			message: 'TRANSACTION_COMPLETE',
			status: HttpStatus.OK,
			success: true,
		};
	}

	async AddFunds(
		input: AddFundsDto,
		user: any
	): Promise<ServiceResponseInterface> {
		try {
			if (input.amount < 3) {
				return {
					data: {},
					message: 'ADD_MORE_FUNDS',
					status: HttpStatus.OK,
					success: true,
				};
			} else {
				const user_data= await this.userService.userprofile(user.id)
				let amount = await convertUSDToCrypto(
					input.currency,
					input.amount,
					input.coinid
				);
				const paymentResponse = await createCoinPaymentTransaction({
					amount: amount,
					currency1: input.currency,
					currency2: input.currency,
					buyer_email: user.email,
					ipn_url: COINPAYMENT_IPN_URL,
				});
				// console.log('paymentResopnse', paymentResponse);
				const newpayment = await this.paymentTransactionHistoryModel.create({
					txn_id: paymentResponse.txn_id,
					currency: input.currency,
					user_id: user.id,
					amount: input.amount,
					status: 'INIT',
					user_email: user.email,
					user_name: user.name,
					payment_method: 'coinpayment',
					status_url: paymentResponse.status_url,
					address: paymentResponse.address,
					is_credit_added: false,
					old_amount:user_data.data.credits
				});
				return {
					data: { ...paymentResponse, id: newpayment._id },
					message: 'TRANSACTION_CREATED',
					status: HttpStatus.OK,
					success: true,
				};
			}
		} catch (error) {
			return {
				data: {},
				message: 'PAYMENT_GATEWAY_TIMEOUT',
				status: HttpStatus.GATEWAY_TIMEOUT,
				success: false,
			};
		}
	}

	async Webhook(transactionId: string, status: string): Promise<Boolean> {
		// console.log(transactionId, status);
		await this.paymentTransactionHistoryModel.findOneAndUpdate(
			{ txn_id: transactionId },
			{ status }
		);
		const email = await this.paymentTransactionHistoryModel.findOne({
			txn_id: transactionId,
		});
		if (status == 'Complete' && !email.is_credit_added) {
			const addcredit = await this.userService.addcredits(
				email.user_email,
				email.amount
			);
			if (addcredit) {
				await this.paymentTransactionHistoryModel.findOneAndUpdate(
					{ txn_id: transactionId },
					{ is_credit_added: true }
				);
			}
		}
		return true;
	}
}
