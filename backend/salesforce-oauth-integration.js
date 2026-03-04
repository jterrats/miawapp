/**
 * Salesforce OAuth 2.0 Client Credentials Integration
 *
 * Autenticación con Salesforce usando OAuth 2.0 Client Credentials (server-to-server).
 * NO usa credenciales de usuario (username/password) de Salesforce.
 */

require('dotenv').config();

const jsforce = require('jsforce');

const SALESFORCE_CONFIG = {
  clientId: process.env.SF_CLIENT_ID || '',
  clientSecret: process.env.SF_CLIENT_SECRET || '',
  loginUrl: process.env.SF_LOGIN_URL || 'https://test.salesforce.com',
  tokenEndpoint: process.env.SF_TOKEN_URL || 'https://test.salesforce.com/services/oauth2/token',
  version: '59.0'
};

async function getAccessTokenWithClientCredentials() {
  try {
    const response = await fetch(SALESFORCE_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: SALESFORCE_CONFIG.clientId,
        client_secret: SALESFORCE_CONFIG.clientSecret
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OAuth error: ${error.error} - ${error.error_description}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      instanceUrl: data.instance_url,
      tokenType: data.token_type,
      signature: data.signature,
      issuedAt: data.issued_at
    };
  } catch (error) {
    console.error('❌ Error obtaining access token:', error);
    throw error;
  }
}

async function createAuthenticatedConnection() {
  const { accessToken, instanceUrl } = await getAccessTokenWithClientCredentials();
  const conn = new jsforce.Connection({
    instanceUrl,
    accessToken,
    version: SALESFORCE_CONFIG.version
  });
  console.log('✅ Connected to Salesforce via OAuth Client Credentials');
  console.log(`   Instance: ${instanceUrl}`);
  return conn;
}

/**
 * Busca usuario por email usando OAuth Client Credentials.
 * Busca en Account (PersonAccount), User, Contact y ContactPointEmail.
 */
async function findUserByEmailWithOAuth(email) {
  try {
    const conn = await createAuthenticatedConnection();
    const safeEmail = String(email).replace(/'/g, "\\'");

    const result = await conn.query(`
      SELECT Id, PersonEmail, FirstName, LastName, PersonContactId, PersonMobilePhone, Name
      FROM Account
      WHERE PersonEmail = '${safeEmail}'
      AND IsPersonAccount = true
      LIMIT 1
    `);

    if (result.totalSize > 0) {
      const account = result.records[0];
      return {
        id: account.Id,
        email: account.PersonEmail,
        firstName: account.FirstName,
        lastName: account.LastName,
        phone: account.PersonMobilePhone,
        salesforceContactId: account.PersonContactId,
        accountSource: 'PersonEmail'
      };
    }

    try {
      const userResult = await conn.query(`
        SELECT Id, Email, FirstName, LastName, ContactId
        FROM User
        WHERE Email = '${safeEmail}'
        AND ContactId != null
        AND IsActive = true
        LIMIT 1
      `);
      if (userResult.totalSize > 0) {
        const user = userResult.records[0];
        if (user.ContactId && String(user.ContactId).startsWith('003')) {
          return {
            id: user.Id,
            email: user.Email,
            firstName: user.FirstName,
            lastName: user.LastName,
            phone: null,
            salesforceContactId: user.ContactId,
            accountSource: 'User'
          };
        }
      }
    } catch (userErr) {
      console.warn('⚠️ User query skipped:', userErr.message);
    }

    const contactResult = await conn.query(`
      SELECT Id, Email, FirstName, LastName, MobilePhone, AccountId
      FROM Contact
      WHERE Email = '${safeEmail}'
      LIMIT 1
    `);

    if (contactResult.totalSize > 0) {
      const contact = contactResult.records[0];
      return {
        id: contact.AccountId || contact.Id,
        email: contact.Email,
        firstName: contact.FirstName,
        lastName: contact.LastName,
        phone: contact.MobilePhone,
        salesforceContactId: contact.Id,
        accountSource: 'Contact'
      };
    }

    const cpeResult = await conn.query(`
      SELECT Id, EmailAddress, ParentId
      FROM ContactPointEmail
      WHERE EmailAddress = '${safeEmail}'
      LIMIT 1
    `);

    if (cpeResult.totalSize > 0) {
      const contactPoint = cpeResult.records[0];
      const parentId = contactPoint.ParentId;

      if (parentId && parentId.startsWith('003')) {
        const contactResult2 = await conn.query(`
          SELECT Id, Email, FirstName, LastName, MobilePhone, AccountId
          FROM Contact
          WHERE Id = '${parentId}'
          LIMIT 1
        `);
        if (contactResult2.totalSize > 0) {
          const contact = contactResult2.records[0];
          return {
            id: contact.AccountId || contact.Id,
            email: contact.Email || contactPoint.EmailAddress,
            firstName: contact.FirstName,
            lastName: contact.LastName,
            phone: contact.MobilePhone,
            salesforceContactId: contact.Id,
            accountSource: 'ContactPointEmail'
          };
        }
      }

      const accountResult = await conn.query(`
        SELECT Id, PersonEmail, FirstName, LastName, PersonContactId, PersonMobilePhone
        FROM Account
        WHERE PersonContactId = '${parentId}'
        LIMIT 1
      `);

      if (accountResult.totalSize > 0) {
        const account = accountResult.records[0];
        return {
          id: account.Id,
          email: account.PersonEmail || contactPoint.EmailAddress,
          firstName: account.FirstName,
          lastName: account.LastName,
          phone: account.PersonMobilePhone,
          salesforceContactId: account.PersonContactId,
          accountSource: 'ContactPointEmail'
        };
      }
    }

    return null;
  } catch (error) {
    console.error('❌ Error searching user in Salesforce:', error);
    throw error;
  }
}

module.exports = {
  findUserByEmailWithOAuth,
  createAuthenticatedConnection
};
