import logger from '../shared/logger';
import { Request, Response } from 'express';
import { db } from '../db/database';
import { tryCatchWrapper } from '../shared/apiUtils';

export const createCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { course_name, user_id } = req.body;

    const result = await db('courses')
      .insert({ course_name, user_id })
      .returning('course_id');
    const courseId = result[0].course_id;
    logger.info('Course successfully created');
    return res.status(201).json({
      success: true,
      message: 'Course successfully created',
      course_id: courseId
    });
  }
);

export const updateCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const { course_name, user_id } = req.body;

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
            location: 'params'
          }
        ]
      });
    }

    await db('courses').update({ course_name }).where({ course_id });
    logger.info('Course name successfully updated');
    return res
      .status(200)
      .json({ success: true, message: 'Course name successfully updated' });
  }
);

export const deleteCourse = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { course_id } = req.params;

    await db('courses').update({ deleted: true }).where({ course_id });
    logger.info('Course successfully deleted');
    return res
      .status(200)
      .json({ success: true, message: 'Course successfully deleted' });
  }
);
