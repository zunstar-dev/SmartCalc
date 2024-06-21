// src/button/DeleteButton.tsx
import { IconButton, IconButtonProps } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '4px',
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  color: theme.palette.primary.contrastText,
}));

const DeleteButton: FC<IconButtonProps> = (props) => {
  return (
    <StyledIconButton {...props}>
      <DeleteIcon />
    </StyledIconButton>
  );
};

export default DeleteButton;
