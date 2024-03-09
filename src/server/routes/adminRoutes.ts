import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/database';
import logger from '../shared/logger';
import { EmailType, User } from '../shared/types';
import { craftEmail, generateRandomToken } from '../shared/utils';
import sendEmail from '../shared/email';

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
    let courses;
    try {
      courses = await db('courses');
      for (const course of courses) {
        const assignments = await db('assignments').where({
          course_id: course.course_id
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

router.post(
  '/users/edit/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    const currUserEmail = req.session?.user?.email;
    const user_id = req.params.id;
    const { email, first_name, last_name, admin } = req.body;

    const editUser: User = await db('users').where({ user_id }).first();
    if (!editUser) {
      logger.error(
        `User <${currUserEmail}> tried to edit user with ID<${user_id}>, but user not found`
      );
      req.flash('error', 'Nutzer wurde nicht gefunden!');
      return res.redirect('/users');
    }

    if (admin == 0 && editUser.admin) {
      logger.error(
        `User <${currUserEmail}> tried to downgrade user <${editUser.email}> from admin to user -> not allowed`
      );
      req.flash('error', 'Ändern von Admin zu Nutzer nicht erlaubt!');
      return res.redirect('/users');
    }

    type UpdateUserBody = {
      first_name?: string;
      last_name?: string;
      admin?: boolean;
    };
    const updateObject: UpdateUserBody = {};
    if (first_name != editUser.first_name) {
      updateObject['first_name'] = first_name;
    }
    if (last_name != editUser.last_name) {
      updateObject['last_name'] = last_name;
    }
    if (admin != editUser.admin) {
      updateObject['admin'] = admin == 0 ? false : true;
    }

    let flashMessage;
    if (Object.keys(updateObject).length > 0) {
      await db('users').where({ user_id }).update(updateObject);
      logger.info(
        `<${currUserEmail}> successfully edited user <${editUser.email}>`
      );
      flashMessage = `Nutzer ${editUser.email} wurde erfolgreich geändert!`;
    }

    if (email != editUser.email) {
      const userForEmailExists = await db('users').where({ email }).first();
      if (!!userForEmailExists) {
        logger.error(
          `User <${currUserEmail}> tried to change email of user with ID<${user_id}>, but new email already in use`
        );
        req.flash('error', 'Email wird bereits genutzt!');
        return res.redirect('/users');
      }
      const randomToken = generateRandomToken();
      try {
        const url = `${process.env.BASE_URL}/confirm-new-email/${randomToken}`;
        await sendEmail(
          email,
          'Bestätigen Sie Ihre neue Email-Adresse',
          craftEmail({
            firstName: first_name,
            lastName: last_name,
            url,
            emailType: EmailType.ForeignEmailChange,
            actor: currUserEmail
          })
        );
      } catch (error) {
        logger.error(
          `Error sending email while user <${currUserEmail}> tried to change email of <${editUser.email}>:`,
          error
        );
        req.flash(
          'error',
          'Fehler beim Senden der Bestätigungsemail, bitte Administrator kontaktieren!'
        );
        return res.redirect('/users');
      }

      const emailUpdateObject = {
        new_email: email,
        confirm_new_email_token: randomToken,
        confirm_new_email_token_expires_at: new Date(
          new Date().getTime() + 60000 * 60 * 24
        )
      };
      await db('users').where({ user_id }).update(emailUpdateObject);
      logger.info(
        `<${currUserEmail}> requested email change for <${editUser.email}>, confirmation email sent`
      );
      flashMessage = `Bestätigungsemail zum Ändern der Email versandt an <${email}>!`;
    }

    if (flashMessage) {
      req.flash('success', flashMessage);
    }
    return res.redirect('/users');
  }
);

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
