import {MongoClient} from "mongodb";
import {DataBaseError} from "../classes/errors";
import {Blog} from "../classes/blogs";
import {EntityWithoutId} from "../interfaces/common";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Vladimir:BaVlaG_192115@cluster0.nqlqdla.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(MONGO_URI);
const db = client.db("homework4")

export const blogsCollection = db.collection<EntityWithoutId<Blog>>("blogs");
export const postsCollection = db.collection("posts");

export async function runDb() {
	try {
		await client.connect();
		await db.command({ping: 1});
		console.log("Connected successfully to Mongo server!!!");
	} catch (err) {
		console.log(err);
		await client.close();
		throw new DataBaseError("Can't connect to mongodb!");
	}
}