// import { MongoClient } from "mongodb";
//
// const uri = process.env.MONGODB_URI as string;
// const options = {};
//
// if (!uri) throw new Error("Please add your Mongo URI to .env.local");
//
// let client = new MongoClient(uri, options);
// let clientPromise: Promise<MongoClient>;
//
// if (process.env.NODE_ENV === "development") {
//     // In dev mode, use global to prevent hot-reload reconnects
//     if (!(global as any)._mongoClientPromise) {
//         (global as any)._mongoClientPromise = client.connect();
//     }
//     clientPromise = (global as any)._mongoClientPromise;
// } else {
//     clientPromise = client.connect();
// }
//
// export default clientPromise;


// import { MongoClient } from "mongodb";
//
// const uri = process.env.MONGODB_URI as string;
// const options = {};
//
// if (!uri) throw new Error("Please add your Mongo URI to .env.local");
//
// const client = new MongoClient(uri, options);
// let clientPromise: Promise<MongoClient>;
//
// // Extend the globalThis type to include our property
// type GlobalWithMongo = typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>;
// };
//
// const globalWithMongo = globalThis as GlobalWithMongo;
//
// if (process.env.NODE_ENV === "development") {
//     if (!globalWithMongo._mongoClientPromise) {
//         globalWithMongo._mongoClientPromise = client.connect();
//     }
//     clientPromise = globalWithMongo._mongoClientPromise;
// } else {
//     clientPromise = client.connect();
// }
//
// export default clientPromise;


import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

if (!uri) throw new Error("Please add your Mongo URI to .env.local");

const client = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;