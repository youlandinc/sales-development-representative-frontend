import { StyledButton } from '@/components/atoms';

interface SettingsButtonProps {
  label: string;
  width: string;
  onClick: () => void;
}

export const SettingsButton = ({
  label,
  width,
  onClick,
}: SettingsButtonProps) => {
  return (
    <StyledButton
      color={'info'}
      onClick={() => onClick()}
      size={'small'}
      sx={{ width }}
      variant={'outlined'}
    >
      {label}
    </StyledButton>
  );
};
