import React, { useEffect, useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.css';


import HomePage from './Pages/Home/Home';
import Chat from './Pages/Chat/Chat';
import Profile from './Pages/Profile/Profile';
import SignUp from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';

import firebase from './Services/firebase';
import { toast, ToastContainer } from 'react-toastify';



function App() {

  const [authenticated, setAuthenticated] = useState(false); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    firebase.default.auth().onAuthStateChanged(user => {
      console.log('user', user)
      if (user) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    });
  }, []);

  const showToast = (type, message) => {
    switch(type) {
      case 0:
        toast.warning(message);
        break;
      case 1:
        toast.success(message);
        break;
      default:
        break;
    }
  }


  return (
    <div className="App">
    {
      loading === true
      ?
      <div className="spinner-border text-success" role='status'>
        <span className="sr-only">
          Loading...
        </span>
      </div>
      :
      <Router>
    <ToastContainer>
      autoClose = {2000}
      hideProgressBar = {true}
      position = {toast.POSITION.BOTTOM_CENTER}
    </ToastContainer>
    <Switch>
      <Route 
        exact
        path='/'
        render = { props => <HomePage {...props}/>}
      />        

      <Route 
        path='/login'
        render = { props => <Login showToast={showToast}{...props}/>}
      />

      <Route 
        path='/profile'
        render = { props => <Profile showToast={showToast}{...props}/>}
      />

      <Route 
        path='/signup'
        render = { props => <SignUp showToast={showToast}{...props}/>}
      />

      <Route 
        path='/chat'
        render = { props => <Chat showToast={showToast}{...props}/>}
      />        
    </Switch>
    </Router>
    }
    </div>
  )
}

export default App;
