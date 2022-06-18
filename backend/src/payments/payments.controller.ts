import { COINPAYMENT_MERCHANT_ID } from '../environments';
import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { convertUSDToCrypto, response, verifyCoinPaymentBody } from '../utils';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';
import { AddFundsDto, PaymentStatusDto } from './dto/InputArgs';
import { PaymentsService } from './payments.service';
import {
	AddFundsValidationPipe,
	PaymentStatusValidationPipe,
} from './payments.validations';

@ApiTags('payments')
@ApiBearerAuth('x-token')
@Controller('payments')
export class PaymentsController {
	constructor(private paymentsService: PaymentsService) {}

	@UseGuards(AuthGuard)
	@Post('AddFunds')
	async AddFunds(
		@Body(new AddFundsValidationPipe()) input: AddFundsDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.paymentsService.AddFunds(input, req.user);
			if (data.success) {
				return response(
					req,
					res,
					data.success,
					data.data,
					data.message,
					data.status
				);
			}
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log(
			// 	'🚀 ~ file: payments.controller.ts ~ line 45 ~ PaymentsController ~ error',
			// 	error
			// );
		}
	}

	@Post('webhook')
	async WebHook(@Req() req: Request | any, @Res() res: Response) {
		// console.log(
		// 	'🚀 ~ file: payments.controller.ts ~ line 59 ~ PaymentsController ~ WebHook ~ req.headers.hmac',
		// 	req.headers.hmac
		// );

		if (!req.body.ipn_mode && req.body.hmac != 'hmac') {
			throw new Error('Invalid IPN mode');
		}

		if (!req.headers.hmac && req.headers.hmac == '') {
			// console.log('dsvdfvdf');
			throw new Error('Invalid Transaction Signature');
		}
		const merchantId = req.body.merchant;
		if (merchantId == '' || merchantId != COINPAYMENT_MERCHANT_ID) {
			throw new Error('Invalid merchant id');
		}
		if (!(await verifyCoinPaymentBody(req.headers.hmac, req.body))) {
			throw new Error('Invalid Transaction Signature');
		}
		// console.log(req.body);
		if (req.body.ipn_type === 'api') {
			try {
				return await this.paymentsService.Webhook(
					req.body.txn_id,
					req.body.status_text
				);
			} catch (error) {
				throw new Error(error);
			}
		}
	}

	@UseGuards(AuthGuard)
	@Post('/getpaymentstatus')
	async GetPaymentStatus(
		@Body(new PaymentStatusValidationPipe()) input: PaymentStatusDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.paymentsService.getpaymentstatus(input);
			return response(req, res, true, data.data);
		} catch (error) {
			throw new Error(error);
		}
	}

	@UseGuards(AuthGuard)
	@Post('/convert')
	async ConvertUSDToCrypto(
		@Body(new AddFundsValidationPipe()) input: AddFundsDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		const data = await convertUSDToCrypto(
			input.currency,
			input.amount,
			input.coinid
		);
		// console.log(
		// 	'🚀 ~ file: payments.controller.ts ~ line 99 ~ PaymentsController ~ data',
		// 	data
		// );
		return response(req, res, true, data);
	}
}
