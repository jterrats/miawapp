# Debug Send Failed - MIAW

## Hallazgo: Si NO ves logs de SFMiaw_UserVerify

Si `userVerificationChallenge` nunca se llama, el SDK no está pidiendo el JWT. Posibles causas:
- El deployment SC_PandaExpressMobile podría no requerir User Verification en Salesforce
- O el provider no está asociado al CoreClient que usa la conversación

## 1. Ver logs de Android (logcat)

Con el emulador o dispositivo conectado:

```bash
adb logcat -s SFMiawManager:* SFMiaw_UserVerify:* SFMiawPlugin:*
```

O más amplio para ver todo el plugin y SDK:

```bash
adb logcat | grep -E "SFMiaw|UserVerify|salesforce|SMI"
```

**Qué buscar:**
- `userVerificationChallenge called` → El SDK pidió JWT
- `Fetching JWT from:` → URL que usa el plugin (debe ser accesible desde el dispositivo)
- `Backend response code: 200` → Backend respondió OK
- `Backend error:` → Falló la petición al backend
- `fetchJWTFromBackend failed` → Error al obtener el token

## 2. Ver logs del backend

En la terminal donde corre `npm run backend` verás:

- `[DEBUG] /api/mobile/auth/verify called, email: xxx` → El plugin llamó al endpoint
- `[DEBUG] /api/mobile/auth/verify: generating JWT for` → Se generó el token
- `[DEBUG] /api/mobile/auth/verify error:` → Error en el backend

**Si NO aparece ninguna llamada** cuando intentas enviar un mensaje → El plugin no puede alcanzar el backend (URL incorrecta o red).

## 3. Verificar URL del backend

En emulador Android: `http://10.0.2.2:3000`
En dispositivo físico: usa la IP de tu máquina (ej: `http://192.168.1.X:3000`)

La URL se pasa en `Miaw.setBackendUrl()` desde `environment.apiUrl`.

## 4. Probar el endpoint manualmente

```bash
curl -X POST http://10.0.2.2:3000/api/mobile/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"jterrats@salesforce.com"}'
```

Debe devolver `verificationToken` y `user`.

## 5. Probar sin User Verification

En `configFile.json` pon `"UserVerificationRequired": false`, entra como guest y prueba enviar. Si funciona, el problema está en User Verification (JWT, Keyset o ContactId).
