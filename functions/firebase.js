const functions = require('firebase-functions');
const admin = require('firebase-admin');

const base64EncodedKey = functions.config().firestore.key
let serviceAccount = Buffer.from(base64EncodedKey, 'base64').toString('ascii')

// The service account may contain '\n' or '\r\n' that breaks JSON.parse call. This escapes prevent
// this and ensures that key will be safely parsed.
serviceAccount = serviceAccount.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")

const firebase = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
    databaseURL: 'https://rotary-d2482.firebaseio.com/'
});

module.exports = firebase