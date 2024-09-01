const crypto = require('crypto');

// Generate a strong secret key
const secret = crypto.randomBytes(64).toString('hex');

// Output the secret key
console.log(secret);
