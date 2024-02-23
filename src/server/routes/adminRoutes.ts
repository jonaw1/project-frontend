import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/database';
import logger from '../shared/logger';

const router = Router();

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user?.admin) {
    return res.redirect('/');
  } else {
    return next();
  }
};

router.get(
  '/all-courses',
  requireAdmin,
  async (req: Request, res: Response) => {
    const user_id = req.session.user?.user_id;
    let courses;
    try {
      courses = await db('courses');
      for (const course of courses) {
        const assignments = await db('assignments').where({
          course_id: course.course_idK
        });
        for (const assignment of assignments) {
          assignment.tasks = await db('tasks').where({
            assignment_id: assignment.assignment_id
          });
        }
        course.assignments = assignments;
      }
    } catch (error) {
      logger.error('Error while fetching tree data:', error);
    }
    logger.info(
      `User <${req.session.user?.email}> successfully fetched tree data`
    );
    return res.render('all-courses', { route: 'all-courses', courses });
  }
);

router.get('/users', requireAdmin, async (req: Request, res: Response) => {
  const users = await db.select().from('users').whereNot('deleted', 1);
  res.render('users', { users, route: 'users' });
});

router.post('/users/:id', requireAdmin, async (req: Request, res: Response) => {
  const emailConfirm = req.body.email;
  const id = req.params.id;
  const currUserEmail = req.session?.user?.email;
  const user = await db('users').where({ user_id: id }).first();
  const admins = await db('users').where({ admin: true });
  if (user.admin && admins.length == 1) {
    logger.info(
      `User <${currUserEmail}> tried to delete their account, but is only admin`
    );
    req.flash(
      'error',
      'Löschen nicht möglich, da Sie der einzige Administrator sind!'
    );
    return res.redirect('/users');
  }
  if (!user) {
    logger.error(
      `User <${currUserEmail}> tried to delete user, but user doesn't exist`
    );
    req.flash('error', 'Zu löschender Nutzer existiert nicht!');
    return res.redirect('/users');
  }
  if (user.email != emailConfirm) {
    logger.info(
      `User <${currUserEmail}> tried to delete user <${user.email}>, but entered wrong email address`
    );
    req.flash(
      'error',
      'Falsche Email-Adresse zur Bestätigung eingegeben. Bitte erneut probieren!'
    );
    return res.redirect('/users');
  }
  const users = await db('users')
    .where({ user_id: id })
    .update({ deleted: true }, ['email']);
  logger.info(
    `<${currUserEmail}> successfully deleted user <${users[0].email}>`
  );
  req.flash('success', `Nutzer ${users[0].email} wurde erfolgreich gelöscht!`);
  await db('users')
    .where({ user_id: id })
    .update({ email: `${users[0].email}-deleted` }, ['email']);
  return res.redirect('/users');
});

router.post('/users/edit/:id', requireAdmin, async (req: Request, res: Response) => {
  const currUserEmail = req.session?.user?.email;
  const id = req.params.id;
  const email = req.body.email;
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const admin = req.body.admin;
  logger.info(`User: <${currUserEmail}> id:<${id}> email:<${email}> firstName:<${firstName}> lastName:<${lastName}> admin:<${admin}>`)

  const user = await db('users').where({ user_id: id }).first();
  const admins = await db('users').where({ admin: true });

  if (user.admin && admins.length == 1 && admin == 0) {
    logger.info(
      `User <${currUserEmail}> tried to delete their account, but is only admin`
    );
    req.flash(
      'error',
      'Entfernen der Administrator-Rolle nicht möglich, da Sie der einzige Administrator sind!'
    );
    return res.redirect('/users');
  }

  await db('users')
    .where({ user_id: id })
    .update({ first_name: firstName, last_name: lastName, email: email, admin: admin }, ['first_name', 'last_name', 'email', 'admin']);
    logger.info(
      `<${currUserEmail}> successfully edited user <${email}>`
    );
    req.flash('success', `Nutzer ${email} wurde erfolgreich geändert!`);
  return res.redirect('/users');
});

router.post('/users', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  body.email = body.email.trim().toLowerCase();

  const currUserEmail = req.session?.user?.email;

  const user = await db('users')
    .select()
    .where({ email: body.email, deleted: false })
    .then((rows) => {
      return rows[0] ?? null;
    });

  if (!!user) {
    logger.info(
      `<${currUserEmail}> tried to add user <${body.email}>, but email already added`
    );
    req.flash('error', `Email ${body.email} existiert bereits!`);
    return res.redirect('/users');
  }

  await db('users').insert(body);
  logger.info(`<${currUserEmail}> successfully added user <${body.email}>`);
  req.flash('success', `Email ${body.email} wurde erfolgreich hinzugefügt!`);
  res.redirect('/users');
});

export default router;
