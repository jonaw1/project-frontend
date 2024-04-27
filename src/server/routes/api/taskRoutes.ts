import { Router } from 'express';
import { body, param } from 'express-validator';
import { logApiCall, handleErrorsEV } from '../../middleware/middleware';
import {
  createTask,
  deleteTask,
  updateTask
} from '../../controllers/tasksController';
import { validateActorDB } from '../../middleware/middleware';

const router = Router();

const validateActorEV = () =>
  body('actor')
    .notEmpty()
    .withMessage('Actor is required')
    .trim()
    .isString()
    .withMessage('Actor must be a string');
const validateTaskNameEV = () =>
  body('task_name')
    .notEmpty()
    .withMessage('Task name is required')
    .trim()
    .isString()
    .withMessage('Task name must be a string');
const validateAssignmentIdEV = () =>
  body('assignment_id')
    .notEmpty()
    .withMessage('Assignment ID is required')
    .trim()
    .isNumeric()
    .withMessage('Assignment ID must be numeric');
const validateTaskIdEV = () =>
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
    validateActorEV(),
    validateTaskNameEV(),
    validateAssignmentIdEV(),
    handleErrorsEV,
    validateActorDB
  ],
  createTask
);

router.put(
  '/api/tasks/delete/:task_id',
  [
    logApiCall,
    validateTaskIdEV(),
    validateActorEV(),
    handleErrorsEV,
    validateActorDB
  ],
  deleteTask
);

router.put(
  '/api/tasks/:task_id',
  [
    logApiCall,
    validateTaskIdEV(),
    validateActorEV(),
    validateTaskNameEV(),
    validateAssignmentIdEV(),
    handleErrorsEV,
    validateActorDB
  ],
  updateTask
);

export default router;
