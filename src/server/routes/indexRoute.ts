import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/database';
import logger from '../shared/logger';
import {
  craftEmail,
  generateRandomToken,
  stringToTitleCase
} from '../shared/utils';
import sendEmail from '../shared/email';
import { EmailType } from '../shared/types';
import bcrypt from 'bcrypt';

const router = Router();

const requireAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user?.user_id) {
    return res.redirect('/');
  } else {
    return next();
  }
};

router.get('/', (req: Request, res: Response) => {
  return res.render('index');
});

router.post('/logout', requireAuthenticated, (req: Request, res: Response) => {
  delete req.session.user;
  return res.redirect('back');
});

router.get(
  '/confirm-new-email/:token',
  requireAuthenticated,
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const user = await db('users')
      .where({ confirm_new_email_token: token })
      .first();
    if (!user) {
      logger.info('Invalid confirm new email link');
      req.flash('error', 'Link zum Ändern der Email-Adresse ungültig!');
      return res.redirect('/');
    }
    if (user.confirm_new_email_token_expires_at < new Date()) {
      logger.info(
        `User <${user.email}> tried to confirm new email, but token is expired`
      );
      req.flash(
        'error',
        'Link zum Ändern der Email-Adresse abgelaufen, bitte erneut ändern!'
      );
      return res.redirect('/');
    }
    await db('users')
      .update({
        email: user.new_email,
        new_email: null,
        confirm_new_email_token: null,
        confirm_new_email_token_expires_at: null
      })
      .where({ user_id: user.user_id });
    req.session.user = await db('users')
      .where({ user_id: user?.user_id })
      .first();
    logger.info(`Email change of <${user.email}> confirmed`);
    req.flash('success', 'Email wurde erfolgreich geändert!');
    return res.redirect('/');
  }
);

router.post(
  '/profile',
  requireAuthenticated,
  async (req: Request, res: Response) => {
    const { first_name, last_name, email } = req.body;
    const firstName = stringToTitleCase(first_name);
    const lastName = stringToTitleCase(last_name);
    const user = req.session.user;

    if (email != user?.email) {
      const randomToken = generateRandomToken();
      await db('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          new_email: email,
          confirm_new_email_token: randomToken,
          confirm_new_email_token_expires_at: new Date(
            new Date().getTime() + 30 * 60000
          )
        })
        .where({ user_id: user?.user_id });

      req.session.user = await db('users')
        .where({ user_id: user?.user_id })
        .first();

      if (!(firstName == user?.first_name && lastName == user?.last_name)) {
        logger.info(
          `User <${user?.email}> has changed their name to ${firstName} ${lastName}`
        );
      }

      try {
        const url = `${process.env.BASE_URL}/confirm-new-email/${randomToken}`;
        await sendEmail(
          email,
          'Bestätigen Sie Ihre neue Email-Adresse',
          craftEmail({
            firstName: firstName,
            lastName: lastName,
            url,
            emailType: EmailType.ConfirmNewEmail
          })
        );
        logger.info(
          `User <${user?.email}> has requested to change their email to <${email}>`
        );
        req.flash(
          'success',
          'Zum Ändern der Email-Adresse bitte Link im Email Postfach klicken!'
        );
        return res.redirect('back');
      } catch (error) {
        logger.error(
          `Error sending email while user <${user?.email}> tried to change email:`,
          error
        );
        req.flash(
          'error',
          'Fehler beim Senden der Bestätigungsemail, bitte Administrator kontaktieren!'
        );
        return res.redirect('back');
      }
    }

    if (firstName == user?.first_name && lastName == user?.last_name) {
      return res.redirect('back');
    }

    await db('users')
      .update({ first_name: firstName, last_name: lastName })
      .where({ user_id: user?.user_id });

    req.session.user = await db('users')
      .where({ user_id: user?.user_id })
      .first();

    logger.info(
      `User <${user?.email}> has changed their name to ${firstName} ${lastName}`
    );
    req.flash('success', 'Profil wurde erfolgreich geändert!');
    return res.redirect('back');
  }
);

router.get(
  '/change-pw',
  requireAuthenticated,
  (req: Request, res: Response) => {
    return res.render('change-pw');
  }
);

