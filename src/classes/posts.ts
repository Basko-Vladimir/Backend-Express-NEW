import {ObjectId} from "mongodb";
import {EntityWithoutId} from "../interfaces/common-interfaces";

export class Post {
	_id: ObjectId | null = null;
	title: string;
	shortDescription: string;
	content: string;
	blogName: string;
	blogId: ObjectId;
	createdAt: string;
	
	
	constructor ({
	 title, content, blogId, blogName, shortDescription}: EntityWithoutId<Omit<Post, "createdAt">>
	) {
			this.title = title;
			this.content = content;
			this.shortDescription = shortDescription;
			this.blogName = blogName;
			this.blogId = blogId;
			this.createdAt = new Date().toISOString();
		}
}
