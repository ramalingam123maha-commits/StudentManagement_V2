import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  assignedTo: Types.ObjectId[];
  createdBy: Types.ObjectId;
  dueDate: Date;
  completionDate?: Date;
  comments: {
    user: Types.ObjectId;
    text: string;
    timestamp: Date;
  }[];
  attachments: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'completed', 'cancelled'],
      default: 'todo',
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completionDate: Date,
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        text: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [String],
    tags: [String],
  },
  {
    timestamps: true,
  }
);

export default model<ITask>('Task', TaskSchema);
