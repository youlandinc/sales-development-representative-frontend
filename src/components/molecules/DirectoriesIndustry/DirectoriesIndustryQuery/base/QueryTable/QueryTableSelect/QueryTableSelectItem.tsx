import { FC } from 'react';
import { Box, Collapse, Stack, Typography } from '@mui/material';
import { EnrichmentTableItem } from '@/types';

import { QueryTableIcon } from './QueryTableIcons';

interface FilterTableSelectItemProps {
  item: EnrichmentTableItem;
  isExpanded: boolean;
  selectedTableId: string;
  onToggleExpand: (tableId: string) => void;
  onSelectTable: (tableId: string) => void;
}

export const QueryTableSelectItem: FC<FilterTableSelectItemProps> = ({
  item,
  isExpanded,
  selectedTableId,
  onToggleExpand,
  onSelectTable,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = !hasChildren && selectedTableId === item.tableId;

  return (
    <Box>
      {/* Parent Item */}
      <Stack
        onClick={() => {
          if (hasChildren) {
            onToggleExpand(item.tableId);
          } else {
            onSelectTable(item.tableId);
          }
        }}
        sx={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 0.5,
          height: 40,
          pr: 1,
          borderRadius: 2,
          cursor: 'pointer',
          '&:hover': { bgcolor: '#F4F5F9' },
        }}
      >
        <QueryTableIcon.ArrowDown
          sx={{
            transition: 'all .3s',
            transform: `rotate(${isExpanded ? 0 : -0.25}turn)`,
            visibility: hasChildren ? 'visible' : 'hidden',
          }}
        />

        {hasChildren ? (
          <QueryTableIcon.Folder />
        ) : (
          <QueryTableIcon.TableNormal />
        )}

        <Typography
          sx={{
            flex: 1,
            fontSize: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.tableName}
        </Typography>

        <QueryTableIcon.Tick
          sx={{ visibility: isSelected ? 'visible' : 'hidden' }}
        />
      </Stack>

      {/* Children Items */}
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Stack sx={{ gap: 0.5, mt: 0.5 }}>
            {item.children!.map((child) => {
              const isChildSelected = selectedTableId === child.tableId;
              return (
                <Stack
                  key={child.tableId}
                  onClick={() => onSelectTable(child.tableId)}
                  sx={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 0.5,
                    height: 40,
                    pl: 5.5,
                    pr: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#F4F5F9' },
                  }}
                >
                  <QueryTableIcon.TableNormal
                    sx={{
                      '& path': {
                        fill: isChildSelected ? '#6E4EFB' : '#363440',
                      },
                    }}
                  />

                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: 14,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: isChildSelected ? '#6E4EFB' : '#2A292E',
                    }}
                  >
                    {child.tableName}
                  </Typography>

                  <QueryTableIcon.Tick
                    sx={{ visibility: isChildSelected ? 'visible' : 'hidden' }}
                  />
                </Stack>
              );
            })}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
};
