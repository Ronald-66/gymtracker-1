# Reporte Final - Práctica 10 (SAST/DAST) - GymTracker 1.1

## 1. Descripción de la aplicación
GymTracker es una app para gestionar rutinas de ejercicio. Incluye registro/login, sesiones persistentes, validación frontend y backend, protección CSRF (modo cookie) y Helmet.

## 2. Repositorios y enlaces
- **GitHub (código):** _[inserta tu URL]_  
- **Docker Hub (imagen):** _[inserta tu URL]_

## 3. Checklist de seguridad
Ver `checklist.md`.

## 4. SAST (SonarQube)
- Ejecuta `sonar-scanner` con tu token configurado en `sonar-project.properties`.
- Anexa pantallazos / resumen de issues.

## 5. DAST (OWASP ZAP)
- Con la app arriba en `http://localhost:3000`, ejecuta escaneos baseline y full e incluye resultados.

## 6. Trivy
- Escanea la imagen y resume CVEs.

## 7. Ejecución
- **Docker run:** ver README y `scripts/docker_run.sh`.
- **Credenciales demo:** `demo` / `Password123!` (vía `npm run seed`).

## 8. Conclusión
Cumple requisitos mínimos y añade robustez CSRF compartiendo Docker.
