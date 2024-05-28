import { Request, Response, NextFunction } from 'express';
import logger from '../shared/logger';
import { validationResult } from 'express-validator';
import { db } from '../db/database';

export const logApiCall = (req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `Received ${req.method} request to ${req.originalUrl}: ${JSON.stringify(req.body)}`
  );
  logger.debug(`Request headers: ${JSON.stringify(req.headers)}`);
  logger.debug(`Request IP: ${req.ip}`);
  logger.debug(`Request protocol: ${req.protocol}`);
  logger.debug(`Request query: ${JSON.stringify(req.query)}`);
  logger.debug(`Request params: ${JSON.stringify(req.params)}`);
  return next();
};

export const handleErrorsEV = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Express-validator error', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

export const validateActorDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const actor = req.body.actor;
  const actorExists = await db('users')
    .where({
      email: actor,
      active: true,
      deleted: false
    })
    .first();
  if (!actorExists) {
    logger.error(`Actor not found`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'Actor does not exist',
          path: 'actor',
          location: 'body'
        }
      ]
    });
  }
  return next();
};

export const validateCourseIdParamsDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { course_id } = req.params;
  const courseExists = await db('courses')
    .where({ course_id, deleted: false })
    .first();
  if (!courseExists) {
    logger.error(`Course ID not found`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'Course ID does not exist',
          path: 'course_id',
          location: 'params'
        }
      ]
    });
  }
  return next();
};

export const validateCourseIdBodyDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { course_id } = req.body;
  const courseExists = await db('courses')
    .where({ course_id, deleted: false })
    .first();
  if (!courseExists) {
    logger.error(`Course ID not found`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'Course ID does not exist',
          path: 'course_id',
          location: 'body'
        }
      ]
    });
  }
  return next();
};

export const validateCourseNameForUserDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { course_name, user_id } = req.body;
  const courseNameExists = await db('courses')
    .where({
      deleted: false,
      course_name,
      user_id
    })
    .first();
  if (courseNameExists) {
    logger.error(`Course name already exists for user ID`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'Course name already exists for given user ID',
          path: 'course_name',
          location: 'body'
        }
      ]
    });
  }
  return next();
};

export const validateUserIdDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.body;
  const userExists = await db('users')
    .where({ user_id, active: true, deleted: false })
    .first();
  if (!userExists) {
    logger.error(`User ID not found`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'User ID does not exist',
          path: 'user_id',
          location: 'body'
        }
      ]
    });
  }
  return next();
};

export const validateAssignmentIdParamsDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { assignment_id } = req.params;
  const assignmentExists = await db('assignments')
    .where({ assignment_id, deleted: false })
    .first();
  if (!assignmentExists) {
    logger.error(`Assignment ID not found`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'Assignment ID does not exist',
          path: 'assignment_id',
          location: 'params'
        }
      ]
    });
  }
  return next();
};

export const validateAssignmentIdBodyDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { assignment_id } = req.body;
  const assignmentExists = await db('assignments')
    .where({ assignment_id, deleted: false })
    .first();
  if (!assignmentExists) {
    logger.error(`Assignment ID not found`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'Assignment ID does not exist',
          path: 'assignment_id',
          location: 'body'
        }
      ]
    });
  }
  return next();
};

export const validateAssignmentNameForCourseDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { assignment_name, course_id } = req.body;
  const assignmentNameExists = await db('assignments')
    .where({
      deleted: false,
      assignment_name,
      course_id
    })
    .first();
  if (assignmentNameExists) {
    logger.error(`Assignment name already exists for course ID`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'Assignment name already exists for given course ID',
          path: 'assignment_name',
          location: 'body'
        }
      ]
    });
  }
  return next();
};

export const validateTaskIdDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { task_id } = req.params;
  const taskExists = await db('tasks')
    .where({ task_id, deleted: false })
    .first();
  if (!taskExists) {
    logger.error(`Task ID not found`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'Task ID does not exist',
          path: 'task_id',
          location: 'params'
        }
      ]
    });
  }
  return next();
};

export const validateTaskNameForAssignmentDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { task_name, assignment_id } = req.body;
  const taskNameExists = await db('tasks')
    .where({
      deleted: false,
      task_name,
      assignment_id
    })
    .first();
  if (taskNameExists) {
    logger.error(`Task name already exists for assignment ID`);
    return res.status(400).json({
      errors: [
        {
          type: 'field',
          msg: 'Task name already exists for given assignment ID',
          path: 'task_name',
          location: 'body'
        }
      ]
    });
  }
  return next();
};
