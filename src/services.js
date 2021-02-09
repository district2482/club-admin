import firebase from './firebase'

const createTokenCall = firebase.functions().httpsCallable('createToken');
const registerVote = firebase.functions().httpsCallable("registerVote");
const generateVotingCodes = firebase.functions().httpsCallable('generateVotingCodes')

export const firestoreAuth = {

    signin: (email, password) => {
        return createTokenCall({ email, password }).then(response => {
            const { status, customToken } = response.data
            if (status === 'success') {
                return firebase.auth().signInWithCustomToken(customToken).then(response => {
                    return Promise.resolve({ status: 'success' })
                })
            } else {
                return Promise.reject({ status })
            }
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    signout: cb => {
        firebase.auth().signOut().then(response => {
            cb()
        })
    }
}

export const polls = {
    vote: (clubId, pollId, pollVotingCode, vote) => {
        return registerVote({ clubId, pollId, pollVotingCode, vote })
    },
    generateVotingCodes: (clubId, pollId) => {
        return generateVotingCodes({ clubId, pollId })
    }
}
