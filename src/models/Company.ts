import mongoose, { Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  description: string;
  location: string;
  logo: string;
  website: string;
  recruiter: any;
}

const schema = new mongoose.Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company =
  mongoose.models.Company || mongoose.model<ICompany>("Company", schema);

export default Company;