import { Document, Schema, model, models, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "jobseeker" | "recruiter";
  bio?: string;
  skills?: string[];
  resume?: string;
  socialMediaProfiles?: {
    linkedin?: string;
    facebook?: string;
    github?: string;
    instagram?: string;
  };
  profilePhoto?: string;
  savedJobs?: Types.ObjectId[]; // changed to ObjectId[]
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
      type: new Schema(
        {
          linkedin: { type: String, default: "" },
          facebook: { type: String, default: "" },
          github: { type: String, default: "" },
          instagram: { type: String, default: "" },
        },
        { _id: false }
      ),
      default: {},
    },
    profilePhoto: { type: String },

    savedJobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

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
