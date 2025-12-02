import { FC, MouseEvent } from 'react';
import Image from 'next/image';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    height: 22,
    maxWidth: 270,
    padding: '0 4px',
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
        <div className={classes.button} onClick={onDelete}>
          <Image alt="" fill sizes="100%" src="/images/icon-close.svg" />
        </div>
      )}
      <div className={classes.content}>{label}</div>
    </div>
  );
};
