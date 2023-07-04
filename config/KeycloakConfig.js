const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
    KCClientId: process.env.KC_CLIENT_ID,
    KCClientSecret: process.env.KC_CLIENT_SECRET,
    KCIClientId: process.env.KCI_CLIENT_ID,
    KCIClientSecret: process.env.KCI_CLIENT_SECRET,
    KCUrl: process.env.KC_URL
};