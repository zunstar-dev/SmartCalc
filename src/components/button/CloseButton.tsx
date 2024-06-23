// src/button/DeleteButton.tsx
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/system';
import { FC } from 'react';

const StyledCloseButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  color: theme.palette.primary.contrastText,
  fontSize: '12px', // 폰트 크기 설정
  padding: '4px 8px', // 버튼 내부 패딩 조정
  minWidth: 'auto', // 최소 너비 조정
  marginTop: 8,
}));

const CloseButton: FC<ButtonProps> = (props) => {
  return <StyledCloseButton {...props}>닫기</StyledCloseButton>;
};

export default CloseButton;
