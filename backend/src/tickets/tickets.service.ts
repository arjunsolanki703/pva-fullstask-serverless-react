import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';

import { ServiceResponseInterface } from '../utils';
import { TicketDto, RespondDto } from './dto/inputArgs';
import { UsersService } from '../users/users.service';
import { Model } from 'mongoose';
import { ToicketDocument, Ticket } from './tickets.modal';
import { InjectModel } from '@nestjs/mongoose';
const { ObjectID } = require('mongodb');
import { sendEmail } from '../utils';
import { APP_URL, MAILING_USERNAME } from '../environments';
export class TicketApiService {
	constructor(
		private userservice: UsersService,
		@InjectModel(Ticket.name)
		private ticketModel: Model<ToicketDocument>
	) {}

	async create_ticket(
		inpute: TicketDto,
		user: any
	): Promise<ServiceResponseInterface> {
		try {
			const user_data = await this.userservice.userprofile(user);
			const newObjectId = new ObjectID();

			const ticket = await this.ticketModel.create({
				user_id: user,
				user_name: user_data.data.name,
				user_email: user_data.data.email,
				subject: inpute.subject,
				status: 'open',
				messages: {
					_id: newObjectId,
					message: inpute.message,
					user_id: user,
					user_name: user_data.data.name,
					user_email: user_data.data.email,
					user_type: user_data.data.user_type,
				},
			});
			const redirect_url = APP_URL + 'admin/open-ticket';
			await sendEmail(
				[MAILING_USERNAME],
				'Ticket Created',
				// MAILING_USERNAME,
				'',
				'',
				'',
				`<div style="font-family: arial">
						<p style="font-size: 20px">Hi Admin,</p>
						<p style="font-size: 18px">
						You have received a new ticket from ${user_data.data.email} 
						</p>
						<p style="font-size: 18px"> 
							Please 
							<a style="font-size: 18px; text-decoration: none" href="${redirect_url}">					
								click here  
							</a>
							to respond.
						</p>
						<p style="font-size: 18px">Thank You,</p>
						<p style="font-size: 18px">serverlessadeals Team.</p>
					</div>
					`,
				true
			);

			return {
				success: true,
				status: HttpStatus.OK,
				message: 'create successfully',
				data: { data: user_data },
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async respond_ticket(
		inpute: RespondDto,
		user: any
	): Promise<ServiceResponseInterface> {
		try {
			const ticket_Data = await this.ticketModel.findById({
				_id: inpute.ticket_id,
			});
			const newObjectId = new ObjectID();
			const user_data = await this.userservice.userprofile(user);
			if (ticket_Data) {
				const updated_data = await this.ticketModel.updateOne(
					{ _id: inpute.ticket_id },
					{
						$push: {
							messages: {
								_id: newObjectId,
								message: inpute.message,
								user_id: user,
								user_name: user_data.data.name,
								user_email: user_data.data.email,
								user_type: user_data.data.user_type,
							},
						},
					}
				);
			}
			const ticket_created_by = ticket_Data.to_id?"admin":"client"
			let name=''
			let email=''
			let recieved_email_address=''
			let redirect_url=''
			if(user_data.data.user_type === 'admin'){
				if(ticket_created_by === 'admin'){
					name = ticket_Data.to_user
					email ="Admin"
					recieved_email_address=ticket_Data.to_email
				}	
				else{
					name = ticket_Data.user_name
					email ="Admin"
					recieved_email_address=ticket_Data.user_email
				}
				redirect_url=APP_URL+'client/open-ticket'
			}
			else {
				if (ticket_created_by === 'admin') {
					name = 'Admin';
					email = ticket_Data.to_email;
					recieved_email_address = MAILING_USERNAME;
				} else {
					name = 'Admin';
					email = ticket_Data.user_email;
					recieved_email_address = MAILING_USERNAME;
				}
				redirect_url = APP_URL + 'admin/open-ticket';
			}
			await sendEmail(
				[recieved_email_address],
				'Ticket Updated',
				// MAILING_USERNAME,
				'',
				'',
				'',
				`<div style="font-family: arial">
						<p style="font-size: 20px">Hi ${name},</p>
						<p style="font-size: 18px">
						You have received a new response from ${email} 
						</p>
						<p style="font-size: 18px"> 
							Please 
							<a style="font-size: 18px;text-decoration: none" href="${redirect_url}">					
								click here  
							</a>
							to respond.
						</p>
						<p style="font-size: 18px">Thank You,</p>
						<p style="font-size: 18px">serverlessadeals Team.</p>
					</div>
					`,
				true
			);

			return {
				success: true,
				status: HttpStatus.OK,
				message: 'respone sen successfully',
				data: { data: ticket_Data },
			};
		} catch (err) {}
	}

	async get_ticket(user: any, status: any) {
		try {
			const data = await this.ticketModel.find({
				user_id: user,
				status: status,
			});
			const ticket_by_admin = await this.ticketModel.find({
				to_id: user,
				status: status,
			});
			if (ticket_by_admin) {
				var result_data = data.concat(ticket_by_admin);
				return {
					success: true,
					status: HttpStatus.OK,
					message: 'fetch sucessfully',
					data: result_data,
				};
			} else {
				return {
					success: true,
					status: HttpStatus.OK,
					message: 'fetch sucessfully',
					data: { data },
				};
			}
		} catch (err) {
			throw new Error(err);
		}
	}

	async find_ticket(id: any) {
		try {
			const data = await this.ticketModel.findById({ _id: id });
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'find successfully',
				data: { data },
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async update_ticket(id: any) {
		try {
			const data = await this.ticketModel.findOneAndUpdate(
				{ _id: id },
				{ $set: { status: 'close' } }
			);
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'update successfully',
				data: { data },
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async getall_ticket(status: any) {
		try {
			const data = await this.ticketModel.find({ status: status });
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'get successfully',
				data: { data },
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async create_ticket_byadmin(input: any, user: any) {
		try {
			const user_data = await this.userservice.userprofile(user);
			const recive_user_data = await this.userservice.userprofile(
				input.customer_id
			);
			const newObjectId = new ObjectID();

			const ticket = await this.ticketModel.create({
				user_id: user,
				user_name: user_data.data.name,
				user_email: user_data.data.email,
				subject: input.subject,
				status: 'open',
				to_id: input.customer_id,
				to_user: recive_user_data.data.name,
				to_email: recive_user_data.data.email,
				messages: {
					_id: newObjectId,
					message: input.message,
					user_id: user,
					user_name: user_data.data.name,
					user_email: user_data.data.email,
					user_type: user_data.data.user_type,
				},
			});
			const redirect_url = APP_URL + 'client/open-ticket';
			await sendEmail(
				[recive_user_data.data.email],
				'Ticket Created',
				// MAILING_USERNAME,
				'',
				'',
				'',
				`<div style="font-family: arial">
						<p style="font-size: 20px">Hi ${recive_user_data.data.name},</p>
						<p style="font-size: 18px">
							You have received a new ticket from Admin
						</p>
						<p style="font-size: 18px"> 
							Please 
							<a style="font-size: 18px ; text-decoration: none" href="${redirect_url}">					
								click here  
							</a>
							to respond.
						</p>
						<p style="font-size: 18px">Thank You,</p>
						<p style="font-size: 18px">serverlessadeals Team.</p>
					</div>
					`,
				true
			);

			return {
				success: true,
				status: HttpStatus.OK,
				message: 'create successfully',
				data: { data: user_data },
			};
		} catch (err) {
			throw new Error(err);
		}
	}
}
