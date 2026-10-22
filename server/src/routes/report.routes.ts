import { Router, Response } from 'express';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get academic performance report
router.get('/performance', authenticate, authorize('admin', 'instructor'), 
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const students = await Student.find();
    const enrollments = await Enrollment.find().populate('course');

    const report = students.map((student) => {
      const studentEnrollments = enrollments.filter((e: any) => e.student.toString() === student._id.toString());
      const averageScore = 
        studentEnrollments.length > 0
          ? studentEnrollments.reduce((sum: number, e: any) => sum + e.score, 0) / studentEnrollments.length
          : 0;

      const completedCourses = studentEnrollments.filter((e: any) => e.status === 'completed').length;

      return {
        student: student.registrationNumber,
        name: `${student.firstName} ${student.lastName}`,
        gpa: student.gpa,
        totalCredits: student.totalCredits,
        averageScore: averageScore.toFixed(2),
        completedCourses,
        totalEnrolled: studentEnrollments.length,
      };
    });

    res.json({ success: true, data: report });
  })
);

// Get departmental report
router.get('/department/:dept', authenticate, authorize('admin', 'instructor'), 
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const students = await Student.find({ department: req.params.dept });
    const enrollments = await Enrollment.find().populate('course');

    const report = {
      department: req.params.dept,
      totalStudents: students.length,
      activeStudents: students.filter((s) => s.status === 'active').length,
      averageGPA: (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2),
      students: students.map((s) => ({
        id: s._id,
        name: `${s.firstName} ${s.lastName}`,
        gpa: s.gpa,
        status: s.status,
      })),
    };

    res.json({ success: true, data: report });
  })
);

// Get enrollment statistics
router.get('/enrollment/stats', authenticate, authorize('admin', 'instructor'), 
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const enrollments = await Enrollment.find();

    const stats = {
      totalEnrollments: enrollments.length,
      byStatus: {
        enrolled: enrollments.filter((e) => e.status === 'enrolled').length,
        completed: enrollments.filter((e) => e.status === 'completed').length,
        dropped: enrollments.filter((e) => e.status === 'dropped').length,
        pending: enrollments.filter((e) => e.status === 'pending').length,
      },
      averageAttendance: (enrollments.reduce((sum, e) => sum + e.attendance, 0) / enrollments.length).toFixed(2),
      averageScore: (enrollments.reduce((sum, e) => sum + e.score, 0) / enrollments.length).toFixed(2),
    };

    res.json({ success: true, data: stats });
  })
);

export default router;
