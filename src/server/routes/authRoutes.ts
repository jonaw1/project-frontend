import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/database';
import bcrypt from 'bcrypt';
import { EmailType, User } from '../shared/types';
import logger from '../shared/logger';
import {
  craftEmail,
  generateRandomToken,
  stringToTitleCase
} from '../shared/utils';
import sendEmail from '../shared/email';

declare module 'express-session' {
  interface SessionData {
    user?: User;
  }
}

const router = Router();

const requireNotAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user?.user_id) {
    return res.redirect('/');
  } else {
    return next();
  }
};

router.get('/login', requireNotAuthenticated, (req: Request, res: Response) => {
  res.render('login');
});

router.get(
  '/register',
  requireNotAuthenticated,
  (req: Request, res: Response) => {
    res.render('register');
  }
);

router.post(
  '/login',
  requireNotAuthenticated,
  async (req: Request, res: Response) => {
    const { email, password, stayLoggedIn } = req.body;

    const inactiveUser = await db('users')
      .where({ email, active: false })
      .first();
    if (!!inactiveUser) {
      logger.info(
        `User <${inactiveUser.email}> tried to log in, but didn't confirm yet`
      );
      req.flash('error', 'Bitte zunächst Email-Adresse bestätigen!');
      return res.redirect('/login');
    }

    const user = await db('users').where({ email, active: true }).first();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash('error', 'Ungültige Email oder Passwort!');
      logger.info(`Email <${email}> tried to log in with invalid credentials`);
      return res.redirect('/login');
    }

    req.session.user = user;

    if (stayLoggedIn) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }

    logger.info(`User <${email}> logged in successfully`);
    req.flash('success', 'Anmeldung erfolgreich!');
    res.redirect('/');
  }
);

router.post(
  '/register',
  requireNotAuthenticated,
  async (req: Request, res: Response) => {
    const { email, firstName, lastName, password, passwordRepeat } = req.body;
    const fName = stringToTitleCase(firstName);
    const lName = stringToTitleCase(lastName);

    const emailAlreadyRegistered = await db('users')
      .select()
      .where({ email, active: true })
      .then((rows) => {
        return rows.length !== 0;
      });

    if (emailAlreadyRegistered) {
      logger.info(
        `Email <${email}> tried to register, but is already registered`
      );
      req.flash('error', 'Email ist bereits registriert!');
      return res.redirect('/register');
    }

    const user = await db('users')
      .select()
      .where({ email })
      .then((rows) => {
        return rows[0] ?? null;
      });

    if (!user) {
      logger.info(`Email <${email}> tried to register, but is not allowed to`);
      req.flash('error', 'Email ist nicht zur Registrierung freigegeben!');
      return res.redirect('/register');
    }

    const passwordsMatch = password === passwordRepeat;

    if (!passwordsMatch) {
      logger.info(
        `Email <${email}> tried to register, but passwords didn't match`
      );
      req.flash('error', 'Passwörter stimmen nicht überein!');
      return res.redirect('/register');
    }

    //Password requires min 8 characters and atleast one number, lower case letter and upper case letter
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const passwordConditions = re.test(password);

    if (!passwordConditions) {
      logger.info(
        `Email <${email}> tried to register, but password doesn't fulfill criteria`
      );
      req.flash(
        'error',
        'Das Passwort muss mindestens 8 Zeichen lang sein und eine Zahl, einen Kleinbuchstaben und einen Großbuchstaben enthalten!'
      );
      return res.redirect('/register');
    }

    const encryptedPw = await bcrypt.hash(password, 10);
    const randomToken = generateRandomToken();

    await db('users')
      .update({
        password: encryptedPw,
        first_name: fName,
        last_name: lName,
        confirmation_token: randomToken,
        token_expires_at: new Date(new Date().getTime() + 30 * 60000)
      })
      .where({ email });

    try {
      const url = `${process.env.BASE_URL}/confirm/${randomToken}`;
      await sendEmail(
        user.email,
        'Herzlich willkommen! Bestätigen Sie Ihre Registrierung',
        craftEmail({
          firstName: fName,
          lastName: lName,
          url,
          emailType: EmailType.ConfirmRegistration
        })
      );
      logger.info(`Confirmation email for <${user.email}> sent successfully`);
      req.flash(
        'success',
        'Registrierung erfolgreich. Bitte zum Bestätigen Link in der Email anklicken!'
      );
      return res.redirect('/login');
    } catch (error) {
      logger.error(
        `Error sending email while user <${user.email}> tried to register:`,
        error
      );
      req.flash(
        'error',
        'Fehler beim Senden der Bestätigungsemail, bitte Administrator kontaktieren!'
      );
      return res.redirect('/register');
    }
  }
);

