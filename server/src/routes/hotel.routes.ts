import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Room from '../models/Room';
import Booking from '../models/Booking';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get available rooms
router.get('/rooms/available', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { checkInDate, checkOutDate } = req.query;

  let query: any = { status: 'available' };

  if (checkInDate && checkOutDate) {
    const bookings = await Booking.find({
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        },
      ],
      status: { $ne: 'cancelled' },
    });

    const bookedRoomIds = bookings.map((b) => b.room);
    query = { ...query, _id: { $nin: bookedRoomIds } };
  }

  const rooms = await Room.find(query);
  res.json({ success: true, data: rooms });
}));

// Get all rooms
router.get('/rooms', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const rooms = await Room.find();
  res.json({ success: true, data: rooms });
}));

// Create room
router.post(
  '/rooms',
  authenticate,
  authorize('admin', 'staff'),
  [
    body('roomNumber').notEmpty(),
    body('roomType').isIn(['single', 'double', 'suite', 'deluxe']),
    body('capacity').isInt({ min: 1 }),
    body('pricePerNight').isFloat({ min: 0 }),
    body('floor').isInt({ min: 0 }),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
    if (existingRoom) {
      return res.status(400).json({ success: false, message: 'Room already exists' });
    }

    const room = new Room(req.body);
    await room.save();

    res.status(201).json({ success: true, message: 'Room created successfully', data: room });
  })
);

// Create booking
router.post(
  '/bookings',
  [
    body('roomId').notEmpty(),
    body('guestName').notEmpty(),
    body('guestEmail').isEmail(),
    body('guestPhone').notEmpty(),
    body('checkInDate').isISO8601(),
    body('checkOutDate').isISO8601(),
    body('numberOfGuests').isInt({ min: 1 }),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { roomId, guestName, guestEmail, guestPhone, checkInDate, checkOutDate, numberOfGuests, specialRequests } =
      req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid dates' });
    }

    const booking = new Booking({
      bookingNumber: `BK-${Date.now()}`,
      room: roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice: room.pricePerNight * nights,
      specialRequests,
    });

    await booking.save();
    room.status = 'reserved';
    await room.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  })
);

// Check-in
router.post('/bookings/:id/checkin', authenticate, authorize('admin', 'staff'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'checked-in' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const room = await Room.findByIdAndUpdate(booking.room, { status: 'occupied' }, { new: true });

    res.json({
      success: true,
      message: 'Check-in successful',
      data: { booking, room },
    });
  })
);

// Check-out
router.post('/bookings/:id/checkout', authenticate, authorize('admin', 'staff'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'checked-out' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const room = await Room.findByIdAndUpdate(booking.room, { status: 'available' }, { new: true });

    res.json({
      success: true,
      message: 'Check-out successful',
      data: { booking, room },
    });
  })
);

// Get all bookings
router.get('/bookings', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookings = await Booking.find().populate('room').sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
}));

export default router;
