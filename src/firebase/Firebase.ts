// src/firebase/Firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

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
    const { user } = await signInAnonymously(auth);
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          created_at: serverTimestamp(),
        });
      }
      await updateDoc(docRef, {
        last_access: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('익명으로 로그인하는 중 오류 발생:', error);
  }
};

const updateLastAccess = async (userId: string) => {
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
        created_at: serverTimestamp(), // 최초 생성시 created_at 필드도 추가
      });
    }
  } catch (error) {
    console.error('마지막 접속 시간을 업데이트하는 중 오류 발생:', error);
  }
};

const saveSalaries = async (userId: string, salaries: string[]) => {
  try {
    await setDoc(doc(db, 'users', userId), { salaries }, { merge: true });
  } catch (error) {
    console.error('연봉을 저장하는 중 오류 발생:', error);
  }
};

const loadSalaries = async (userId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.salaries || [];
    } else {
      console.log('해당 문서가 존재하지 않습니다!');
      return [];
    }
  } catch (error) {
    console.error('연봉을 불러오는 중 오류 발생:', error);
    return [];
  }
};

const saveToken = async (userId: string, token: string) => {
  try {
    await setDoc(doc(db, 'users', userId), { token }, { merge: true });
  } catch (error) {
    console.error('토큰을 저장하는 중 오류 발생:', error);
  }
};

const requestAndSaveToken = async (
  userId: string,
  setLoading: (loading: boolean) => void
) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('알림 권한이 부여되지 않았습니다.');
      return;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    });

    if (currentToken) {
      await saveToken(userId, currentToken);
      // console.log('토큰 저장 성공:', currentToken);
    } else {
      console.log('토큰을 가져올 수 없습니다.');
    }
  } catch (error) {
    console.error('토큰을 요청하는 중 오류 발생:', error);
  } finally {
    setLoading(false);
  }
};

// New functions for saving and loading salary info
const saveSalaryInfo = async (userId: string, salaryInfo: any) => {
  try {
    await setDoc(doc(db, 'users', userId), { salaryInfo }, { merge: true });
  } catch (error) {
    console.error('연봉 정보를 저장하는 중 오류 발생:', error);
  }
};

const loadSalaryInfo = async (userId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.salaryInfo || {};
    } else {
      console.log('해당 문서가 존재하지 않습니다!');
      return {};
    }
  } catch (error) {
    console.error('연봉 정보를 불러오는 중 오류 발생:', error);
    return {};
  }
};

// New functions for saving and loading company info
const saveCompanyInfo = async (userId: string, companyInfo: any) => {
  try {
    await setDoc(doc(db, 'users', userId), { companyInfo }, { merge: true });
  } catch (error) {
    console.error('회사 정보를 저장하는 중 오류 발생:', error);
  }
};

const loadCompanyInfo = async (userId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.companyInfo || {};
    } else {
      console.log('해당 문서가 존재하지 않습니다!');
      return {};
    }
  } catch (error) {
    console.error('회사 정보를 불러오는 중 오류 발생:', error);
    return {};
  }
};

export {
  app,
  messaging,
  analytics,
  auth,
  db,
  saveSalaries,
  loadSalaries,
  saveToken,
  requestAndSaveToken,
  signInUser,
  updateLastAccess,
  saveSalaryInfo,
  loadSalaryInfo,
  saveCompanyInfo,
  loadCompanyInfo,
};
