import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "jobseeker" | "recruiter";
  bio?: string;
  skills?: string[];
  resume?: string;
  socialMediaProfiles?: string[];
  profilePhoto?: string;
  savedJobs?: string[];
  resetPasswordExpire?: Date;
  resetToken?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      enum: ["jobseeker", "recruiter"],
      required: true,
    },
    bio: { type: String },
    skills: {
      type: [String],
      default: [],
    },
    resume: { type: String },
    socialMediaProfiles: {
      type: [String],
      default: [],
    },
    profilePhoto: { type: String },
    savedJobs: {
      type: [String],
      default: [],
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;
