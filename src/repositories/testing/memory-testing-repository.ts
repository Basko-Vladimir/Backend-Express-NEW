import { postsRepository } from "../posts/memory-posts-repository";
import { bloggersRepository } from "../bloggers/bloggers-repository";

export const testingRepository = {
	async deleteAllData(): Promise<void> {
		await bloggersRepository.deleteAllBloggers();
		await postsRepository.deleteAllPosts();
	}
};
