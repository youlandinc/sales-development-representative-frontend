'use client';

import {
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { StyledButton } from '@/components/atoms';

// 定义数据类型
interface Provider {
  name: string;
  icon: string;
}

interface UsageRecord {
  id: string;
  enrichmentService: string;
  provider: Provider | Provider[];
  creditsUsed: number;
  remainingCredits: number;
  date: string;
  subRows?: UsageRecord[];
}

// 模拟数据
const mockData: UsageRecord[] = [
  {
    id: '1',
    enrichmentService: 'AI Web Researcher',
    provider: { name: 'Wiza', icon: 'https://via.placeholder.com/18' },
    creditsUsed: 1,
    remainingCredits: 47,
    date: 'December 9, 2025',
  },
  {
    id: '2',
    enrichmentService: 'Min Fund Size',
    provider: { name: 'Forager', icon: 'https://via.placeholder.com/18' },
    creditsUsed: 1,
    remainingCredits: 47,
    date: 'December 9, 2025',
  },
  {
    id: '3',
    enrichmentService: 'Median Fund Size',
    provider: { name: 'Forager', icon: 'https://via.placeholder.com/18' },
    creditsUsed: 1,
    remainingCredits: 47,
    date: 'December 9, 2025',
  },
  {
    id: '4',
    enrichmentService: 'Work Email',
    provider: [
      { name: 'Wiza', icon: 'https://via.placeholder.com/18' },
      { name: 'Forager', icon: 'https://via.placeholder.com/18' },
      { name: 'Forager', icon: 'https://via.placeholder.com/18' },
    ],
    creditsUsed: 10,
    remainingCredits: 47,
    date: 'December 9, 2025',
    subRows: [
      {
        id: '4-1',
        enrichmentService: '',
        provider: { name: 'Forager', icon: 'https://via.placeholder.com/18' },
        creditsUsed: 2,
        remainingCredits: 0,
        date: '',
      },
      {
        id: '4-2',
        enrichmentService: '',
        provider: { name: 'Wiza', icon: 'https://via.placeholder.com/18' },
        creditsUsed: 4,
        remainingCredits: 0,
        date: '',
      },
      {
        id: '4-3',
        enrichmentService: '',
        provider: { name: 'Forager', icon: 'https://via.placeholder.com/18' },
        creditsUsed: 2,
        remainingCredits: 0,
        date: '',
      },
    ],
  },
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `${i + 5}`,
    enrichmentService: 'Work Email',
    provider: { name: 'Forager', icon: 'https://via.placeholder.com/18' },
    creditsUsed: 1,
    remainingCredits: 47,
    date: 'December 9, 2025',
  })),
];

