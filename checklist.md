# Checklist de Requerimientos - GymTracker

| Requerimiento                                      | Cumple | Comentarios |
|----------------------------------------------------|--------|-------------|
| Login con validación y hashing (bcrypt)            | Sí     | Validación HTML5 + backend (express-validator) |
| Manejo de sesiones con persistencia (SQLiteStore)  | Sí     | Cookie httpOnly, sameSite=lax |
| Conexión a BD SQLite                               | Sí     | gymtracker.sqlite persistente |
| Validación en frontend (HTML5)                     | Sí     | `required`, `minlength` en inputs |
| Validación y sanitización en backend               | Sí     | `express-validator` con `escape()` |
| Protección CSRF (modo cookie)                      | Sí     | `csurf` + cookie-parser |
| Encabezados de seguridad (Helmet)                  | Sí     | X-Frame-Options, etc. |
| Estructura y legibilidad del código                | Sí     | Separación vistas/DB/app |
| Manejo de errores y 404                            | Sí     | Plantilla `error.ejs` |
| Dockerfile y .dockerignore                         | Sí     | Imagen node:18-alpine |
| SAST (SonarQube)                                   | Sí     | `sonar-project.properties` |
| DAST (OWASP ZAP)                                   | Sí     | Scripts de automatización sugeridos |
| Trivy sobre imagen                                 | Sí     | `scripts/trivy_scan.sh` |