router.post(
  '/change-pw',
  requireAuthenticated,
  async (req: Request, res: Response) => {
    const { password, passwordRepeat } = req.body;
    if (!req.session.user) {
      logger.error('Requested change of password, but no user logged in');
      req.flash('error', 'Angemeldeter Nutzer konnte nicht gefunden werden!');
      return res.redirect('change-pw');
    }
    const { user_id, first_name, last_name, email } = req.session.user;
    const passwordsMatch = password === passwordRepeat;

    if (!passwordsMatch) {
      logger.info(
        `User <${email}> tried to change password, but passwords didn't match`
      );
      req.flash('error', 'Passwörter stimmen nicht überein!');
      return res.redirect('/change-pw');
    }

    //Password requires min 8 characters and atleast one number, lower case letter and upper case letter
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const passwordConditions = re.test(password);

    if (!passwordConditions) {
      logger.info(
        `Email <${email}> tried to change password, but password doesn't fulfill criteria`
      );
      req.flash(
        'error',
        'Das Passwort muss mindestens 8 Zeichen lang sein und eine Zahl, einen Kleinbuchstaben und einen Großbuchstaben enthalten!'
      );
      return res.redirect('/change-pw');
    }

    const encryptedPw = await bcrypt.hash(password, 10);
    const randomToken = generateRandomToken();

    await db('users')
      .update({
        new_pw_change: encryptedPw,
        change_pw_token: randomToken,
        change_pw_token_expires_at: new Date(new Date().getTime() + 30 * 60000)
      })
      .where({ user_id });

    req.session.user = await db('users').where({ user_id }).first();

    try {
      const url = `${process.env.BASE_URL}/confirm-change-pw/${randomToken}`;
      await sendEmail(
        email,
        'Bestätigen Sie Ihr neues Passwort',
        craftEmail({
          firstName: first_name,
          lastName: last_name,
          url,
          emailType: EmailType.ConfirmNewPw
        })
      );
      logger.info(
        `Confirm change password email for <${email}> successfully sent`
      );
      req.flash(
        'success',
        'Email zum Ändern des Passworts wurde versendet. Bitte bestätigen Sie den darin enthaltenen Link'
      );
      return res.redirect('/change-pw');
    } catch (error) {
      logger.error(
        `Error sending email while user <${email}> requested password change:`,
        error
      );
      req.flash(
        'error',
        'Fehler beim Senden der Bestätigungsemail, bitte Administrator kontaktieren!'
      );
      return res.redirect('/change-pw');
    }
  }
);

router.get(
  '/confirm-change-pw/:token',
  requireAuthenticated,
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const user = await db('users').where({ change_pw_token: token }).first();
    const sessionUser = req.session.user;

    if (!user) {
      logger.info('Invalid confirm change password link');
      req.flash('error', 'Link zum Ändern des Passworts existiert nicht!');
      return res.redirect('/change-pw');
    }

    if (user.change_pw_token_expires_at < new Date()) {
      logger.info(
        `User <${user.email}> tried to confirm change of password, but token is expired`
      );
      req.flash(
        'error',
        'Link zum Ändern des Passworts abgelaufen, bitte neues Passwort erstellen!'
      );
      return res.redirect('/change-pw');
    }

    if (user.user_id != sessionUser?.user_id) {
      logger.error(
        `User <${user.email}> tried to confirm password change, but user <${sessionUser?.email} is currently logged in>`
      );
    }

    await db('users')
      .update({
        password: user.new_pw_change,
        new_pw_change: null,
        change_pw_token: null,
        change_pw_token_expires_at: null
      })
      .where({ user_id: user.user_id });
    req.session.user = await db('users')
      .where({ user_id: user.user_id })
      .first();
    logger.info(`Password change of <${user.email}> confirmed`);
    req.flash('success', 'Passwort wurde erfolgreich geändert!');
    return res.redirect('/change-pw');
  }
);

router.post(
  '/delete-acc',
  requireAuthenticated,
  async (req: Request, res: Response) => {
    const { password } = req.body;
    const user = req.session.user;
    if (!user) {
      logger.error(
        `User tried to delete their account, but user doesn't exist`
      );
      req.flash('error', 'Löschen fehlgeschlagen. Account nicht gefunden!');
      return res.redirect('back');
    }
    const admins = await db('users').where({ admin: true });
    if (user.admin && admins.length == 1) {
      logger.info(
        `User <${user.email}> tried to delete their account, but is only admin`
      );
      req.flash(
        'error',
        'Löschen nicht möglich, da Sie der einzige Administrator sind!'
      );
      return res.redirect('back');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      logger.info(
        `User <${user.email}> tried to delete their account, but entered wrong password`
      );
      req.flash('error', 'Ungültiges Passwort! Bitte erneut versuchen.');
      return res.redirect('back');
    }
    await db('users')
      .update({ deleted: true })
      .where({ user_id: user.user_id });
    logger.info(`<${user.email}> successfully deleted their account`);
    req.flash('success', 'Account wurde erfolgreich gelöscht!');
    req.session.user = undefined;
    return res.redirect('back');
  }
);

export default router;
