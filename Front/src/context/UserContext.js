import React from "react";

import jwt_decode from "jwt-decode";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    case "LOGIN_FAILURE":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var token = localStorage.getItem('id_token');
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################
function loginUser (dispatch, login, password, history, setIsLoading, setError){
    setIsLoading(true);
    
      fetch(process.env.REACT_APP_API + 'api-token-auth/',{
        method: 'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            "username": login,
            "password": password
        }) 
    })
    .then(response => response.json())
    .then(data=>{
      console.log('data', data)
      localStorage.setItem('id_token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('enter_time', Date.now());
      localStorage.setItem('name', data.name);
      if(data.token !== undefined) {
        dispatch({ type: 'LOGIN_SUCCESS' })
        history.push('/app/checklist')
      } else {
        setError(true);
        localStorage.removeItem('name');
        localStorage.removeItem("id_token");
        localStorage.removeItem("login");
        localStorage.removeItem("role");
        localStorage.removeItem("enter_time");
        //dispatch({ type: "LOGIN_FAILURE" });
      }
    })
      setIsLoading(false)
    };


function signOut(dispatch, history) {
  localStorage.removeItem('name');
  localStorage.removeItem("id_token");
  localStorage.removeItem("login");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
