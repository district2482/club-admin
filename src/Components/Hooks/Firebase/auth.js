import { useEffect, useState } from 'react'
import firebase from '../../../firebase'

export const useAuthState = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const cancel = firebase.auth().onAuthStateChanged(user => {
            if (user && !user.isAnonymous) {
                user.getIdTokenResult(false)
                    .then(idToken => {
                        // Name is encoded as Base64 due issue with getIdTokenResult and JS base64 encoding handling. As a workaround
                        // backend is now encoding UTF8 names as base64 strings that are properly decoded with introduced helper b64DecodeUnicode.
                        const { name, clubId, membershipType } = idToken.claims
                        setUser({ id: user.id, email: user.uid, name: b64DecodeUnicode(name), clubId, membershipType, isAnonymous: false })
                        setLoading(false)
                    }).catch(err => {
                        console.log('error: ', err)
                        setError(err)
                        setLoading(false)
                    })
            } else {
                firebase.auth().signInAnonymously().then(() => {
                    setUser({ id: "0", email: "", name: "Anonymous", clubId: "", membershipType: 'anynomous', isAnonymous: true })
                    setLoading(false)
                }).catch(err => console.log('error: ', err))
            }
        })
        return () => cancel()
    }, [])

    return {
        loading,
        user,
        error
    }
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')).trim();
}