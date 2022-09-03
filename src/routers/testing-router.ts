import { Request, Response, Router } from "express";
import { testingRepository } from "../repositories/testing/memory-testing-repository";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
	await testingRepository.deleteAllData();
	return res.send(204);
});
