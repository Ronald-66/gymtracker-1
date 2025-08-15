
// seed.js
const bcrypt = require('bcrypt');
const db = require('./database');

(async () => {
  try {
    const username = process.env.SEED_USER || 'demo';
    const password = process.env.SEED_PASS || 'Password123!';
    const hashed = await bcrypt.hash(password, 10);
    await db.createUser(username, hashed);
    console.log(`Usuario de prueba -> ${username} / ${password}`);
    process.exit(0);
  } catch (e) {
    if (String(e).includes('SQLITE_CONSTRAINT')) {
      console.log('Usuario de prueba ya existe.');
      process.exit(0);
    }
    console.error(e);
    process.exit(1);
  }
})();
