import logger from '../shared/logger';
import { Request, Response } from 'express';
import { db } from '../db/database';
import { tryCatchWrapper } from '../shared/apiUtils';

const validateActor = async (actor: string, res: Response) => {
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
};

const validateCourseName = async (
  courseName: string,
  userId: number,
  res: Response
) => {
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
};

const validateUserId = async (userId: number, res: Response) => {
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
};

export const createCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { courseName, userId, actor } = req.body;
    await validateActor(actor, res);
    await validateUserId(userId, res);
    await validateCourseName(courseName, userId, res);

    await db('courses').insert({ course_name: courseName, user_id: userId });
    logger.info('Course successfully created');
    return res
      .status(201)
      .json({ success: true, message: 'Course successfully created' });
  }
);

export const updateCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { courseName, userId, actor } = req.body;
    await validateActor(actor, res);
    await validateUserId(userId, res);
    await validateCourseName(courseName, userId, res);

    const couldntFindCourse =
      (await db('courses')
        .where({ course_id: courseId, deleted: false })
        .first()) == null;
    if (couldntFindCourse) {
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

    const couldntFindCourseForUser =
      (await db('courses')
        .where({ course_id: courseId, user_id: userId, deleted: false })
        .first()) == null;
    if (couldntFindCourseForUser) {
      logger.error(`Course ID not found for given user ID`);
      return res.status(400).json({
        errors: [
          {
            type: 'field',
            msg: 'Course ID does not exist for given user ID',
            path: 'course_id',
            location: 'body'
          }
        ]
      });
    }

    await db('courses')
      .update({ course_name: courseName })
      .where({ course_id: courseId });
    return res
      .status(200)
      .json({ success: true, message: 'Course name successfully updated' });
  }
);

export const deleteCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { actor } = req.body;
    await validateActor(actor, res);

    await db('courses')
      .update({ deleted: true })
      .where({ course_id: courseId });
    return res
      .status(200)
      .json({ success: true, message: 'Course successfully deleted' });
  }
);
