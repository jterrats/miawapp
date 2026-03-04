/**
 * Backend para miawapp - igual que salesforce-messaging-auth
 *
 * Login por email usando OAuth Client Credentials (NO credenciales de Salesforce).
 * Genera JWT RSA para User Verification (MIAW).
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// RSA keys para User Verification (Salesforce)
const keysPath = path.join(__dirname);
const privateKeyPath = path.join(keysPath, 'private-key.pem');
const publicKeyPath = path.join(keysPath, 'public-key.pem');

let PRIVATE_KEY;
let PUBLIC_KEY;

try {
  PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');
  PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');
} catch (err) {
  console.error('❌ RSA keys not found. Run: cd backend && npm run generate-keys');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

const { findUserByEmailWithOAuth } = require('./salesforce-oauth-integration');
const { createVerificationToken } = require('./jwt-verification-helper');

/**
 * POST /api/auth/login
 * Login por email - busca usuario en Salesforce vía OAuth Client Credentials.
 * Devuelve verificationToken (JWT RSA) y sessionToken.
 */
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email requerido' });
  }

  try {
    const user = await findUserByEmailWithOAuth(email.toLowerCase().trim());

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Email no encontrado en nuestro sistema'
      });
    }

    if (!user.salesforceContactId || !user.salesforceContactId.startsWith('003')) {
      return res.status(500).json({
        success: false,
        error: 'ContactId no disponible para este usuario'
      });
    }

    const verificationToken = createVerificationToken(user, PRIVATE_KEY);

    const sessionToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        salesforceContactId: user.salesforceContactId,
        accountSource: user.accountSource
      },
      PRIVATE_KEY,
      { algorithm: 'RS256', expiresIn: '24h' }
    );

    res.json({
      success: true,
      verificationToken,
      sessionToken,
      user
    });

    console.log(`✅ User ${user.firstName} ${user.lastName} (${email}) logged in via OAuth`);
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la autenticación',
      ...(process.env.NODE_ENV !== 'production' && { details: error.message })
    });
  }
});

/**
 * POST /api/mobile/auth/verify
 * Endpoint para el plugin MIAW - obtiene JWT por email.
 */
app.post('/api/mobile/auth/verify', async (req, res) => {
  const { email } = req.body;
  console.log('[DEBUG] /api/mobile/auth/verify called, email:', email);

  if (!email) {
    console.log('[DEBUG] /api/mobile/auth/verify: missing email');
    return res.status(400).json({ success: false, error: 'Email required' });
  }

  try {
    const user = await findUserByEmailWithOAuth(email.toLowerCase().trim());

    if (!user) {
      console.log('[DEBUG] /api/mobile/auth/verify: user not found');
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!user.salesforceContactId || !user.salesforceContactId.startsWith('003')) {
      console.log('[DEBUG] /api/mobile/auth/verify: invalid ContactId', user.salesforceContactId);
      return res.status(500).json({ success: false, error: 'Invalid ContactId for user' });
    }

    console.log('[DEBUG] /api/mobile/auth/verify: generating JWT for', user.email, 'ContactId:', user.salesforceContactId);
    const verificationToken = createVerificationToken(user, PRIVATE_KEY);
    console.log('[DEBUG] /api/mobile/auth/verify: JWT generated successfully');
    res.json({
      success: true,
      verificationToken,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('[DEBUG] /api/mobile/auth/verify error:', error);
    res.status(500).json({ success: false, error: 'Error generating token' });
  }
});

/**
 * POST /api/auth/verify
 * Verifica validez del JWT.
 */
app.post('/api/auth/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    res.json({ success: true, user: decoded, message: 'Token válido' });
  } catch (error) {
    res.status(403).json({ success: false, error: 'Token inválido o expirado' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token de autenticación requerido' });
  }

  jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

app.get('/api/auth/public-key', (req, res) => {
  const crypto = require('crypto');
  const publicKeyObject = crypto.createPublicKey(PUBLIC_KEY);
  const jwk = publicKeyObject.export({ format: 'jwk' });
  jwk.kid = 'grg-key-1';
  jwk.use = 'sig';
  jwk.alg = 'RS256';
  res.json({ keys: [jwk] });
});

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════════╗
  ║  🚀 miawapp Backend (igual que salesforce-messaging-auth) ║
  ║  📍 URL: http://localhost:${PORT}                            ║
  ║  🔐 OAuth Client Credentials (sin credenciales SF)         ║
  ║  💬 User Verification: RSA-256 JWT                         ║
  ╚════════════════════════════════════════════════════════════╝
  `);
});
