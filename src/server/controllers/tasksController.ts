import logger from '../shared/logger';
import { Request, Response } from 'express';
import { db } from '../db/database';
import { tryCatchWrapper } from '../shared/apiUtils';

interface ErrorObject {
  type: string;
  msg: string;
  path: string;
  location: string;
}

const validateTaskId = async (task_id: string): Promise<ErrorObject[]> => {
  const taskExists = await db('tasks')
    .where({ task_id, deleted: false })
    .first();
  if (!taskExists) {
    logger.error(`Task ID not found`);
    return [
      {
        type: 'field',
        msg: 'Task ID does not exist',
        path: 'task_id',
        location: 'params'
      }
    ];
  }
  return [];
};

const validateTaskName = async (
  task_name: string,
  assignment_id: number,
  res: Response
) => {
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
};

const validateAssignmentId = async (assignment_id: number, res: Response) => {
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
};

export const createTask = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { task_name, assignment_id } = req.body;
    await validateAssignmentId(assignment_id, res);
    await validateTaskName(task_name, assignment_id, res);

    await db('tasks').insert({ task_name, assignment_id });
    logger.info('Task successfully created');
    return res
      .status(201)
      .json({ success: true, message: 'Task successfully created' });
  }
);

export const updateTask = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { task_id } = req.params;
    const { task_name, assignment_id } = req.body;
    await validateTaskId(task_id);
    await validateAssignmentId(assignment_id, res);
    await validateTaskName(task_name, assignment_id, res);

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
    await validateTaskId(task_id);

    await db('tasks').update({ deleted: true }).where({ task_id });
    return res
      .status(200)
      .json({ success: true, message: 'Task successfully deleted' });
  }
);
