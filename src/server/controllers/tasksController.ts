import logger from '../shared/logger';
import { Request, Response } from 'express';
import { db } from '../db/database';
import { tryCatchWrapper } from '../shared/apiUtils';

export const createTask = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { task_name, assignment_id } = req.body;

    const result = await db('tasks')
      .insert({ task_name, assignment_id })
      .returning('task_id');
    const taskId = result[0].task_id;
    logger.info('Task successfully created');
    return res
      .status(201)
      .json({
        success: true,
        message: 'Task successfully created',
        task_id: taskId
      });
  }
);

export const updateTask = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { task_id } = req.params;
    const { task_name, assignment_id } = req.body;

    const couldntFindTaskForAssignment =
      (await db('tasks')
        .where({ task_id, assignment_id, deleted: false })
        .first()) == null;
    if (couldntFindTaskForAssignment) {
      logger.error(`Task ID not found for given assignment ID`);
      return res.status(400).json({
        errors: [
          {
            type: 'field',
            msg: 'Task ID does not exist for given assignment ID',
            path: 'task_id',
            location: 'params'
          }
        ]
      });
    }

    await db('tasks').update({ task_name }).where({ task_id });
    return res
      .status(200)
      .json({ success: true, message: 'Task name successfully updated' });
  }
);

export const deleteTask = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { task_id } = req.params;

    await db('tasks').update({ deleted: true }).where({ task_id });
    return res
      .status(200)
      .json({ success: true, message: 'Task successfully deleted' });
  }
);
