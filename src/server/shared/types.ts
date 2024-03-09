export type User = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  admin: boolean;
  active: boolean;
  deleted: boolean;
  password: string;
  confirmation_token: string;
  token_expires_at: Date;
  new_pw: string;
  forgot_pw_token: string;
  forgot_pw_token_expires_at: Date;
  new_email: string;
  confirm_new_email_token: string;
  confirm_new_email_token_expires_at: Date;
  new_pw_change: string;
  change_pw_token: string;
  change_pw_token_expires_at: Date;
};

export type CraftEmailInput = {
  firstName: string;
  lastName: string;
  url: string;
  emailType: EmailType;
  actor?: string;
};

export enum EmailType {
  ConfirmRegistration,
  ConfirmNewPw,
  ConfirmNewEmail,
  ForeignEmailChange
}
