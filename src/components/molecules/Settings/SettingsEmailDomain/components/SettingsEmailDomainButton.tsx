import { StyledButton } from '@/components/atoms';

interface SettingsEmailDomainButtonProps {
  onAddEmailDomain: () => void;
}

export const SettingsEmailDomainButton = ({
  onAddEmailDomain,
}: SettingsEmailDomainButtonProps) => {
  return (
    <StyledButton
      color={'info'}
      onClick={() => onAddEmailDomain()}
      size={'small'}
      sx={{ width: '126px' }}
      variant={'outlined'}
    >
      Add email domain
    </StyledButton>
  );
};
