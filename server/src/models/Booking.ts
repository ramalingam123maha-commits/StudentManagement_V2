import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  bookingNumber: string;
  room: Types.ObjectId;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    guestEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    guestPhone: {
      type: String,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'],
      default: 'confirmed',
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    specialRequests: String,
  },
  {
    timestamps: true,
  }
);

export default model<IBooking>('Booking', BookingSchema);
