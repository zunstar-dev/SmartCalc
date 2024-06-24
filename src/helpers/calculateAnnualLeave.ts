import {
  format,
  differenceInYears,
  addYears,
  isBefore,
  differenceInMonths,
} from 'date-fns';

export const calculateAnnualLeave = (startDate: Date, endDate: Date) => {
  const results: { description: string; period: string; leave: number }[] = [];
  let totalLeave = 0;

  // 입사일 기준 계산
  const calculateByJoiningDate = () => {
    let currentYear = 0;
    let currentDate = new Date(startDate);

    while (isBefore(currentDate, endDate)) {
      const yearEndDate = addYears(startDate, currentYear + 1);
      const periodEndDate = isBefore(yearEndDate, endDate)
        ? yearEndDate
        : endDate;

      if (currentYear === 0) {
        // 1년 미만
        const monthsWorked = differenceInMonths(periodEndDate, currentDate);
        const leaveEarned = Math.min(monthsWorked, 11); // 최대 11일
        results.push({
          description: '1년 미만',
          period: `${format(currentDate, 'yyyy. MM. dd')} ~ ${format(periodEndDate, 'yyyy. MM. dd')}`,
          leave: leaveEarned,
        });
        totalLeave += leaveEarned;
      } else {
        // 1년 이상
        const leaveEarned = Math.min(
          15 + Math.floor((currentYear - 1) / 2),
          25
        );
        results.push({
          description: `${currentYear + 1}년차`,
          period: `${format(currentDate, 'yyyy. MM. dd')} ~ ${format(periodEndDate, 'yyyy. MM. dd')}`,
          leave: leaveEarned,
        });
        totalLeave += leaveEarned;
      }

      currentYear++;
      currentDate = yearEndDate;
    }
  };

  // 회계일 기준 계산
  const calculateByAccountingDate = () => {
    let currentYear = startDate.getFullYear();
    let currentDate = new Date(startDate);

    while (isBefore(currentDate, endDate)) {
      const yearEndDate = new Date(currentYear + 1, 0, 1); // 다음 해 1월 1일
      const periodEndDate = isBefore(yearEndDate, endDate)
        ? yearEndDate
        : endDate;

      if (currentYear === startDate.getFullYear()) {
        // 입사 년도 (월차)
        const monthsWorked = differenceInMonths(periodEndDate, currentDate);
        const leaveEarned = Math.min(monthsWorked, 11); // 최대 11일
        results.push({
          description: '입사년 (월차)',
          period: `${format(currentDate, 'yyyy. MM. dd')} ~ ${format(periodEndDate, 'yyyy. MM. dd')}`,
          leave: leaveEarned,
        });
        totalLeave += leaveEarned;
      } else {
        // 2년차 이상 (연차)
        const fullYearWorked = differenceInYears(currentDate, startDate);
        const leaveEarned = Math.min(15 + Math.floor(fullYearWorked / 2), 25);
        results.push({
          description: `${fullYearWorked + 1}년차 (연차)`,
          period: `${format(currentDate, 'yyyy. MM. dd')} ~ ${format(periodEndDate, 'yyyy. MM. dd')}`,
          leave: leaveEarned,
        });
        totalLeave += leaveEarned;
      }

      currentYear++;
      currentDate = yearEndDate;
    }
  };

  calculateByJoiningDate();
  calculateByAccountingDate();

  return { results, totalLeave };
};
