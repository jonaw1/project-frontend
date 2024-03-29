import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import logger from '../shared/logger';

const router = Router();

router.get(
  '/api/tasks',
  async (_req: Request, res: Response) => {
    try {
      const courses = await db('courses');
      for (const course of courses) {
        const assignments = await db('assignments').where({
          course_id: course.course_id
        });
        for (const assignment of assignments) {
          const tasks = await db('tasks').where({
            assignment_id: assignment.assignment_id
          });

          for (const task of tasks) {
            delete task.configuration;
            delete task.assignment_id;
          }

          assignment.tasks = tasks;
          delete assignment.course_id;
          delete assignment.assignment_id;
        }
        course.assignments = assignments;
        delete course.user_id;
        delete course.course_id;
      }
      return res.status(200).json(courses)
    } catch (error) {
      logger.error(
        `Error while trying to fetch all courses from database: ${error}`
      );
      return res.status(500).json({ error: 'Internal server error' });

    }
  });

router.post('/api/run', async (req, res) => {
  const { task_id, answers } = req.body;

  try {
    const task = await db('tasks').where({ task_id }).first();
    if (!task) {
      logger.error(
        `Tried to run task <${task_id}>, but task not found`
      );
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!answers) {
      return res.status(400).json({ error: 'No answers provided' });
    }

    const response = await (
      await fetch(process.env.CLOUDCHECK_URL as string, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            answer: answers[0],
            feedback: [],
            answers,
            attemptCount: 0,
            showSolution: false,
            user: null,
            assignment: null,
            block: null,
            question: null,
            checkerClass: null,
            settings: null,
            mass: JSON.parse(task.configuration),
          },
          pipeline: [
            {
              action: 'git',
              options: {
                gitUrl: 'https://github.com/qped-eu/MASS-checker.git',
                gitBranch: 'qf'
              }
            }
          ]
        })
      })
    ).json();

    res.status(200).json({
      feedback: response.data.feedback
    });
  } catch (error) {
    logger.error(
      `Error while trying to run assignment <${task_id}>: ${error}`
    );
    return res.status(500).json({ error: 'Internal server error' });
  }
})

export default router;