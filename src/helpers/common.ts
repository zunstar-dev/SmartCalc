export const convertToKoreanCurrency = (num: string) => {
  if (!num) return '';
  const units = ['', '만', '억', '조', '경'];
  const numArr = num.split('').reverse();
  let result = '';
  for (let i = 0; i < numArr.length; i += 4) {
    const part = numArr
      .slice(i, i + 4)
      .reverse()
      .join('');
    if (part !== '0000') {
      result = `${parseInt(part, 10).toLocaleString()}${units[Math.floor(i / 4)]} ${result}`;
    }
  }
  return result.trim();
};
