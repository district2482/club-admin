const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('./firebase')
const uniqueRandom = require('unique-random');

// Used for random number generation
const random = uniqueRandom(0, 9)

exports.generateVotingCodes = functions.https.onCall(async (data, context) => {
    functions.logger.info(`Voting`, { structuredData: true });
    const db = firebase.firestore()
    const { clubId, pollId } = data

    const poll = await db.doc(`clubs/${clubId}/voting_polls/${pollId}`).get()
    const codes = await db.collection(`clubs/${clubId}/voting_codes`).where('pollId', '==', 'pollId').get()
    if (codes.empty) {
        const count = poll.data().voteMemberCount
        const votingCodes = generateSequence(count).map(it => ({ id: `${pollId}:${it}`, code: it, pollId, usedOn: null }))

        const batch = db.batch();
        votingCodes.forEach(votingCode => {
            const codeRef = db.doc(`clubs/${clubId}/voting_codes/${votingCode.id}`)
            batch.set(codeRef, { code: votingCode.code, usedOn: null, pollId })
        })
        await batch.commit()
        return { status: 'success', votingCodes }
    } else {
        return { status: 'codes_already_generated' }
    }
})



exports.getVotingCodes = functions.https.onCall(async (data, context) => {
    functions.logger.info(`Voting`, { structuredData: true });
    const db = firebase.firestore()
    const { clubId, pollId } = data

    const codes = await db.collection(`clubs/${clubId}/voting_codes`).where('pollId', '==', 'pollId').get()

    return codes.docs.map(doc => {
        return { id: doc.id, code: doc.data().code, pollId: doc.data().pollId }
    })
})

exports.registerVote = functions.https.onCall(async (data, context) => {
    functions.logger.info(`Voting`, { structuredData: true });
    const db = firebase.firestore()
    const { clubId, pollId, pollVotingCode, vote } = data

    const codeRef = db.doc(`clubs/${clubId}/voting_codes/${pollId}:${pollVotingCode}`)
    const voteRef = db.collection(`clubs/${clubId}/votes`).doc()
    try {
        let result = await db.runTransaction(async (t) => {
            const codeDoc = await t.get(codeRef);
            if (!codeDoc.exists) {
                return 'bad_code'
            }

            if (codeDoc.data().usedOn) {
                return 'code_was_already_used'
            }

            await t.update(codeRef, { usedOn: admin.firestore.FieldValue.serverTimestamp() });

            await t.set(voteRef, { pollId, votedOn: admin.firestore.FieldValue.serverTimestamp(), ballot: vote })

            return 'success'
        });
        return { status: result }
    } catch (e) {
        functions.logger.info(`Got internal error: ${e}`);

        return { status: 'server_error' }
    }
})

function generateNumber(digits) {
    var buf = ''
    for (var i = 0; i < digits; i++) {
        buf += random()
    }
    return buf
}

function generateSequence(size) {
    var seq = 0;
    var numbers = []
    var added = {}
    while (seq < size) {
        const number = generateNumber(7)
        if (!added[number]) {
            numbers.push(number)
            seq++
            added[number] = true
        }
    }
    return numbers
}