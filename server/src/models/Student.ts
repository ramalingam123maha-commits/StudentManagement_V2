import { Schema, model, Document } from 'mongoose';

export interface IStudent extends Document {
  registrationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: string;
  department: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  gpa: number;
  totalCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      enum: ['Engineering', 'Science', 'Arts', 'Commerce', 'Business'],
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'suspended'],
      default: 'active',
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4.0,
      default: 0,
    },
    totalCredits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IStudent>('Student', StudentSchema);
