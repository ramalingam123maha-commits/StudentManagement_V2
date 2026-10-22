import { Schema, model, Document } from 'mongoose';

export interface ICourse extends Document {
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  department: string;
  instructor: string;
  capacity: number;
  semester: string;
  schedule: {
    day: string;
    time: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    department: {
      type: String,
      required: true,
      enum: ['Engineering', 'Science', 'Arts', 'Commerce', 'Business'],
    },
    instructor: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    semester: {
      type: String,
      required: true,
    },
    schedule: [
      {
        day: String,
        time: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<ICourse>('Course', CourseSchema);
