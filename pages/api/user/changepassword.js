import { getSession } from "next-auth/react";
import { comparePassword, hashPassword } from "../../../lib/auth-utils";
import { connectToDatabase } from "../../../lib/db-utils";

export default async function handler(req, res) {
  // check if request is a patch method
  if (req.method !== "PATCH") {
    res.status(422).json({ success: false, message: "Something went wrong." });
    return;
  }

  // check if user making request is authenticated, and use this for user email as well
  const session = await getSession({ req: req });

  if (!session) {
    res
      .status(401)
      .json({ success: false, message: "Unauthenticated request." });

    return;
  }

  const email = session.user.email;
  const {
    oldPass,
    newPass,
    // email
  } = req.body;

  // connect to database
  const client = await connectToDatabase();
  console.log("DB CONNECTED.");
  const db = client.db("authProject-dev");
  const collection = db.collection("users");

  // find user in database with email from sessions
  const foundUser = await collection.findOne({
    email: email,
  });

  // if no user with said email found
  if (!foundUser) {
    client.close();
    res.status(422).json({ success: false, message: "User email not found." });
    return;
  }

  // check if old password typed and password in database are the same
  const verified = await comparePassword(oldPass, foundUser.password);

  // passwords are not the same
  if (!verified) {
    client.close();
    res.status(403).json({ status: false, message: "Passwords do not match!" });
    return;
  }

  // hash new password
  const newHashedPassword = await hashPassword(newPass);

  // update old password into new hashed password
  const updatePassword = await collection.updateOne(
    { email: email },
    { $set: { password: newHashedPassword } }
  );

  client.close();
  res.status(201).json({
    success: true,
    message: "Password updated",
    data: updatePassword,
  });
}
