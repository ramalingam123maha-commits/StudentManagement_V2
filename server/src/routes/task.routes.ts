import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all tasks
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, priority, assignedTo } = req.query;
  let query: any = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = { $in: [assignedTo] };

  const tasks = await Task.find(query)
    .populate('createdBy', 'username email')
    .populate('assignedTo', 'username email')
    .sort({ dueDate: 1 });

  res.json({ success: true, data: tasks });
}));

// Get task by ID
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id)
    .populate('createdBy', 'username email')
    .populate('assignedTo', 'username email')
    .populate('comments.user', 'username email');

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  res.json({ success: true, data: task });
}));

// Create task
router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('dueDate').isISO8601(),
    body('priority').isIn(['low', 'medium', 'high', 'urgent']),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const task = new Task({
      ...req.body,
      createdBy: req.user?.id,
      status: 'todo',
    });

    await task.save();
    await task.populate('createdBy assignedTo', 'username email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  })
);

// Update task
router.patch(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy assignedTo', 'username email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task updated successfully', data: task });
  })
);

// Add comment to task
router.post('/:id/comments', authenticate, 
  [body('text').notEmpty()],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            user: req.user?.id,
            text: req.body.text,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    )
      .populate('comments.user', 'username email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: task,
    });
  })
);

// Assign task
router.post('/:id/assign', authenticate, 
  [body('userId').notEmpty()],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { assignedTo: req.body.userId } },
      { new: true }
    )
      .populate('assignedTo', 'username email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task assigned successfully',
      data: task,
    });
  })
);

// Delete task
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  })
);

export default router;
