import { Request, Response, NextFunction } from 'express';
import logger from '../shared/logger';
import { validationResult } from 'express-validator';
import { db } from '../db/database';

export const logApiCall = (req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `Received ${req.method} request to ${req.originalUrl}: ${JSON.stringify(req.body)}`
  );
  logger.debug(`Request headers: ${JSON.stringify(req.headers)}`);
  logger.debug(`Request IP: ${req.ip}`);
  logger.debug(`Request protocol: ${req.protocol}`);
  logger.debug(`Request query: ${JSON.stringify(req.query)}`);
  logger.debug(`Request params: ${JSON.stringify(req.params)}`);
  return next();
};

export const handleErrorsEV = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Express-validator error', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

export const validateActorDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const actor = req.body.actor;
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
  return next();
};
