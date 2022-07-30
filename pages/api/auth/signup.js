import { hashPassword } from "../../../lib/auth-utils";
import { connectToDatabase } from "../../../lib/db-utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !email.includes("@") || !password || password.trim === "") {
    res
      .status(422)
      .json({ message: "Invalid Data.", error: "Request Failed." });

    return;
  }

  let client;

  try {
    client = await connectToDatabase();
    console.log("DB connected");
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong." });
    return;
  }

  const db = client.db("authProject-dev");
  const collection = db.collection("users");

  const hashedPassword = await hashPassword(password); // bcrypt

  const newUser = {
    email,
    password: hashedPassword,
  };

  // check if email already exists
  const foundUser = await collection.findOne({ email });

  if (foundUser) {
    res.status(422).json({ success: false, message: "Email already exists." });
    client.close();
    return;
  }

  // email is available --- create user.
  let insertedUser;

  try {
    insertedUser = await collection.insertOne(newUser);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed creating new user." });
    client.close();
    return;
  }

  client.close();
  res.status(201).json({ success: true, data: insertedUser });
}
