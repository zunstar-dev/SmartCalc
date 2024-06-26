// 회사 정보 로드에 대한 응답 인터페이스
export interface LoadCompanyInfoResponse {
  joinDate: string; // 회사 입사일
}

// 회사 정보 저장에 대한 요청 인터페이스
export interface SaveCompanyInfoRequest {
  joinDate: string; // 회사 입사일
}
