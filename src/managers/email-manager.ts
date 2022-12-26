import {v4 as uuidv4} from "uuid";
import {EmailInfoModel} from "../models/email-models";
import { User } from "../classes/users";
import {EmailAdapter} from "../adapters/email-adapter";
import {inject, injectable} from "inversify";

@injectable()
export class EmailManager {
	constructor(
		@inject(EmailAdapter) protected emailAdapter: EmailAdapter
	) {}
	
	async sendRegistrationEmail(userData: User): Promise<void> {
		const messageInfo: EmailInfoModel = {
			from: "Test Backend Server <dev.test.vladimir@gmail.com>",
			to: userData.email,
			subject: "Test Backend Server Registration",
			html: `<h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
        <a href=https://somesite.com/confirm-email?code=${userData.emailConfirmation.confirmationCode}>
         	Complete registration
        </a>
      </p>`
		};
		
		return this.emailAdapter.sendEmail(messageInfo);
	}
	
	async recoverPassword(email: string): Promise<void> {
		const recoveryCode = uuidv4();
		const messageInfo: EmailInfoModel = {
			from: "Test Backend Server <dev.test.vladimir@gmail.com>",
			to: email,
			subject: "Test Backend Server Registration",
			html: `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href=https://somesite.com/password-recovery?recoveryCode=${recoveryCode}>Recovery password</a>
      </p>`
		};
		
		return this.emailAdapter.sendEmail(messageInfo);
	}
}