router.get(
  '/confirm/:token',
  requireNotAuthenticated,
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const user = await db('users').where({ confirmation_token: token }).first();
    if (!user) {
      logger.info('Invalid registration link');
      req.flash('error', 'Registrierungslink existiert nicht!');
      return res.redirect('/register');
    }
    if (user.active == true) {
      logger.info(
        `User <${user.email}> tried to confirm but is already registered`
      );
      req.flash('success', 'Registrierung bereits bestätigt. Bitte anmelden!');
      return res.redirect('/login');
    }
    if (user.token_expires_at < new Date()) {
      logger.info(
        `User <${user.email}> tried to confirm registration, but token is expired`
      );
      req.flash(
        'error',
        'Registrierungslink abgelaufen, bitte erneut registrieren!'
      );
      return res.redirect('/register');
    }
    await db('users')
      .update({
        active: true
      })
      .where({ user_id: user.user_id });
    logger.info(`Registration of <${user.email}> confirmed`);
    req.flash('success', 'Registrierung abgeschlossen. Bitte anmelden!');
    return res.redirect('/login');
  }
);

router.get(
  '/confirm-new-pw/:token',
  requireNotAuthenticated,
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const user = await db('users').where({ forgot_pw_token: token }).first();
    if (!user) {
      logger.info('Invalid confirm new password link');
      req.flash('error', 'Link zum Ändern des Passworts existiert nicht!');
      return res.redirect('/forgot-pw');
    }
    if (user.forgot_pw_token_expires_at < new Date()) {
      logger.info(
        `User <${user.email}> tried to confirm new password, but token is expired`
      );
      req.flash(
        'error',
        'Link zum Ändern des Passworts abgelaufen, bitte neues Passwort erstellen!'
      );
      return res.redirect('/forgot-pw');
    }
    await db('users')
      .update({
        password: user.new_pw,
        new_pw: null,
        forgot_pw_token: null,
        forgot_pw_token_expires_at: null
      })
      .where({ user_id: user.user_id });
    req.session.user = await db('users')
      .where({ user_id: user.user_id })
      .first();
    logger.info(`New password of <${user.email}> confirmed`);
    req.flash(
      'success',
      'Passwort wurde erfolgreich geändert. Bitte anmelden!'
    );
    return res.redirect('/login');
  }
);

router.get(
  '/forgot-pw',
  requireNotAuthenticated,
  (req: Request, res: Response) => {
    res.render('forgot-pw');
  }
);

router.post(
  '/forgot-pw',
  requireNotAuthenticated,
  async (req: Request, res: Response) => {
    const { email, password, passwordRepeat } = req.body;
    const user = await db('users').where({ email, active: true }).first();
    if (!user) {
      logger.info(
        `Email <${email}> requested password change, but is not registered`
      );
      req.flash('error', 'Email ist nicht registriert!');
      return res.redirect('/forgot-pw');
    }

    const passwordsMatch = password === passwordRepeat;

    if (!passwordsMatch) {
      logger.info(
        `Email <${email}> tried to request new password, but passwords didn't match`
      );
      req.flash('error', 'Passwörter stimmen nicht überein!');
      return res.redirect('/forgot-pw');
    }

    //Password requires min 8 characters and atleast one number, lower case letter and upper case letter
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const passwordConditions = re.test(password);

    if (!passwordConditions) {
      logger.info(
        `Email <${email}> tried to request new password, but password doesn't fulfill criteria`
      );
      req.flash(
        'error',
        'Das Passwort muss mindestens 8 Zeichen lang sein und eine Zahl, einen Kleinbuchstaben und einen Großbuchstaben enthalten!'
      );
      return res.redirect('/forgot-pw');
    }

    if (await bcrypt.compare(password, user.password)) {
      logger.info(
        `Email <${email}> tried to request new password, but used previous password`
      );
      req.flash(
        'error',
        'Das neue Passwort muss sich vom vorherigen Passwort unterscheiden!'
      );
      return res.redirect('/forgot-pw');
    }

    const encryptedPw = await bcrypt.hash(password, 10);
    const randomToken = generateRandomToken();
    await db('users')
      .update({
        new_pw: encryptedPw,
        forgot_pw_token: randomToken,
        forgot_pw_token_expires_at: new Date(new Date().getTime() + 30 * 60000)
      })
      .where({ email });
    try {
      const url = `${process.env.BASE_URL}/confirm-new-pw/${randomToken}`;
      await sendEmail(
        email,
        'Bestätigen Sie Ihr neues Passwort',
        craftEmail({
          firstName: user.first_name,
          lastName: user.last_name,
          url,
          emailType: EmailType.ConfirmNewPw
        })
      );
      logger.info(
        `Confirm new password email for <${email}> successfully sent`
      );
      req.flash(
        'success',
        'Email zum Ändern des Passworts wurde versendet. Bitte bestätigen Sie den darin enthaltenen Link'
      );
      return res.redirect('/login');
    } catch (error) {
      logger.error(
        `Error sending email while user <${email}> requested new password:`,
        error
      );
      req.flash(
        'error',
        'Fehler beim Senden der Bestätigungsemail, bitte Administrator kontaktieren!'
      );
      return res.redirect('/forgot-pw');
    }
  }
);

export default router;
