import React, { useRef, useState } from 'react'
import Header from "./Header"
import {checkValidData} from '../utils/validate'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile } from "firebase/auth";

import {auth} from '../utils/firebase'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { NETFLIX_BG, USER_AVATAR } from '../utils/constants';



const Login = () => {
  const [isSignInForm,setIsSignForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null)
  const dispatch = useDispatch()

  const name = useRef(null)
  const email = useRef(null);
  const password = useRef(null);

  const handelButtonClick = ()=>{
    //validate the form data
    const message = checkValidData(email.current.value, password.current.value)
    setErrorMessage(message);

    if(message) return 
      //if there is message meaning there is some error. message is null ie no error
    //crate  a new user ie signIn/signUp
    if(!isSignInForm){
      //signUp logic
      createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
       
        updateProfile(user, {
          displayName: name.current.value, 
          photoURL:USER_AVATAR
          // !kim<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        }).then(() => {

          const {uid, email, displayName, photoURL} = auth.currentUser;
              dispatch(addUser({uid:uid, email:email, displayName:displayName, photoURL:photoURL})) 
          // navigate('/browse')

        }).catch((error) => {
          // An error occurred
          setErrorMessage(error.message)
          // ...
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // console.log(errorCode +"-"+ errorMessage);
        setErrorMessage(errorCode +"-"+ errorMessage)
        // ..
      });

    }else{
      // signIn logic
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // navigate('/browse')  //now we don't need the navigate here because the change auth we take care of it automatically 
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorCode +'-'+ errorMessage);
        setErrorMessage(errorCode +'-'+ errorMessage)
      });

    }
    

  }
  const toggleSignInForm = ()=>{
    setIsSignForm(!isSignInForm)
  }
  return (
    <div>
      <Header />
      <div className='absolute'>
      <img 
      className='h-screen md:h-full object-cover'
      src={NETFLIX_BG}
      alt='bg' />
      </div>
      <form 
      onSubmit={(e) => e.preventDefault()}
      class='w-screen md:w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80'>

      <h1 className='font-bold text-3xl py-4'>
        {isSignInForm? 'SIGN IN' : 'SIGN UP'}</h1>

      {!isSignInForm && <input 
      ref={name}
      type='text' placeholder='Name' class='p-4 my-4 w-full bg-gray-700'/>}
      {/* if not a sign in Form(ie isSignInForm is false) Then show the name input */}

        <input 
        ref={email}
        type='text' placeholder='Email Address' class='p-4 my-4 w-full bg-gray-700'
        />
        <input
        ref={password}
         type='password' placeholder='Password' class='p-4 my-4 w-full bg-gray-700'
         />

         <p className='text-red-500 font-bold text-lg py-4'>{errorMessage}</p>


        <button class='p-4 my-6 w-full bg-red-700 text-white rounded-lg' onClick={handelButtonClick}>{isSignInForm? 'Sign In' : 'Sign Up'}</button>

        <p className='py-4 cursor-pointer' onClick={toggleSignInForm}> 
        {isSignInForm? 'New to Netflix? Sign Up Now' : 'Already registered? Sign In Now'}</p>
      </form>

    </div>
  )
}

export default Login