import { Schema, model, Document, Types } from 'mongoose';

export interface IEnrollment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  enrollmentDate: Date;
  grade: string;
  score: number;
  attendance: number;
  status: 'enrolled' | 'completed' | 'dropped' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F', 'Pending'],
      default: 'Pending',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    attendance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['enrolled', 'completed', 'dropped', 'pending'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate enrollments
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default model<IEnrollment>('Enrollment', EnrollmentSchema);
