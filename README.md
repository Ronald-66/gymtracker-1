# GymTracker 1.1 (CSRF robusto para compartir Docker)

## Local
```bash
npm install
npm run seed
npm start
# http://localhost:3000
```

## Docker
```bash
docker build -t gymtracker:1.1 .
docker run -d -p 3000:3000 \
  -e SESSION_SECRET="cambia_esto" \
  -e COOKIE_SECRET="cambia_esto_tambien" \
  --name gymtracker_container gymtracker:1.1
```

## SAST/DAST/Trivy
- SonarQube: configura token en `sonar-project.properties` y corre `sonar-scanner`.
- ZAP: ejecuta escaneos con la app arriba.
- Trivy: `bash scripts/trivy_scan.sh`.

## Solución al 403 (CSRF) al compartir Docker
Si ves `403 Forbidden (EBADCSRFTOKEN)` en otra máquina:
1. Usa esta versión 1.1 (CSRF por cookie).
2. Inicia con variables de entorno para secretos (arriba).
3. Accede con la misma URL/host para GET y POST (no mezcles `127.0.0.1`, `localhost` e IP).
4. Si usas HTTPS tras proxy, activa `secure: true` en cookies de sesión y CSRF y deja `app.set('trust proxy', 1)`.
5. Para peticiones AJAX, incluye el token en header `CSRF-Token` o en el body como `_csrf`.
