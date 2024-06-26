// src/services/AuthService.ts
import { User, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/Firebase';

export const signInUser = async (): Promise<void> => {
  try {
    const { user } = await signInAnonymously(auth);
    if (user) {
      await updateUserData(user.uid);
    }
  } catch (error) {
    console.error('익명으로 로그인하는 중 오류 발생:', error);
  }
};

export const updateUserData = async (userId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        last_access: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        last_access: serverTimestamp(),
        created_at: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('사용자 데이터 업데이트 중 오류 발생:', error);
  }
};

export const listenToAuthChanges = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
