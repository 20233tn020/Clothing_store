import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import './SocialLogin.css';

const SocialLogin = () => {
      // Google
  const handleGoogleSuccess = (response) => {
    console.log('Google Success:', response);
    sendTokenToBackend('google', response.credential);
  };
  const handleGoogleError = () => {
    alert('Error al iniciar sesión con Google');
  };

   // Facebook
  const handleFacebookResponse = (response) => {
    console.log('Facebook Success:', response);
    if (response.accessToken) {
      sendTokenToBackend('facebook', response.accessToken);
    } else {
      alert('Error al iniciar sesión con Facebook');
    }
  };
  return (
    <div>
      
    </div>
  )
}

export default SocialLogin
