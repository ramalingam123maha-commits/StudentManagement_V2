import { Schema, model, Document } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: string;
  roomType: 'single' | 'double' | 'suite' | 'deluxe';
  capacity: number;
  pricePerNight: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  amenities: string[];
  floor: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    roomType: {
      type: String,
      enum: ['single', 'double', 'suite', 'deluxe'],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance', 'reserved'],
      default: 'available',
    },
    amenities: [String],
    floor: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IRoom>('Room', RoomSchema);
