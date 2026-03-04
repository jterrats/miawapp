/**
 * Generación de JWT para User Verification (Salesforce MIAW).
 * Idéntico a salesforce-messaging-auth/server-with-rsa.js
 *
 * Payload: iss, sub, iat, email, firstName, lastName, accountId
 * Header: alg=RS256, kid=grg-key-1
 */
const jwt = require('jsonwebtoken');

const JWT_ISSUER = process.env.JWT_ISSUER || 'GrgMessagingServer';

function createVerificationToken(user, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    {
      iss: JWT_ISSUER,
      sub: user.salesforceContactId,
      iat: now,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accountId: user.id
    },
    privateKey,
    {
      algorithm: 'RS256',
      expiresIn: '24h',
      keyid: 'grg-key-1'
    }
  );
}

module.exports = { createVerificationToken, JWT_ISSUER };
