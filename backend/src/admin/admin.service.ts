import { HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AdminSetting, AdminSettingDocument } from './admin.model';
import { ServiceResponseInterface } from '../utils';
import { AdminSettingDto, SignupmodeDto } from './dto/InputArgs';
import { PaypalEmail, PaypalEmailDocument } from './paypal-email.model';
import { Announcement, AnnouncementDocument } from './announcement.model';
@Injectable()
export class AdminService {
	constructor(
		@InjectModel(AdminSetting.name)
		private adminsettingModel: Model<AdminSettingDocument>,
		@InjectModel(PaypalEmail.name)
		private paypalEmailModel: Model<PaypalEmailDocument>,
		@InjectModel(Announcement.name)
		private announcementModel: Model<AnnouncementDocument>
	) { }

	async maintenancemode(
		input: AdminSettingDto
	): Promise<ServiceResponseInterface> {
		try {
			const data = await this.adminsettingModel.create(input);
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'MAINTENANCE_MODE_CHANGED_SUCCESSFULLY',
				data: {},
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async getmaintenancemode(): Promise<ServiceResponseInterface> {
		try {
			const data = await this.adminsettingModel
				.find()
				.sort([['updatedAt', -1]]);
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: data[0],
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async signupmode(input: SignupmodeDto): Promise<ServiceResponseInterface> {
		try {
			const data = await this.adminsettingModel.findOne().sort([['updatedAt', -1]]).limit(1);
			const udpatedData = await this.adminsettingModel.findByIdAndUpdate({_id:data._id},{$set:{signupmode:input.signupmode}},{upsert:true})
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'MAINTENANCE_MODE_CHANGED_SUCCESSFULLY',
				data: {},
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async getsignupmode(): Promise<ServiceResponseInterface> {
		try {
			const data = await this.adminsettingModel.find().sort([['updatedAt', -1]]).limit(1);			
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'GET_SIGN-UP_MODE_SUCCESSFULLY',
				data: {data},
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async addOrUpdateEmail(
		input
	): Promise<ServiceResponseInterface> {
		try {
			const data = await this.paypalEmailModel.updateOne({ paypalEmail: { $ne: "" } }, { $set: input }, { upsert: true });
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'PAYPAL_EMAIL_SET_SUCCESSFULLY',
				data: {},
			};
		} catch (err) {
			throw new Error(err);
		}
	}
	async getpaypalemail(): Promise<ServiceResponseInterface> {
		try {
			const data = await this.paypalEmailModel.findOne();
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: data,
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async addOrUpdateNotice(
		input: any
	): Promise<ServiceResponseInterface> {
		try {
			const data = await this.announcementModel.updateOne({ message: { $ne: "" } }, { $set: input }, { upsert: true });
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'ADD_SUCCESSFULLY',
				data: {},
			};
		} catch (err) {
			throw new Error(err);
		}
	}
	async getNotice(
	): Promise<ServiceResponseInterface> {
		try {
			const data = await this.announcementModel.findOne();
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'GET_SUCCESSFULLY',
				data: data,
			};
		} catch (err) {
			throw new Error(err);
		}
	}
}
