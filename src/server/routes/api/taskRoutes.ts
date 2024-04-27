import { Router } from 'express';
import { body, param } from 'express-validator';
import { logApiCall, handleErrors } from '../../shared/apiUtils';
import { createTask, deleteTask, updateTask } from '../../controllers/tasksController';

const router = Router();

const validateActor = () =>
  body('actor')
    .notEmpty()
    .withMessage('Actor is required')
    .trim()
    .isString()
    .withMessage('Actor must be a string');
const validateTaskName = () =>
  body('task_name')
    .notEmpty()
    .withMessage('Task name is required')
    .trim()
    .isString()
    .withMessage('Task name must be a string');
const validateAssignmentId = () =>
  body('assignment_id')
    .notEmpty()
    .withMessage('Assignment ID is required')
    .trim()
    .isNumeric()
    .withMessage('Assignment ID must be numeric');
const validateTaskId = () =>
  param('task_id')
    .notEmpty()
    .withMessage('Task ID is required')
    .trim()
    .isNumeric()
    .withMessage('Task ID must be numeric');

router.post(
  '/api/tasks',
  [
    logApiCall,
    validateActor(),
    validateTaskName(),
    validateAssignmentId(),
    handleErrors
  ],
  createTask
);

router.put(
  '/api/tasks/delete/:task_id',
  [logApiCall, validateTaskId(), validateActor(), handleErrors],
  deleteTask
);

router.put(
  '/api/tasks/:task_id',
  [
    logApiCall,
    validateTaskId(),
    validateActor(),
    validateTaskName(),
    validateAssignmentId(),
    handleErrors
  ],
  updateTask
);

export default router;
