import React, { useState } from 'react';
import getConfig from 'next/config';
import { auth } from '../../lib/firebase.js';
import { toast } from 'react-toastify';

const { publicRuntimeConfig } = getConfig();

function RegisterPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: publicRuntimeConfig.registerRedirectUrl, // e-mail link send to the client e-mail to complete the registration
      handleCodeInApp: true,
    };

    await auth.sendSignInLinkToEmail(email, config);
    toast.success(
      `Email is sent to ${email}. Click the link to complete your registration.`
    );
    // save user email in local storage to complete the registration when the client receives the email in the inbox
    window.localStorage.setItem('emailForRegistration', email);
    // clear state
    setEmail('');
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />

      <button type="submit" className="btn btn-raised">
        Register
      </button>
    </form>
  );
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;