// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

const signInUser = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error('Error signing in anonymously:', error);
  }
};

const saveSalaries = async (userId: string, salaries: string[]) => {
  try {
    await setDoc(doc(db, 'users', userId), { salaries });
  } catch (error) {
    console.error('Error saving salaries:', error);
  }
};

const loadSalaries = async (userId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data().salaries;
    } else {
      console.log('No such document!');
      return [];
    }
  } catch (error) {
    console.error('Error loading salaries:', error);
    return [];
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User ID:', user.uid);
  } else {
    signInUser();
  }
});

export {
  app,
  messaging,
  analytics,
  auth,
  db,
  saveSalaries,
  loadSalaries,
  signInUser,
};
