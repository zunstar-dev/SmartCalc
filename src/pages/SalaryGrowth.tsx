import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

const SalaryGrowth: FC = () => {
  return (
    <>
      <Helmet>
        <title>연봉 상승률 | 나의 연봉 계산기</title>
        <meta
          name="description"
          content="연봉 계산기를 통해 연봉 상승률을 계산하세요."
        />
        <meta property="og:title" content="연봉 상승률 | 나의 연봉 계산기" />
        <meta
          property="og:description"
          content="연봉 계산기를 통해 연봉 상승률을 계산하세요."
        />
      </Helmet>
      <div>연봉 상승률 페이지 내용</div>
    </>
  );
};

export default SalaryGrowth;
