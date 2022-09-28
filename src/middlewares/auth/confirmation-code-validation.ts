import {body, Meta} from "express-validator";
import {usersRepository} from "../../repositories/users/users-repository";

export const confirmationCodeValidation = body("code")
	.exists().withMessage("You didn't provide confirmation code!")
	.custom(async (code, meta: Meta) => {
		const user = await usersRepository.getUserByFilter({confirmationCode: code});
		const notValidMessage = "Confirmation code is not valid!";
		
		if (user) {
			if (user.emailConfirmation.isConfirmed) throw new Error("Confirmation code is confirmed already!");
			if (user.emailConfirmation.confirmationCode !== code) throw new Error(notValidMessage);
			
			meta.req.user = user;
			return code;
		} else {
			throw new Error(notValidMessage);
		}
	});
