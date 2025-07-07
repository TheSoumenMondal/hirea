import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  role: string;
  salary: number;
  experience: number;
  location: string;
  status: "open" | "closed";
  openings: number;
  company: any;
  companyLogo: string;
  recruiter: any;
  applications: any;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    openings: {
      type: Number,
      required: true,
      default: 1,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    companyLogo: {
      type: String,
      required: false,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

const Job = models.Job || model<IJob>("Job", JobSchema);
export default Job;