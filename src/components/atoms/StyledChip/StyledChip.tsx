import { FC, MouseEvent } from 'react';
import { createUseStyles } from 'react-jss';

import { StyledImage } from '@/components/atoms';

const useStyles = createUseStyles({
  container: {
    height: 22,
    maxWidth: '100%',
    padding: '0 6px 0 4px',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#F0F0F4',
  },
  button: {
    width: '12px',
    height: '12px',
    position: 'relative',
    cursor: 'pointer',
  },
  content: {
    fontSize: 12,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

interface StyledChipChipProps {
  label: string;
  onDelete?: (e: MouseEvent) => void;
}

export const StyledChip: FC<StyledChipChipProps> = ({ label, onDelete }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.container} styled-chip`}>
      {onDelete && (
        <StyledImage
          className={classes.button}
          onClick={onDelete}
          url={'/images/icon-close.svg'}
        />
      )}
      <div className={classes.content}>{label}</div>
    </div>
  );
};
