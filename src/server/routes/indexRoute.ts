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

const router = Router();

const requireAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user?.user_id) {
    return res.redirect('back');
  } else {
    return next();
  }
};

router.get('/', (req: Request, res: Response) => {
  res.render('index');
});

router.post('/logout', requireAuthenticated, (req: Request, res: Response) => {
  delete req.session.user;
  res.redirect('back');
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

export default router;
