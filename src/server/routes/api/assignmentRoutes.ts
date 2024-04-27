import { Router } from 'express';
import { body, param } from 'express-validator';
import { logApiCall, handleErrorsEV } from '../../middleware/middleware';
import {
  createAssignment,
  deleteAssignment,
  updateAssignment
} from '../../controllers/assignmentsController';
import { validateActorDB } from '../../middleware/middleware';

const router = Router();

const validateActorEV = () =>
  body('actor')
    .notEmpty()
    .withMessage('Actor is required')
    .trim()
    .isString()
    .withMessage('Actor must be a string');
const validateAssignmentNameEV = () =>
  body('assignment_name')
    .notEmpty()
    .withMessage('Assignment name is required')
    .trim()
    .isString()
    .withMessage('Assignment name must be a string');
const validateCourseIdEV = () =>
  body('course_id')
    .notEmpty()
    .withMessage('Course ID is required')
    .trim()
    .isNumeric()
    .withMessage('Course ID must be numeric');
const validateAssignmentIdEV = () =>
  param('assignment_id')
    .notEmpty()
    .withMessage('Assignment ID is required')
    .trim()
    .isNumeric()
    .withMessage('Assignment ID must be numeric');

router.post(
  '/api/assignments',
  [
    logApiCall,
    validateActorEV(),
    validateAssignmentNameEV(),
    validateCourseIdEV(),
    handleErrorsEV,
    validateActorDB
  ],
  createAssignment
);

router.put(
  '/api/assignments/delete/:assignment_id',
  [
    logApiCall,
    validateAssignmentIdEV(),
    validateActorEV(),
    handleErrorsEV,
    validateActorDB
  ],
  deleteAssignment
);

router.put(
  '/api/assignments/:assigment_id',
  [
    logApiCall,
    validateAssignmentIdEV(),
    validateActorEV(),
    validateAssignmentNameEV(),
    validateCourseIdEV(),
    handleErrorsEV,
    validateActorDB
  ],
  updateAssignment
);

export default router;
