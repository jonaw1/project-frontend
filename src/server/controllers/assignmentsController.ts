import logger from '../shared/logger';
import { Request, Response } from 'express';
import { db } from '../db/database';
import { tryCatchWrapper } from '../shared/apiUtils';

const validateAssignmentId = async (assignment_id: string, res: Response) => {
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
};

const validateAssignmentName = async (
  assignment_name: string,
  course_id: number,
  res: Response
) => {
  const assignmentNameExists = await db('tasks')
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
};

const validateCourseId = async (course_id: number, res: Response) => {
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
};

export const createAssignment = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { assignment_name, course_id } = req.body;
    await validateCourseId(course_id, res);
    await validateAssignmentName(assignment_name, course_id, res);

    await db('tasks').insert({ assignment_name, course_id });
    logger.info('Assignment successfully created');
    return res
      .status(201)
      .json({ success: true, message: 'Assignment successfully created' });
  }
);

export const updateAssignment = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { assignment_id } = req.params;
    const { assignment_name, course_id } = req.body;
    await validateAssignmentId(assignment_id, res);
    await validateCourseId(course_id, res);
    await validateAssignmentName(assignment_name, course_id, res);

    const couldntFindAssignmentForCourse =
      (await db('assignment')
        .where({ assignment_id, course_id, deleted: false })
        .first()) == null;
    if (couldntFindAssignmentForCourse) {
      logger.error(`Assignment ID not found for given course ID`);
      return res.status(400).json({
        errors: [
          {
            type: 'field',
            msg: 'Assignment ID does not exist for given course ID',
            path: 'assignment_id',
            location: 'params'
          }
        ]
      });
    }

    await db('tasks').update({ assignment_name }).where({ course_id });
    return res
      .status(200)
      .json({ success: true, message: 'Assignment name successfully updated' });
  }
);

export const deleteAssignment = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { assignment_id } = req.params;
    await validateAssignmentId(assignment_id, res);

    await db('assignments').update({ deleted: true }).where({ assignment_id });
    return res
      .status(200)
      .json({ success: true, message: 'Assignment successfully deleted' });
  }
);
