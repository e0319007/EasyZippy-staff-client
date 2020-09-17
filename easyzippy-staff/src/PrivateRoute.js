
import React, {useState} from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
    
    const [login, isLogin] = useState(false)
    
    if (document.cookie.indexOf('authToken') > -1 && document.cookie.indexOf('staffUser') > -1) {
        isLogin(true)
    }

    return (
        <Route
            {...rest}
            render={props =>
                login ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}

export default PrivateRoute;