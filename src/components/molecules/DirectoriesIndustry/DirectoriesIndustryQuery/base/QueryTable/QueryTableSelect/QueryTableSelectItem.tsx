import { FC } from 'react';
import { Box, Collapse, Icon, Stack, Typography } from '@mui/material';
import { ResponseProspectTableViaSearch } from '@/types';

import ICON_ARROW_DOWN from './assets/icon-arrow-down.svg';
import ICON_FOLDER from './assets/icon-folder.svg';
import ICON_TICK from './assets/icon-tick.svg';

import ICON_TABLE_NORMAL from './assets/icon-table-normal.svg';

interface FilterTableSelectItemProps {
  item: ResponseProspectTableViaSearch[0];
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
        <Icon
          component={ICON_ARROW_DOWN}
          sx={{
            width: 12,
            height: 12,
            transition: 'all .3s',
            transform: `rotate(${isExpanded ? 0 : -0.25}turn)`,
            visibility: hasChildren ? 'visible' : 'hidden',
          }}
        />

        <Icon
          component={hasChildren ? ICON_FOLDER : ICON_TABLE_NORMAL}
          sx={{
            width: 20,
            height: 20,
          }}
        />

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

        <Icon
          component={ICON_TICK}
          sx={{
            width: 20,
            height: 20,
            visibility: isSelected ? 'visible' : 'hidden',
          }}
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
                  <Icon
                    component={ICON_TABLE_NORMAL}
                    sx={{
                      width: 20,
                      height: 20,
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

                  <Icon
                    component={ICON_TICK}
                    sx={{
                      width: 20,
                      height: 20,
                      visibility: isChildSelected ? 'visible' : 'hidden',
                    }}
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
