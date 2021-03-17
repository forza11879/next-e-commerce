import firebase from 'firebase/app';
import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_API_KEY,
  authDomain: 'ecommerce-2094e.firebaseapp.com',
  projectId: 'ecommerce-2094e',
  storageBucket: 'ecommerce-2094e.appspot.com',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_APP_ID,
};

// you can only initialize the firebase once but in some cases Next.js will try to run the code in this file twice. It is just the way things work in development. If the initializeApp method calls for an already existing project it will throw an error. We can avoid it by wrapping it up into a condition to check the apps.length and it will only initialize the app if the length is zero.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
