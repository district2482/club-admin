const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt')
const firebase = require('./firebase')

exports.createToken = functions.https.onCall(async (data, context) => {
    const uid = data.email;
    functions.logger.info(`Creating new token for ${data.email}`, { structuredData: true });
    const snapshot = await firebase.firestore()
        .collection("members")
        .where("email", '==', data.email)
        .get()

    if (snapshot.empty) {
        return { status: 'auth_failed' };
    }

    const doc = snapshot.docs[0]
    const user = doc.data()
    const hash = user.bcrypt_pass

    const isSame = await bcrypt.compare(data.password, hash)
    if (!isSame) {
        return { status: 'bad_password' };
    }

    functions.logger.info(`Authenticated user ${user.name}`, { structuredData: true });

    const additionalClaims = {
        membershipType: user.membership_type,
        // Name is encoded as base64 encoded string due JavaScript issue on the Frontend 
        // A tracking issue for the problem is added at: https://github.com/firebase/firebase-js-sdk/issues/4174
        name: Buffer.from(user.name).toString('base64'),
        email: user.email,
        clubId: user.clubId
    };

    return admin.auth()
        .createCustomToken(uid, additionalClaims)
        .then(customToken => {
            functions.logger.info(`Generated token is ${customToken}`, { structuredData: true });
            return { status: 'success', customToken: customToken };
        })
        .catch(error => {
            functions.logger.info(`Something happened buddy: ${error}`)
            return { status: 'error' };
        });
});
