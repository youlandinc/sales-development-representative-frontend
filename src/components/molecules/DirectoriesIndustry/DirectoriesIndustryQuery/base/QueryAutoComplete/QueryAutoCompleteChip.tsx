import { FC, MouseEvent } from 'react';
import Image from 'next/image';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    height: '22px',
    maxWidth: '160px',
    padding: '0 8px',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#EAE9EF',
  },
  buttonWrap: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgba(213, 203, 251, 0.50)',
    },
  },
  button: {
    width: '12px',
    height: '12px',
    position: 'relative',
  },
  content: {
    fontSize: 12,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

interface QueryAutoCompleteChipProps {
  label: string;
  onDelete?: (e: MouseEvent) => void;
}

export const QueryAutoCompleteChip: FC<QueryAutoCompleteChipProps> = ({
  label,
  onDelete,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {onDelete && (
        <div className={classes.buttonWrap} onClick={onDelete}>
          <div className={classes.button}>
            <Image alt="" fill sizes="100%" src="/images/icon-close.svg" />
          </div>
        </div>
      )}
      <div className={classes.content}>{label}</div>
    </div>
  );
};
