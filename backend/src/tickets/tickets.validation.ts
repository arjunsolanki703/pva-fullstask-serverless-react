import * as Joi from 'joi';

import {CreatebyadminticketDto, FindticketDto, GetallticketDto, GetticketDto, RespondDto, TicketDto, UpdateticketDto} from './dto/inputArgs'

import { JoiValidationPipe } from '../utils';

export class CreateTicketValidationPipe extends JoiValidationPipe{
    public buildSchema(): Joi.Schema {
        return Joi.object<TicketDto>({
			subject: Joi.string().required(),
			message: Joi.string().required(),
            recaptcha:Joi.string().required(),
		});
    }

} 

export class RespondTicketValidationPipe extends JoiValidationPipe{
    public buildSchema():Joi.Schema{
        return Joi.object<RespondDto>({
            ticket_id:Joi.string().required(),
            message:Joi.string().required(),
        })
    }
}

export class GetTicketValidationPipe extends JoiValidationPipe{
    public buildSchema():Joi.Schema{
        return Joi.object<GetticketDto>({
            status:Joi.string().required(),
        })
    }
}

export class FindTicketValidationPipe extends JoiValidationPipe{
    public buildSchema():Joi.Schema{
        return Joi.object<FindticketDto>({
            id:Joi.string().required(),
        })
    }
}

export class UpdateTicketValidationPipe extends JoiValidationPipe{
    public buildSchema():Joi.Schema{
        return Joi.object<UpdateticketDto>({
            id:Joi.string().required(),
        })
    }
}

export class GetallTicketValidationPipe extends JoiValidationPipe{
    public buildSchema():Joi.Schema{
        return Joi.object<GetallticketDto>({
            status:Joi.string().required(),
        })
    }
}

export class CreatebyadminTicketValidationPipe extends JoiValidationPipe{
    public buildSchema():Joi.Schema{
        return Joi.object<CreatebyadminticketDto>({
            subject:Joi.string().required(),
            customer_id:Joi.string().required(),
            message:Joi.string().required(),

        })
    }
}