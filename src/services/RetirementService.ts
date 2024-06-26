import {
  doc,
  getDoc,
  setDoc,
  deleteField,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/Firebase';
import {
  LoadRetirementInfoResponse,
  RetirementInfoRequest,
} from '../types/retirement';

export const loadRetirementInfo = async (
  userId: string
): Promise<LoadRetirementInfoResponse> => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.retirementInfo || {};
    } else {
      console.log('해당 문서가 존재하지 않습니다!');
      return {} as LoadRetirementInfoResponse;
    }
  } catch (error) {
    console.error('퇴직 정보를 불러오는 중 오류 발생:', error);
    return {} as LoadRetirementInfoResponse;
  }
};

export const saveRetirementInfo = async (
  userId: string,
  retirementInfo: RetirementInfoRequest
): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), { retirementInfo }, { merge: true });
  } catch (error) {
    console.error('퇴직 정보를 저장하는 중 오류 발생:', error);
  }
};

export const deleteRetirementInfo = async (userId: string): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      retirementInfo: deleteField(),
    });
  } catch (error) {
    console.error('퇴직 정보를 삭제하는 중 오류 발생:', error);
  }
};
