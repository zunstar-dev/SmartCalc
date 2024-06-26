// Salary 정보 요청 타입 (사용자가 입력한 연봉 정보)
export interface SalaryInfoRequest {
  children: number; // 자녀 수
  dependents: number; // 부양 가족 수
  nonTaxableAmount: number; // 비과세 금액
  retirementOption: boolean; // 퇴직 옵션
  taxReduction: boolean; // 세금 감면 여부
}

// Salary 정보 응답 타입 (데이터베이스에서 불러온 연봉 정보)
export interface SalaryInfoResponse {
  children: number; // 자녀 수
  dependents: number; // 부양 가족 수
  nonTaxableAmount: number; // 비과세 금액
  retirementOption: boolean; // 퇴직 옵션
  taxReduction: boolean; // 세금 감면 여부
}

// Load 연봉 응답 타입 (데이터베이스에서 불러온 연봉 목록)
export interface LoadSalariesResponse {
  salaries: number[]; // 연봉 목록
}

// Save 연봉 요청 타입 (저장할 연봉 목록)
export interface SaveSalariesRequest {
  salaries: number[]; // 연봉 목록
}

export interface SalaryData {
  retirementOption: boolean; // 퇴직금 옵션 (true: 별도, false: 포함)
  dependents: number; // 부양가족 수
  children: number; // 20세 이하 자녀 수
  nonTaxableAmount: string; // 비과세액 (문자열 형태, 원 단위)
  convertedNonTaxableAmount: string; // 비과세액 (한국 원화 형식으로 변환된 문자열)
  taxReduction: boolean; // 소득세 감면 대상 여부 (true: 예, false: 아니오)
}
