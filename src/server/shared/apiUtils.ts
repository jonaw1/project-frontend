import logger from './logger';
import { Request, Response } from 'express';

export const logApiCall = (req: Request) => {
  logger.info(
    `Received ${req.method} request to ${req.originalUrl}: ${JSON.stringify(req.body)}`
  );
  logger.debug(`Request headers: ${JSON.stringify(req.headers)}`);
  logger.debug(`Request IP: ${req.ip}`);
  logger.debug(`Request protocol: ${req.protocol}`);
  logger.debug(`Request query: ${JSON.stringify(req.query)}`);
  logger.debug(`Request params: ${JSON.stringify(req.params)}`);
};

export const tryCatchWrapper = (
  func: (req: Request, res: Response) => Promise<Response>
) => {
  return async (req: Request, res: Response): Promise<Response> => {
    try {
      return await func(req, res);
    } catch (error) {
      logger.error('Internal Server Error:', error);
      return res
        .status(500)
        .json({ errors: [{ msg: 'Internal Server Error' }] });
    }
  };
};
