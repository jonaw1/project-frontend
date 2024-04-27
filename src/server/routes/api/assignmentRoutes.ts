import { Router } from 'express';
import { body, param } from 'express-validator';
import { logApiCall, handleErrors } from '../../shared/apiUtils';
import { createAssignment, deleteAssignment, updateAssignment } from '../../controllers/assignmentsController';

const router = Router();

const validateActor = () =>
  body('actor')
    .notEmpty()
    .withMessage('Actor is required')
    .trim()
    .isString()
    .withMessage('Actor must be a string');
const validateAssignmentName = () =>
  body('assignment_name')
    .notEmpty()
    .withMessage('Assignment name is required')
    .trim()
    .isString()
    .withMessage('Assignment name must be a string');
const validateCourseId = () =>
  body('course_id')
    .notEmpty()
    .withMessage('Course ID is required')
    .trim()
    .isNumeric()
    .withMessage('Course ID must be numeric');
const validateAssignmentId = () =>
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
    validateActor(),
    validateAssignmentName(),
    validateCourseId(),
    handleErrors
  ],
  createAssignment
);

router.put(
  '/api/assignments/delete/:assignment_id',
  [logApiCall, validateAssignmentId(), validateActor(), handleErrors],
  deleteAssignment
);

router.put(
  '/api/assignments/:assigment_id',
  [
    logApiCall,
    validateAssignmentId(),
    validateActor(),
    validateAssignmentName(),
    validateCourseId(),
    handleErrors
  ],
  updateAssignment
);

export default router;
