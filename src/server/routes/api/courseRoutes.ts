import { Router } from 'express';
import { body, param } from 'express-validator';
import { logApiCall, handleErrors } from '../../shared/apiUtils';
import {
  createCourse,
  updateCourse,
  deleteCourse
} from '../../controllers/coursesController';

const router = Router();

const validateActor = () =>
  body('actor')
    .notEmpty()
    .withMessage('Actor is required')
    .trim()
    .isString()
    .withMessage('Actor must be a string');
const validateCourseName = () =>
  body('course_name')
    .notEmpty()
    .withMessage('Course name is required')
    .trim()
    .isString()
    .withMessage('Course name must be a string');
const validateUserId = () =>
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .trim()
    .isNumeric()
    .withMessage('User ID must be numeric');
const validateCourseId = () =>
  param('course_id')
    .notEmpty()
    .withMessage('Course ID is required')
    .trim()
    .isNumeric()
    .withMessage('Course ID must be numeric');

router.post(
  '/api/courses',
  [
    logApiCall,
    validateActor(),
    validateCourseName(),
    validateUserId(),
    handleErrors
  ],
  createCourse
);

router.put(
  '/api/courses/delete/:course_id',
  [logApiCall, validateCourseId(), validateActor(), handleErrors],
  deleteCourse
);

router.put(
  '/api/courses/:course_id',
  [
    logApiCall,
    validateCourseId(),
    validateActor(),
    validateCourseName(),
    validateUserId(),
    handleErrors
  ],
  updateCourse
);

export default router;
