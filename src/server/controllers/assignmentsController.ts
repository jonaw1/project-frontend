import logger from '../shared/logger';
import { Request, Response } from 'express';
import { db } from '../db/database';
import { tryCatchWrapper } from '../shared/apiUtils';

export const createAssignment = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { assignment_name, course_id } = req.body;

    const result = await db('tasks')
      .insert({ assignment_name, course_id })
      .returning('assignment_id');
    const assignmentId = result[0].assignment_id;
    logger.info('Assignment successfully created');
    return res
      .status(201)
      .json({
        success: true,
        message: 'Assignment successfully created',
        assignment_id: assignmentId
      });
  }
);

export const updateAssignment = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { assignment_id } = req.params;
    const { assignment_name, course_id } = req.body;

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

    await db('assignments').update({ deleted: true }).where({ assignment_id });
    return res
      .status(200)
      .json({ success: true, message: 'Assignment successfully deleted' });
  }
);
