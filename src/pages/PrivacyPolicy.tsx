// src/pages/PrivacyPolicy.tsx
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

const PrivacyPolicy: FC = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        개인정보 처리방침
      </Typography>

      <Typography variant="h6" gutterBottom>
        제1조 (목적)
      </Typography>
      <Typography variant="body1" gutterBottom>
        본 개인정보 처리방침은 연봉 계산기, 연차 계산기, 퇴직금 계산기 등 다양한
        계산기 서비스 (이하 "개키우는개발자")가 이용자의 개인정보를 어떻게 수집,
        이용, 보관, 처리하는지에 대한 사항을 규정함을 목적으로 합니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제2조 (개인정보의 수집 및 이용)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 개키우는개발자는 게스트 모드로 제공되며, 이용자의 개인 식별 정보를
        수집하지 않습니다.
        <br />
        2. 서비스 이용 중 입력되는 연봉, 연차, 퇴직금 및 기타 계산 관련 데이터는
        서버에 저장되며, 이용자가 이를 관리할 수 있습니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제3조 (개인정보의 보관 및 처리)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 이용자가 입력한 연봉, 연차, 퇴직금 및 기타 계산 관련 데이터는
        브라우저 세션이 종료되면 일부 데이터는 삭제될 수 있습니다.
        <br />
        2. 개키우는개발자는 저장된 데이터를 보호하기 위해 최선을 다하며, 접근
        권한은 서비스 관리자에게만 부여됩니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제4조 (개인정보의 제공 및 공유)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 개키우는개발자는 이용자의 개인 정보를 제3자에게 제공하거나 공유하지
        않습니다.
        <br />
        2. 법령에 의한 요구가 있을 경우, 해당 법령에 따라 정보를 제공할 수
        있습니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제5조 (개인정보 보호를 위한 노력)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 개키우는개발자는 이용자의 개인정보를 보호하기 위해 기술적, 관리적
        보호 조치를 강구합니다.
        <br />
        2. 개키우는개발자는 개인정보 보호 관련 법령을 준수합니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제6조 (개인정보 처리방침의 변경)
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. 본 개인정보 처리방침은 법령 또는 서비스 정책에 따라 변경될 수
        있습니다.
        <br />
        2. 개인정보 처리방침이 변경될 경우, 개키우는개발자는 변경 사항을
        공지합니다.
      </Typography>

      <Typography variant="h6" gutterBottom>
        제7조 (문의)
      </Typography>
      <Typography variant="body1" gutterBottom>
        개인정보 처리방침에 관한 문의사항은 개키우는개발자에게 문의하시기
        바랍니다.
        <br />
        이메일: <a href="mailto:dogvelopers@gmail.com">dogvelopers@gmail.com</a>
        <br />
        블로그:{' '}
        <a
          href="https://dog-developers.tistory.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://dog-developers.tistory.com
        </a>
      </Typography>
    </Box>
  );
};

export default PrivacyPolicy;
