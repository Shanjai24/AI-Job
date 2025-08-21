import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-biedCrdVVMn1R-XLUMO7fp6T9VOKy_U",
  authDomain: "animal-rescue-4c7d9.firebaseapp.com",
  projectId: "animal-rescue-4c7d9",
  storageBucket: "animal-rescue-4c7d9.firebasestorage.app",
  messagingSenderId: "21549364873",
  appId: "1:21549364873:web:a2197f7513fd88d2637858",
  measurementId: "G-9ZGSHX4N6M"
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const db = app.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
  return auth.signInWithPopup(provider);
};

export default app;