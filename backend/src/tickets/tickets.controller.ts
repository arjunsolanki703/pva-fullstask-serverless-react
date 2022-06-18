import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
	Param,
} from '@nestjs/common';
import {
	TicketDto,
	RespondDto,
	GetticketDto,
	FindticketDto,
	UpdateticketDto,
	GetallticketDto,
	CreatebyadminticketDto,
} from './dto/inputArgs';
import { AuthGuard } from '../auth/auth.guard';
import { errorResponse, response } from '../utils';
import {
	CreateTicketValidationPipe,
	RespondTicketValidationPipe,
	GetTicketValidationPipe,
	FindTicketValidationPipe,
	UpdateTicketValidationPipe,
	GetallTicketValidationPipe,
	CreatebyadminTicketValidationPipe,
} from './tickets.validation';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { TicketApiService } from './tickets.service';

@Controller('ticket')
@ApiTags('ticket')
@ApiBearerAuth('x-token')
export class TicketsController {
	constructor(private ticketService: TicketApiService) {}

	@UseGuards(AuthGuard)
	@Post('/create-ticket')
	async createticket(
		@Body(new CreateTicketValidationPipe()) input: TicketDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.ticketService.create_ticket(input, req.user.id);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('/respond-ticket')
	async respondticket(
		@Body(new RespondTicketValidationPipe()) input: RespondDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.ticketService.respond_ticket(input, req.user.id);

			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('/get-ticket')
	async getticket(
		@Body(new GetTicketValidationPipe()) input: GetticketDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.ticketService.get_ticket(
				req.user.id,
				input.status
			);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('/find-ticket')
	async findticket(
		@Body(new FindTicketValidationPipe()) input: FindticketDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.ticketService.find_ticket(input.id);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('/update-ticket')
	async updateticket(
		@Body(new UpdateTicketValidationPipe()) input: UpdateticketDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.ticketService.update_ticket(input.id);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('/getall-ticket')
	async getallticket(
		@Body(new GetallTicketValidationPipe()) input: GetallticketDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.ticketService.getall_ticket(input.status);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('/create-ticket-by-admin')
	async createticketbyadmin(
		@Body(new CreatebyadminTicketValidationPipe()) input: CreatebyadminticketDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.ticketService.create_ticket_byadmin(
				input,
				req.user.id
			);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
}
