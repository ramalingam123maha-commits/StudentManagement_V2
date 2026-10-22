import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import Student from '../models/Student';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all enrollments
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const enrollments = await Enrollment.find()
    .populate('student')
    .populate('course')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: enrollments });
}));

// Get student enrollments
router.get('/student/:studentId', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const enrollments = await Enrollment.find({ student: req.params.studentId })
    .populate('course')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: enrollments });
}));

// Enroll student in course
router.post(
  '/',
  authenticate,
  authorize('admin', 'instructor'),
  [body('student').notEmpty(), body('course').notEmpty()],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { student: studentId, course: courseId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Student already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      status: 'enrolled',
    });

    await enrollment.save();
    await enrollment.populate('student course');

    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: enrollment,
    });
  })
);

// Update enrollment (grade, attendance, etc.)
router.patch(
  '/:id',
  authenticate,
  authorize('admin', 'instructor'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('student')
      .populate('course');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.json({ success: true, message: 'Enrollment updated successfully', data: enrollment });
  })
);

// Drop course
router.post('/:id/drop', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    { status: 'dropped' },
    { new: true }
  )
    .populate('student')
    .populate('course');

  if (!enrollment) {
    return res.status(404).json({ success: false, message: 'Enrollment not found' });
  }

  res.json({ success: true, message: 'Course dropped successfully', data: enrollment });
}));

export default router;
