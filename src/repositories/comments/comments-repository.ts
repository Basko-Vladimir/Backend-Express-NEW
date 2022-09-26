import {commentsCollection} from "../db";
import {DbComment} from "../interfaces/comments-interfaces";
import {getFilterByDbId} from "../utils/mappers-utils";
import {EntityWithoutId} from "../../common/interfaces";
import {DataBaseError, NotFoundError} from "../../classes/errors";

export const commentsRepository = {
	async createComment(comment: EntityWithoutId<DbComment>): Promise<string> {
		const { insertedId } = await commentsCollection.insertOne(comment);
		
		if (!insertedId) throw new DataBaseError();
		
		return String(insertedId);
	},
	
	async deleteComment(id: string): Promise<void> {
		const { deletedCount } = await commentsCollection.deleteOne(getFilterByDbId(id));
		
		if (!deletedCount) throw new NotFoundError();
	},
	
	async updateComment(id: string, content: string): Promise<void> {
		const { matchedCount } = await commentsCollection.updateOne(getFilterByDbId(id), {$set: {content}});
		
		if (!matchedCount) throw new NotFoundError();
	},
	
	async deleteAllComments(): Promise<void> {
		const { deletedCount } = await commentsCollection.deleteMany({});
		
		if (!deletedCount) throw new NotFoundError();
	}
};