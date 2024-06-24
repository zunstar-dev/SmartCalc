import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/Firebase';

export const saveSalaryInfo = async (userId: string, salaryInfo: any) => {
  try {
    await setDoc(doc(db, 'users', userId), { salaryInfo }, { merge: true });
  } catch (error) {
    console.error('연봉 정보를 저장하는 중 오류 발생:', error);
  }
};

export const loadSalaryInfo = async (userId: string) => {
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

export const saveSalaries = async (userId: string, salaries: string[]) => {
  try {
    await setDoc(doc(db, 'users', userId), { salaries }, { merge: true });
  } catch (error) {
    console.error('연봉을 저장하는 중 오류 발생:', error);
  }
};

export const loadSalaries = async (userId: string) => {
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
