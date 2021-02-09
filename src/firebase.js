import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/functions'
import 'firebase/firestore'

const app = firebase.initializeApp({
    apiKey: "AIzaSyAovC3LbEHRGhtP6JBlrtp2LxyXbp69l_g",
    authDomain: "rotary-d2482.firebaseapp.com",
    projectId: "rotary-d2482",
});


export default app