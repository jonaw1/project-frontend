import logger from '../shared/logger';
import { Request, Response } from 'express';
import { db } from '../db/database';
import { tryCatchWrapper, validateActor } from '../shared/apiUtils';

const validateCourseId = async (course_id: string, res: Response) => {
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
};

const validateCourseName = async (
  course_name: string,
  user_id: number,
  res: Response
) => {
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
};

const validateUserId = async (user_id: number, res: Response) => {
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
};

export const createCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { course_name, user_id, actor } = req.body;
    await validateActor(actor, res);
    await validateUserId(user_id, res);
    await validateCourseName(course_name, user_id, res);

    await db('courses').insert({ course_name, user_id });
    logger.info('Course successfully created');
    return res
      .status(201)
      .json({ success: true, message: 'Course successfully created' });
  }
);

export const updateCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const { course_name, user_id, actor } = req.body;
    await validateCourseId(course_id, res);
    await validateActor(actor, res);
    await validateUserId(user_id, res);
    await validateCourseName(course_name, user_id, res);
    

    const couldntFindCourseForUser =
      (await db('courses')
        .where({ course_id, user_id, deleted: false })
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
      .update({ course_name })
      .where({ course_id });
    return res
      .status(200)
      .json({ success: true, message: 'Course name successfully updated' });
  }
);

export const deleteCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const { actor } = req.body;
    await validateCourseId(course_id, res);
    await validateActor(actor, res);

    await db('courses')
      .update({ deleted: true })
      .where({ course_id });
    return res
      .status(200)
      .json({ success: true, message: 'Course successfully deleted' });
  }
);
