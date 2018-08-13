// ==========================
// Port
// ==========================

process.env.PORT = process.env.PORT || 3000;

// ==========================
// Environment
// ==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Expiration Time
// ==========================

process.env.EXPIRATION_TIME = 60 * 60 * 24 * 30;

// ==========================
// Secret Seed
// ==========================

process.env.SECRET_SEED = process.env.SECRET_SEED || 'este-es-el-seed';

// ==========================
// DB
// ==========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

// ==========================
// Google Client ID 
// ==========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '677148295331-vipm62tedahbc05puvcbap1g5gf7sddq.apps.googleusercontent.com';

// Client Secret
// Bj_SAOqPgOVvfv8OD-suJ5pY

process.env.URLDB = urlDB;