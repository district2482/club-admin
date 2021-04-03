const functions = require('firebase-functions');
const firebase = require('./firebase')

const SENDGRID_API_KEY = functions.config().sendgrid.key
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendEmail = functions
    .firestore.document('messages/{messageId}')
    .onCreate((snap, context) => {
        const messageId = context.params.messageId
        return firebase.firestore().collection('messages').doc(messageId).get().then(doc => {
            const message = doc.data()
            const msg = {
                to: message.to,
                from: 'd2482@apps.clouway.com',
                templateId: 'd-9c8d41fa836a4d21a4d15e81bb09865f',
                dynamicTemplateData: {
                    subject: 'Testing Templates',
                    name: 'John Smith',
                },
            };
            return sgMail.send(msg)
        })
            .then(() => console.log('success'))
            .catch(err => console.log(err))
    })