export const Table2 = () => {
  const [usageType, setUsageType] = useState('Enrichment');
  const [dateRange, setDateRange] = useState(
    'This month (Nov 1, 2025 - Nov 30, 2025)',
  );
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const paginatedData = mockData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );
  const totalPages = Math.ceil(mockData.length / pageSize);

  const renderProvider = (provider: Provider | Provider[]) => {
    if (Array.isArray(provider)) {
      return (
        <Stack alignItems="center" direction="row" spacing={0.5}>
          {provider.slice(0, 3).map((p, idx) => (
            <Avatar
              key={idx}
              src={p.icon}
              sx={{
                width: 18,
                height: 18,
                border: '1px solid #F8F8FA',
                ml: idx > 0 ? -0.5 : 0,
              }}
            />
          ))}
          <Typography sx={{ fontSize: 12, color: '#363440', ml: 1 }}>
            3 providers
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack alignItems="center" direction="row" spacing={0.5}>
        <Avatar
          src={provider.icon}
          sx={{ width: 18, height: 18, border: '1px solid #F8F8FA' }}
        />
        <Typography sx={{ fontSize: 12, color: '#363440' }}>
          {provider.name}
        </Typography>
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        border: '1px solid #E5E5E5',
        borderRadius: 4,
        p: 3,
      }}
    >
      {/* Header with filters */}
      <Stack
        alignItems="flex-end"
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box sx={{ width: 320 }}>
          <Typography sx={{ fontSize: 14, color: '#363440', mb: 0.5 }}>
            Usage type
          </Typography>
          <Select
            fullWidth
            IconComponent={KeyboardArrowDownIcon}
            onChange={(e) => setUsageType(e.target.value)}
            size="small"
            sx={{
              height: 40,
              fontSize: 14,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#DFDEE6',
              },
            }}
            value={usageType}
          >
            <MenuItem value="Enrichment">Enrichment</MenuItem>
            <MenuItem value="Research">Research</MenuItem>
          </Select>
        </Box>

        <Select
          IconComponent={KeyboardArrowDownIcon}
          onChange={(e) => setDateRange(e.target.value)}
          size="small"
          sx={{
            height: 32,
            fontSize: 12,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E5E5E5',
            },
          }}
          value={dateRange}
        >
          <MenuItem value="This month (Nov 1, 2025 - Nov 30, 2025)">
            This month (Nov 1, 2025 - Nov 30, 2025)
          </MenuItem>
          <MenuItem value="Last month">Last month</MenuItem>
          <MenuItem value="Last 3 months">Last 3 months</MenuItem>
          <MenuItem value="Last 6 months">Last 6 months</MenuItem>
          <MenuItem value="Select custom range">Select custom range</MenuItem>
        </Select>
      </Stack>

      {/* Table */}
      <Stack>
        {/* Table Header */}
        <Stack
          direction="row"
          sx={{ borderBottom: '1px solid #D0CEDA', pb: 1 }}
        >
          <Box sx={{ flex: 1, px: 3 }}>
            <Typography sx={{ fontSize: 12, color: '#6F6C7D' }}>
              Enrichment service
            </Typography>
          </Box>
          <Box sx={{ flex: 1, px: 3 }}>
            <Typography sx={{ fontSize: 12, color: '#6F6C7D' }}>
              Provider
            </Typography>
          </Box>
          <Box sx={{ width: 140, px: 1.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 12, color: '#6F6C7D' }}>
              Credits used
            </Typography>
          </Box>
          <Box sx={{ width: 140, px: 1.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 12, color: '#6F6C7D' }}>
              Remaining credits
            </Typography>
          </Box>
          <Box sx={{ flex: 1, px: 3 }}>
            <Typography sx={{ fontSize: 12, color: '#6F6C7D' }}>
              Date
            </Typography>
          </Box>
        </Stack>

        {/* Table Body - 使用 ul + li */}
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {paginatedData.map((row) => (
            <Box component="li" key={row.id}>
              {/* Main Row */}
              <Stack
                alignItems="center"
                direction="row"
                sx={{
                  height: 48,
                  borderBottom: '1px solid #DFDEE6',
                  '&:hover': { bgcolor: '#FAFAFA' },
                }}
              >
                <Box
                  sx={{ flex: 1, px: 3, display: 'flex', alignItems: 'center' }}
                >
                  {row.subRows && row.subRows.length > 0 && (
                    <IconButton
                      onClick={() => toggleRow(row.id)}
                      size="small"
                      sx={{ mr: 1, p: 0 }}
                    >
                      {expandedRows.has(row.id) ? (
                        <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                  )}
                  <Typography sx={{ fontSize: 12, color: '#363440' }}>
                    {row.enrichmentService}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, px: 3 }}>
                  {renderProvider(row.provider)}
                </Box>
                <Box sx={{ width: 140, px: 1.5, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, color: '#363440' }}>
                    {row.creditsUsed}
                  </Typography>
                </Box>
                <Box sx={{ width: 140, px: 1.5, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, color: '#363440' }}>
                    {row.remainingCredits}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, px: 3 }}>
                  <Typography sx={{ fontSize: 12, color: '#363440' }}>
                    {row.date}
                  </Typography>
                </Box>
              </Stack>

              {/* Sub Rows - 嵌套 ul + li */}
              {expandedRows.has(row.id) && row.subRows && (
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {row.subRows.map((subRow) => (
                    <Stack
                      alignItems="center"
                      component="li"
                      direction="row"
                      key={subRow.id}
                      sx={{
                        height: 48,
                        bgcolor: '#FAFAFA',
                        borderBottom: '1px solid #DFDEE6',
                      }}
                    >
                      <Box sx={{ flex: 1, px: 3, pl: 7 }}>
                        <Typography sx={{ fontSize: 12, color: '#363440' }}>
                          {subRow.enrichmentService}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, px: 3 }}>
                        {renderProvider(subRow.provider)}
                      </Box>
                      <Box sx={{ width: 140, px: 1.5, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: 12, color: '#363440' }}>
                          {subRow.creditsUsed}
                        </Typography>
                      </Box>
                      <Box sx={{ width: 140, px: 1.5 }} />
                      <Box sx={{ flex: 1, px: 3 }} />
                    </Stack>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Stack>

      {/* Pagination */}
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ pt: 1.5 }}
      >
        <Typography sx={{ fontSize: 12, color: '#7D7D7D' }}>
          {mockData.length} records
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <StyledButton
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => p - 1)}
            size="small"
            sx={{
              height: 32,
              px: 1.5,
              fontSize: 12,
              border: '1px solid #DFDEE6',
              bgcolor: 'white',
              color: '#363440',
              '&:hover': { bgcolor: '#F8F8FA' },
            }}
            variant="outlined"
          >
            Previous
          </StyledButton>
          <StyledButton
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => p + 1)}
            size="small"
            sx={{
              height: 32,
              px: 1.5,
              fontSize: 12,
              border: '1px solid #DFDEE6',
              bgcolor: 'white',
              color: '#363440',
              '&:hover': { bgcolor: '#F8F8FA' },
            }}
            variant="outlined"
          >
            Next
          </StyledButton>
        </Stack>
      </Stack>
    </Box>
  );
};
