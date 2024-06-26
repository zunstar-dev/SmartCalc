// 퇴직 정보 로드에 대한 응답 인터페이스
export interface LoadRetirementInfoResponse {
  annualBonus: number; // 연간 상여금
  annualLeaveAllowance: number; // 연차수당 지급기준액
  averageDailyWage: number; // 1일 평균 임금
  employmentDays: number; // 재직일수
  monthlySalary: number; // 월 기본급
  normalDailyWage: number; // 정상적인 일일 임금
  retirementOption: boolean; // 퇴직 옵션
  retirementPay: number; // 예상 퇴직금
  startDate: string; // 입사일자
  endDate: string; // 퇴사일자
}

// 퇴직 정보 저장에 대한 요청 인터페이스
export interface RetirementInfoRequest {
  annualBonus: number; // 연간 상여금
  annualLeaveAllowance: number; // 연차수당 지급기준액
  averageDailyWage: number; // 1일 평균 임금
  employmentDays: number; // 재직일수
  monthlySalary: number; // 월 기본급
  normalDailyWage: number; // 정상적인 일일 임금
  retirementOption: boolean; // 퇴직 옵션
  retirementPay: number; // 예상 퇴직금
  startDate: string; // 입사일자
  endDate: string; // 퇴사일자
}
