import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://AlvinAcosta:A7v1n@nextjscluster.xru866t.mongodb.net/?retryWrites=true&w=majority";

export const connectToDatabase = async () => {
  const client = new MongoClient(uri);
  await client.connect();

  return client;
};
