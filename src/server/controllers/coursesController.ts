import logger from '../shared/logger';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { db } from '../db/database';
import { logApiCall, tryCatchWrapper } from '../shared/apiUtils';

export const createCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    logApiCall(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation error', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseName, userId, actor } = req.body;

    const userExists = await db('users')
      .where({ user_id: userId, active: true, deleted: false })
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

    const courseNameExists = await db('courses')
      .where({
        deleted: false,
        course_name: courseName,
        user_id: userId
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

    await db('courses').insert({ course_name: courseName, user_id: userId });
    logger.info('Course successfully created');
    return res
      .status(201)
      .json({ success: true, message: 'Course successfully created' });
  }
);
