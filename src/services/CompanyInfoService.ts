import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/Firebase';

export const loadCompanyInfo = async (userId: string) => {
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

export const saveCompanyInfo = async (userId: string, companyInfo: any) => {
  try {
    await setDoc(doc(db, 'users', userId), { companyInfo }, { merge: true });
  } catch (error) {
    console.error('회사 정보를 저장하는 중 오류 발생:', error);
  }
};
