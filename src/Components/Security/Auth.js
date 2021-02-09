import { createContext, useState, useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { firestoreAuth } from '../../services'
import { useAuthState } from '../Hooks/Firebase/auth'

const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();

    if (auth.loading) {
        return <div>Loading...</div>
    }

    if (auth.error) {
        return <div>Got internal error</div>
    }

    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}

export function useProvideAuth() {
    const { user, loading, error } = useAuthState()
    const [processing, setProcessing] = useState(false)

    const signin = (email, pass) => {
        setProcessing(true)
        return firestoreAuth.signin(email, pass).then(response => {
            setProcessing(false)
            return Promise.resolve(response)
        }).catch(error => {
            setProcessing(false)
            return Promise.reject(error)
        });
    };

    const signout = (cb) => {
        return firestoreAuth.signout(cb);
    };

    return {
        loading,
        processing,
        error,
        user,
        signin,
        signout
    };
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user && !auth.user.isAnonymous ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}