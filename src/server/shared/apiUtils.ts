import logger from './logger';
import { Request, Response } from 'express';

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
