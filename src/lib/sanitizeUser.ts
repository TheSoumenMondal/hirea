import { IUser } from "@/models/User";
import { HydratedDocument } from "mongoose";

export function sanitizeUser(user: HydratedDocument<IUser>) {
  const { password, resetPasswordExpire, resetToken, ...safeUser } =
    user.toObject();
  return safeUser;
}
