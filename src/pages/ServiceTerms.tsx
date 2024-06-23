// src/pages/ServiceTerms.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const ServiceTerms: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        서비스 이용 약관
      </Typography>

      <Typography variant="h6" gutterBottom>
        제1조 (목적)
      </Typography>
      <Typography variant="body1" gutterBottom>
        본 약관은 연봉 계산기 (이하 "개키우는개발자")의 이용 조건 및 절차에 관한
        사항을 규정함을 목적으로 합니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제2조 (정의)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. "서비스"란 이용자가 PC, 모바일 등 각종 디지털 기기를 통해 이용할 수
        있는 연봉 계산기 및 관련 서비스를 의미합니다.
        <br />
        2. "이용자"란 본 약관에 따라 서비스를 이용하는 자를 의미합니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제3조 (약관의 효력 및 변경)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 본 약관은 이용자가 서비스 이용을 신청하고, 개키우는개발자가 이를
        승낙함으로써 효력이 발생합니다.
        <br />
        2. 개키우는개발자는 필요 시 약관을 변경할 수 있으며, 변경된 약관은
        공지사항을 통해 공지합니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제4조 (서비스의 제공 및 변경)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 개키우는개발자는 연중무휴, 24시간 서비스를 제공함을 원칙으로 합니다.
        <br />
        2. 서비스 내용, 운영 상의 이유 등으로 인해 서비스의 제공 내용이 변경될
        수 있으며, 이 경우 개키우는개발자는 변경 사항을 사전에 공지합니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제5조 (서비스 이용의 제한 및 중지)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 개키우는개발자는 다음 각 호에 해당하는 경우 서비스 이용을 제한하거나
        중지할 수 있습니다.
        <br />
        - 서비스 설비 점검, 보수 또는 공사로 인해 부득이한 경우
        <br />- 이용자가 본 약관을 위반하는 행위를 하는 경우
      </Typography>

      <Typography variant="h6" gutterBottom>
        제6조 (면책 조항)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 본 서비스는 일반적인 계산을 기반으로 제공되며, 실제 연봉 지급 조건 및
        상황에 따라 오차가 발생할 수 있습니다.
        <br />
        2. 본 서비스의 계산 결과는 참고용이며, 법적 효력을 가지지 않습니다. 실
        수령액 산정을 위해서는 반드시 국세청 간이세액표 등 공식 자료를
        참고하시기 바랍니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제7조 (개인정보 보호)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 개키우는개발자는 이용자의 개인정보를 보호하기 위해 관련 법령에 따라
        노력합니다.
        <br />
        2. 개인정보의 수집, 이용, 보관, 처리 등에 관한 사항은 개인정보처리방침을
        따릅니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제8조 (기타)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 본 약관에 명시되지 않은 사항은 관련 법령 및 개키우는개발자의 정책에
        따릅니다.
        <br />
        2. 본 약관의 해석 및 적용에 관한 사항은 대한민국 법률을 따릅니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제9조 (데이터 저장 및 접근)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 본 서비스는 게스트 모드로 운영되며, 브라우저 세션이 종료되면 일부
        데이터는 삭제될 수 있습니다.
        <br />
        2. 서비스 이용 중 입력되는 연봉 및 계산 관련 데이터는 서버에 저장되며,
        이용자가 이를 관리할 수 있습니다.
      </Typography>

      <Typography variant="body1">
        실 수령액 산정 기준:{' '}
        <a
          href="https://teht.hometax.go.kr/websquare/websquare.html?w2xPath=/ui/sf/a/a/UTESFAAF99.xml"
          target="_blank"
        >
          국세청 간이세액표 보기
        </a>
      </Typography>
    </Box>
  );
};

export default ServiceTerms;
