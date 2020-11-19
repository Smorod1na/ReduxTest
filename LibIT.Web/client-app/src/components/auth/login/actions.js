import * as types from './types';
import LoginService from './service';
import { push } from 'connected-react-router';
import setAuthorisationToken from '../../../Utils/setAuthorisationToken'
import jwt from 'jsonwebtoken'

export const loginUser = (model) => {
    return (dispatch) => {
        dispatch({
            type: types.LOGIN_STARTED
        });
        LoginService.loginUser(model)
            .then((response) => {
                // console.log("Server is good", response.data)
                dispatch({
                    type: types.LOGIN_SUCCESS
                });
                LoginByJWT(response.data, dispatch)
                
                dispatch(push('/'));

            }, err => {
                console.log("error: ", err.response);
                dispatch({
                    type: types.LOGIN_FAILED,
                    errors: err.response.data
                });
            })
            .catch(err => {
                console.log("Global server error", err);
            });

    }
}

export const LoginByJWT = (tokens, dispatch) => {
    const {
        token
    } = tokens;
    let user = jwt.decode(token)
    if(!Array.isArray(user.roles))
    {
        user.roles=Array.of(user.roles)
    }
    localStorage.setItem('authToken',token)
    setAuthorisationToken(token)
    dispatch({
        type:types.LOGIN_SET_CURRENT_USER,
        user
    })
    console.log("User login_______",token)
}

export default function LogOff(){
    setAuthorisationToken()
}