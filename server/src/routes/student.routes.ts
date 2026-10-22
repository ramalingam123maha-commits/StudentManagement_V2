import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Student from '../models/Student';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all students
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json({ success: true, data: students });
}));

// Get student by ID
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, data: student });
}));

// Create student
router.post(
  '/',
  authenticate,
  authorize('admin', 'instructor'),
  [
    body('registrationNumber').notEmpty(),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('email').isEmail(),
    body('phone').notEmpty(),
    body('dateOfBirth').isISO8601(),
    body('address').notEmpty(),
    body('department').notEmpty(),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const existingStudent = await Student.findOne({
      $or: [{ registrationNumber: req.body.registrationNumber }, { email: req.body.email }],
    });

    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student already registered' });
    }

    const student = new Student(req.body);
    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student,
    });
  })
);

// Update student
router.patch(
  '/:id',
  authenticate,
  authorize('admin', 'instructor'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student updated successfully', data: student });
  })
);

// Delete student
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted successfully' });
  })
);

export default router;
