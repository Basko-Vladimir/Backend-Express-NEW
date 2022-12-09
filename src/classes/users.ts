import {ObjectId} from "mongodb";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";


class EmailConfirmation {
	confirmationCode: string;
	expirationDate: Date;
	isConfirmed: boolean = false;
	
	constructor() {
		this.confirmationCode = uuidv4();
		this.expirationDate = add(new Date(), {hours: 1});
		this.isConfirmed = false;
	}
}

export class User {
	_id: ObjectId | null = null;
	login: string;
	email: string;
	passwordSalt: string;
	passwordHash: string;
	emailConfirmation: EmailConfirmation;
	refreshToken: string | null;
	createdAt: Date;
	
	constructor(login: string, email: string, salt: string, hash: string) {
		this.login = login;
		this.email = email;
		this.passwordSalt = salt;
		this.passwordHash = hash;
		this.emailConfirmation = new EmailConfirmation();
		this.createdAt = new Date();
		this.refreshToken = null;
	}
}
