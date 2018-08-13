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

process.env.URLDB = urlDB;