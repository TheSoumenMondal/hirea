import { IUser } from "@/models/User";
import { HydratedDocument } from "mongoose";

export function sanitizeUser(user: HydratedDocument<IUser>) {
  const { password, ...safeUser } = user.toObject();
  return safeUser;
}
