import './App.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Button from '@mui/material/Button';
import empty_heart from'./static/empty_heart.png';
import selected_heart from './static/selected_heart.png'
import { alignPropType } from 'react-bootstrap/esm/types';
import MainDisplay from './components/MainDisplay';

import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBqQgNHDBP1N6e0MXcaW6Nv2pZG8YQLVwo",
  authDomain: "hci-p4-67fc2.firebaseapp.com",
  databaseURL: "https://hci-p4-67fc2-default-rtdb.firebaseio.com",
  projectId: "hci-p4-67fc2",
  storageBucket: "hci-p4-67fc2.appspot.com",
  messagingSenderId: "141377120349",
  appId: "1:141377120349:web:d921576ebef3c20c2ec5b4",
  measurementId: "G-5KRC5X0DEX"
};



function App() {

  const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);
  const auth = getAuth(app);
  
  

    //get user data
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/firebase.User
    //     const uid = user.uid;
    //     // ...
    //   } else {
    //     // User is signed out
    //     // ...
    //   }
    // });


  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase


  

  const [email, setEmail] = useState('')
  const [pswd, setPswd] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState([])
  
  const handleLogin = () => {
    // console.log(user)
    // console.log(pswd)
    

    signInWithEmailAndPassword(auth, email, pswd)
    .then((userCredential) => {
      // Signed in 
      setUser(userCredential.user['email']);
      console.log(userCredential.user['email'])
      setLoggedIn(true)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });

  }

  return (
      <>
      
          <div className="App">

              
              <h1 className ='title'>Check Air Quality</h1>
              <div className ='subtitle'>check the air quality of cities all over the world</div>
              
                {loggedIn? 
                <MainDisplay currentUser={user}/> :
                <div className='col' id='login-screen'>
                  <form action="/" method="post">
                      <input style={{margin:'9px'}}
                          type="text"
                          id="email-input"
                          placeholder="Enter email"
                          name='email'
                          onChange={(e) => setEmail(e.target.value)}
                          // onChange={(e) => setSearchVal(e.target.value)} //?????? what
                      />
                      {/* <span type='text' onClick={handleSearch}>search</span> */}
                      {/* add functionality: use enter as search?*/}
                  </form>
                  <form action="/" method="post">
                      <input style={{margin:'9px'}}
                          type="text"
                          id="pswd-input"
                          placeholder="Enter password"
                          name='pswd'
                          onChange={(e) => setPswd(e.target.value)}
                          // onChange={(e) => setSearchVal(e.target.value)} //?????? what
                      />
                      {/* <span type='text' onClick={console.log('clicking')}>search</span> */}
                      {/* add functionality: use enter as search?*/}
                  </form>
                  <Button variant="outlined" onClick={handleLogin}>Log in</Button>
            
                </div>
                }
          </div>
      </>
  );
}
  
export default App;