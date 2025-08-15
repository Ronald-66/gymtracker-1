
// app.js (patched for robust CSRF across machines / Docker)
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy trust (si usas nginx/traefik u otro reverse proxy)
app.set('trust proxy', 1);

// Seguridad con Helmet
app.use(helmet());

// Body parsing
app.use(express.urlencoded({ extended: false }));

// Cookie parser (requerido para csurf en modo cookie)
app.use(cookieParser(process.env.COOKIE_SECRET || 'gt_cookie_secret'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sesiones (SQLiteStore persistente)
app.use(session({
  name: 'gt.sid',
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: __dirname }),
  secret: process.env.SESSION_SECRET || 'clave_super_segura_gymtracker',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    sameSite: 'lax',
    // secure: true  // habilitar si sirves por HTTPS
  }
}));

// CSRF en modo cookie (más estable compartiendo Docker)
app.use(csurf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    sameSite: 'lax',
    secure: false // pon true si vas por HTTPS
  }
}));

// Variables comunes a vistas
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.session = req.session;
  next();
});

// Auth guard
function authRequired(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

// Rutas
app.get('/', (req, res) => res.redirect('/login'));

// Registro
app.get('/register', (req, res) => res.render('register', { errors: [] }));

app.post('/register',
  body('username').trim().isLength({ min: 3 }).withMessage('Usuario mínimo 3 caracteres').escape(),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínima 6 caracteres'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', { errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      const exists = await db.getUser(username);
      if (exists) return res.status(400).render('register', { errors: [{ msg: 'Usuario ya existe' }] });
      const hashed = await bcrypt.hash(password, 10);
      await db.createUser(username, hashed);
      res.redirect('/login');
    } catch (e) {
      console.error(e);
      res.status(500).render('error', { message: 'Error en el servidor' });
    }
  }
);

// Login
app.get('/login', (req, res) => res.render('login', { errors: [] }));

app.post('/login',
  body('username').trim().notEmpty().withMessage('Usuario requerido').escape(),
  body('password').notEmpty().withMessage('Contraseña requerida'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).render('login', { errors: errors.array() });
    const { username, password } = req.body;
    try {
      const user = await db.getUser(username);
      if (!user) return res.status(400).render('login', { errors: [{ msg: 'Credenciales inválidas' }] });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).render('login', { errors: [{ msg: 'Credenciales inválidas' }] });
      req.session.userId = user.id;
      req.session.username = user.username;
      res.redirect('/dashboard');
    } catch (e) {
      console.error(e);
      res.status(500).render('error', { message: 'Error en el servidor' });
    }
  }
);

// Dashboard
app.get('/dashboard', authRequired, async (req, res) => {
  try {
    const routines = await db.getRoutines(req.session.userId);
    res.render('dashboard', { routines, username: req.session.username });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', { message: 'Error al cargar el dashboard' });
  }
});

// Crear rutina
app.post('/routines', authRequired,
  body('title').trim().isLength({ min: 1 }).withMessage('Título requerido').escape(),
  body('description').trim().isLength({ min: 1 }).withMessage('Descripción requerida').escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).render('error', { message: 'Datos inválidos para la rutina' });
    try {
      await db.createRoutine(req.session.userId, req.body.title, req.body.description);
      res.redirect('/dashboard');
    } catch (e) {
      console.error(e);
      res.status(500).render('error', { message: 'No se pudo crear la rutina' });
    }
  }
);

// Logout
app.post('/logout', authRequired, (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// Manejo de error CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).render('error', { message: 'CSRF inválido o caducado. Recarga la página e inténtalo de nuevo.' });
  }
  next(err);
});

// 404
app.use((req, res) => res.status(404).render('error', { message: 'Recurso no encontrado' }));

// Start
app.listen(PORT, () => {
  console.log(`GymTracker (patched) en http://localhost:${PORT}`);
});
