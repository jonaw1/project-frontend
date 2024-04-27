import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import indexRoute from './routes/indexRoute';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import configurationRoutes from './routes/api/configurationRoutes';
import courseRoutes from './routes/api/courseRoutes';
import taskRoutes from './routes/api/taskRoutes';
import session from 'express-session';
import { startDatabase } from './db/database';
import KnexSessionStore, { StoreFactory } from 'connect-session-knex';
import { db } from './db/database';
import flash from 'connect-flash';
import { User } from './shared/types';
import dotenv from 'dotenv';
import logger from './shared/logger';
import publicRoutes from './routes/publicRoutes';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const KnexStore: StoreFactory = KnexSessionStore(session);
app.use(
  session({
    store: new KnexStore({
      knex: db,
      tablename: 'sessions',
      createtable: true
    }),
    secret: process.env.SESSION_SECRET ?? 'your-session-secret',
    resave: true,
    saveUninitialized: false
  })
);
app.use(flash());

// Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..', 'client', 'views'));

// Serve static files from the "assets" directory
app.use(express.static(path.join(__dirname, '..', 'client', 'assets')));

// Send session information to all routes
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    const userStillExists = await db('users')
      .where({
        user_id: req.session.user.user_id,
        active: true,
        deleted: false
      })
      .first();

    if (!userStillExists) {
      logger.info(
        `User <${req.session.user.email}> has been logged out, account was previously deleted`
      );
      req.session.user = undefined;
    }
  }

  res.locals.success = req.flash('success')[0];
  res.locals.error = req.flash('error')[0];
  res.locals.user = req.session?.user;
  next();
});

app.use('/', configurationRoutes);
app.use('/', courseRoutes);
app.use('/', taskRoutes);
app.use('/', indexRoute);
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/', publicRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error:', err.stack);
  res.status(500).send('Something broke!');
  next();
});

startDatabase({ reset: false }).then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
});
