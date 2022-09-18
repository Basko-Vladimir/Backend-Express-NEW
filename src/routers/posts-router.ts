import {Request, Response, Router} from "express";
import {getErrorStatus} from "./utils";
import {postsService} from "../services/posts-service";
import {checkAuthorization} from "../middlewares/check-authorization";
import {postRequestFullBodyValidation} from "../middlewares/posts/post-request-full-body-validation";
import {requestErrorsValidation} from "../middlewares/request-errors-validation";
import {PostOutputModel, PostsQueryParamsOutputModel} from "../models/posts/output-models";
import {ParamIdInputModel} from "../models/common-models";
import {queryPostsRepository} from "../repositories/posts/query-posts-repository";
import {CreatePostInputModel, PostsQueryParamsInputModel, UpdatePostInputModel} from "../models/posts/input-models";
import {queryBlogsRepository} from "../repositories/blogs/query-blogs-repository";
import {BlogAllPostsOutputModel} from "../models/blogs/output-models";
import {TypedRequestBody, TypedRequestParams, TypedRequestQuery } from "../common/interfaces";
import {PostSortByField, SortDirection} from "../models/enums";
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "../common/constants";

export const postsRouter = Router({});

postsRouter.get(
	"/",
	async (req: TypedRequestQuery<PostsQueryParamsInputModel>, res: Response<BlogAllPostsOutputModel>) => {
		try {
			const { sortBy, sortDirection, pageNumber , pageSize } = req.query;
			const queryParamsData: PostsQueryParamsOutputModel = {
				sortBy: sortBy || PostSortByField.createdAt,
				sortDirection: sortDirection ? SortDirection[sortDirection] : SortDirection.desc,
				pageNumber: Number(pageNumber) || DEFAULT_PAGE_NUMBER,
				pageSize: Number(pageSize) || DEFAULT_PAGE_SIZE
			};
			const postsOutputModel = await queryPostsRepository.getAllPosts(queryParamsData);

			res.status(200).send(postsOutputModel);
		}	catch (error) {
			res.sendStatus(getErrorStatus(error));
		}
	});

postsRouter.get(
	"/:id",
	async (req: TypedRequestParams<ParamIdInputModel>, res: Response<PostOutputModel>) => {
		try {
			const post = await queryPostsRepository.getPostById(req.params.id);
			res.status(200).send(post);
		} catch (error) {
			res.sendStatus(getErrorStatus(error));
		}
	});

postsRouter.post(
	"/",
	checkAuthorization,
	postRequestFullBodyValidation,
	requestErrorsValidation,
	async (req: TypedRequestBody<CreatePostInputModel>, res: Response<PostOutputModel>) => {
		try {
			const { name: blogName } = await queryBlogsRepository.getBlogById(req.body.blogId);
			const createdPostId = await postsService.createPost({...req.body, blogName});
			const post = await queryPostsRepository.getPostById(createdPostId);
			res.status(201).send(post);
		} catch (error) {
			res.sendStatus(getErrorStatus(error));
		}
	});

postsRouter.put(
	"/:id",
	checkAuthorization,
	postRequestFullBodyValidation,
	requestErrorsValidation,
	async (req: Request<ParamIdInputModel, {}, UpdatePostInputModel>, res: Response<void>) => {
		try {
			await postsService.updatePost({...req.body, ...req.params});
			res.sendStatus(204);
		} catch (error) {
			res.sendStatus(getErrorStatus(error));
		}
	});

postsRouter.delete(
	"/:id",
	checkAuthorization,
	requestErrorsValidation,
	async (req: TypedRequestParams<ParamIdInputModel>, res: Response) => {
		try {
			await postsService.deletePost(req.params.id);
			res.sendStatus(204);
		} catch (error) {
			res.sendStatus(getErrorStatus(error));
		}
	});
