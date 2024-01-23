import { randomBytes } from 'crypto';
import { EmailType, CraftEmailInput } from './types';

export const stringToTitleCase = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
    .replace(/\s+/g, ' ');
};

export const generateRandomToken = (length: number = 32): string => {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

const craftConfirmRegistrationEmail = ({
  firstName,
  lastName,
  url
}: CraftEmailInput): string => {
  const appName = process.env.APP_NAME;
  return `
    Hallo ${firstName} ${lastName},\n
    Vielen Dank für die Registrierung bei ${appName}.\n
    Um Ihre Registrierung abzuschließen und Ihre Email-Adresse zu bestätigen, klicken Sie bitte auf den folgenden Link:\n
    ${url}\n
    Dieser Registrierungslink ist 30 Minuten lang gültig. Sind bereits mehr als 30 Minuten vergangen, registrieren Sie sich bitte erneut.\n
    Wenn Sie sich nicht bei uns registriert haben, ignorieren Sie bitte diese Email.\n
    Vielen Dank,
    Das ${appName} Team
  `;
};

const craftConfirmNewEmailEmail = ({
  firstName,
  lastName,
  url
}: CraftEmailInput): string => {
  return `
    Hallo ${firstName} ${lastName},\n
    Sie haben eine Änderung Ihrer Email-Adresse angefragt.\n
    Um die Änderung Ihrer Email-Adresse zu bestätigen, klicken Sie bitte auf den folgenden Link:\n
    ${url}\n
    Dieser Link ist 30 Minuten lang gültig. Sind bereits mehr als 30 Minuten vergangen, ändern sie Ihre Email bitte erneut.\n
    Wenn Sie keine Änderung Ihrer Email-Adresse angefragt haben, ignorieren Sie bitte diese Nachricht.\n
    Vielen Dank,
    Das ${process.env.APP_NAME} Team
`;
};

const craftConfirmNewPwEmail = ({
  firstName,
  lastName,
  url
}: CraftEmailInput): string => {
  return `
    Hallo ${firstName} ${lastName},\n
    Sie haben eine Änderung Ihres Passwortes angefragt.\n
    Um die Änderung Ihres Passwortes zu bestätigen, klicken Sie bitte auf den folgenden Link:\n
    ${url}\n
    Dieser Link ist 30 Minuten lang gültig. Sind bereits mehr als 30 Minuten vergangen, erstellen Sie bitte ein neues Passwort.\n
    Wenn Sie keine Änderung Ihres Passwortes angefragt haben, ignorieren Sie bitte diese Email.\n
    Vielen Dank,
    Das ${process.env.APP_NAME} Team
  `;
};

export const craftEmail = (input: CraftEmailInput): string => {
  switch (input.emailType) {
    case EmailType.ConfirmRegistration:
      return craftConfirmRegistrationEmail(input);
    case EmailType.ConfirmNewPw:
      return craftConfirmNewPwEmail(input);
    case EmailType.ConfirmNewEmail:
      return craftConfirmNewEmailEmail(input);
    default:
      throw new Error(`Unsupported email type: ${input.emailType}`);
  }
};
