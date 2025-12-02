import crypto from 'crypto';

const getTokenSalt = () => process.env.ADMIN_TOKEN_SALT || 'ki-vergabe-admin-token';

export const createAdminTokenFromPassword = (password: string) => {
  return crypto
    .createHash('sha256')
    .update(password + getTokenSalt())
    .digest('hex');
};

export const getExpectedAdminToken = () => {
  const password = process.env.ADMIN_PASSWORD || 'Meryem';
  return createAdminTokenFromPassword(password);
};

