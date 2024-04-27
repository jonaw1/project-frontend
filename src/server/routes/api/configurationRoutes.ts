import { Router, Request, Response } from 'express';
import { logApiCall } from '../../shared/apiUtils';
import logger from '../../shared/logger';
import { db } from '../../db/database';

const router = Router();

router.get(
  '/api/configuration/:task_id',
  logApiCall,
  async (req: Request, res: Response) => {
    try {
      const { task_id } = req.params;
      const { actor } = req.headers;
      if (!actor) {
        logger.error(
          `Config for task <${task_id}> couldn't be fetched due to missing actor`
        );
        return res.status(400).json({
          error: 'actor is required in the get config request headers'
        });
      }
      const task = await db('tasks').where({ task_id }).first();
      if (!task) {
        logger.error(
          `User <${actor}> tried to fetch config for task <${task_id}>, but task not found`
        );
        return res.status(404).json({ error: 'Task not found' });
      }
      logger.info(
        `User <${actor}> successfully fetched config for task <${task_id}>`
      );
      return res.status(200).json(task.configuration);
    } catch (error) {
      logger.error(
        `Error while user <${req.body.actor}> tried to fetch config for task <${req.params.task_id}>: ${error}`
      );
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.put(
  '/api/configuration/:task_id',
  logApiCall,
  async (req: Request, res: Response) => {
    try {
      const { task_id } = req.params;
      const { configuration } = req.body;
      const { actor } = req.headers;
      if (!actor) {
        logger.error(
          `Config for task <${task_id}> couldn't be updated due to missing actor`
        );
        return res.status(400).json({
          error: 'actor is required in the put config request headers'
        });
      }
      if (!configuration) {
        logger.error(
          `User <${actor}> tried to update config of task <${task_id}>, but no config provided`
        );
        return res.status(400).json({
          error: 'configuration is required in the put config request body'
        });
      }
      try {
        JSON.parse(configuration);
      } catch (e) {
        logger.error(
          `User <${actor}> tried to update config of task <${task_id}>, but config is not valid JSON`
        );
        return res.status(400).json({
          error: 'configuration must be valid JSON'
        });
      }
      await db('tasks').where({ task_id }).update({ configuration });
      logger.info(
        `User <${actor}> successfully updated config for task <${task_id}>`
      );
      return res.status(200).json({
        message: `Configuration for task <${task_id}> updated successfully`
      });
    } catch (error) {
      logger.error(
        `Error while user <${req.body.actor} tried to update config for task <${req.params.task_id}>: ${error}`
      );
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
