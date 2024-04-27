import { Router } from 'express';
import { body, param } from 'express-validator';
import { logApiCall, handleErrorsEV } from '../../middleware/middleware';
import {
  createCourse,
  updateCourse,
  deleteCourse
} from '../../controllers/coursesController';
import {
  validateActorDB,
  validateCourseIdParamsDB,
  validateCourseNameForUserDB,
  validateUserIdDB
} from '../../middleware/middleware';

const router = Router();

const validateActorEV = () =>
  body('actor')
    .notEmpty()
    .withMessage('Actor is required')
    .trim()
    .isString()
    .withMessage('Actor must be a string');
const validateCourseNameEV = () =>
  body('course_name')
    .notEmpty()
    .withMessage('Course name is required')
    .trim()
    .isString()
    .withMessage('Course name must be a string');
const validateUserIdEV = () =>
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .trim()
    .isNumeric()
    .withMessage('User ID must be numeric');
const validateCourseIdEV = () =>
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
    validateActorEV(),
    validateCourseNameEV(),
    validateUserIdEV(),
    handleErrorsEV,
    validateActorDB,
    validateUserIdDB,
    validateCourseNameForUserDB
  ],
  createCourse
);

router.put(
  '/api/courses/delete/:course_id',
  [
    logApiCall,
    validateCourseIdEV(),
    validateActorEV(),
    handleErrorsEV,
    validateActorDB,
    validateCourseIdParamsDB
  ],
  deleteCourse
);

router.put(
  '/api/courses/:course_id',
  [
    logApiCall,
    validateCourseIdEV(),
    validateActorEV(),
    validateCourseNameEV(),
    validateUserIdEV(),
    handleErrorsEV,
    validateActorDB,
    validateCourseIdParamsDB,
    validateUserIdDB,
    validateCourseNameForUserDB
  ],
  updateCourse
);

export default router;
