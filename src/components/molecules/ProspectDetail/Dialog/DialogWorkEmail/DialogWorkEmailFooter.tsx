import { SDRToast, StyledButton } from '@/components/atoms';
import { COINS_PER_ROW } from '@/constant';
import {
  Icon,
  Menu,
  MenuItem,
  menuItemClasses,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

import { CostCoins } from '../DialogWebResearch';

import { useAsyncFn, useRunAi } from '@/hooks';
import { useProspectTableStore } from '@/stores/Prospect';
import { useWorkEmailStore } from '@/stores/Prospect/useWorkEmailStore';
import { useComputedInWorkEmailStore } from './hooks';

import { _createIntegrationConfig } from '@/request/enrichments/suggestions';

import { DisplayTypeEnum, WaterfallConfigTypeEnum } from '@/types/Prospect';

import ICON_ARROW from '../../assets/dialog/icon_arrow_down.svg';

export const DialogWorkEmailFooter: FC = () => {
  const { rowIds, fetchTable } = useProspectTableStore((store) => store);
  const { integrationsInWaterfall, isMissingConfig } =
    useComputedInWorkEmailStore();
  const {
    setWorkEmailVisible,
    setWaterfallConfigType,
    setDisplayType,
    displayType,
  } = useWorkEmailStore((store) => store);
  const params = useParams();
  const tableId =
    typeof params.tableId === 'string' && params.tableId.trim() !== ''
      ? params.tableId
      : '';
  const { runAi } = useRunAi();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  /* {
    "waterfallFieldName": "Work Email",
    "waterfallGroupName": "Work Email",
    "requiredInputsBinding": [
        {
            "name": "name",
            "formulaText": "f_HFYMOirRPtHJ2L0ZxGpNw"
        },
        {
            "name": "companyName",
            "formulaText": "f_vyHJb2hGMZHTJCAWXM8"
        },
        {
            "name": "linkedinUrl",
            "formulaText": "f_YM8g8ULpA24Uvwmuiw4BH"
        }
    ],
    "waterfallConfigs": [
        {
            "name": "Find Work Email",
            "actionKey": "leadmagic-find-work-email",
            "description": "Find person''s work email from name and company domain.",
            "logoUrl": "https://public-storage-hub.s3.us-west-1.amazonaws.com/LeadMagic.svg",
            "authAccountId": "aa_gTss3IIQTO9",
            "score": "4",
            "isSkipped": false,
            "inputParameters": [
                {
                    "name": "name",
                    "formulaText": "f_qZofqye3z4zaS41MvzfCj"
                },
                {
                    "name": "companyName",
                    "formulaText": "f_wkk09A25XMPYo8zmjKo1"
                }
            ]
        },
        {
            "actionKey": "findymail-find-work-email",
            "name": "Find Work Email",
            "description": "Use Full Name + Company Domain to find a work email for a person using Findymail.",
            "logoUrl": "https://public-storage-hub.s3.us-west-1.amazonaws.com/Findymail.svg",
            "authAccountId": "aa_MHzUiWP1ECbw",
            "score": "4",
            "isSkipped": false,
            "inputParameters": [
                {
                    "name": "name",
                    "formulaText": "f_qZofqye3z4zaS41MvzfCj"
                },
                {
                    "name": "domain" ,
                    "formulaText": "f_wkk09A25XMPYo8zmjKo1"
                }
            ]
        },
        {
            "actionKey": "forager-find-work-email",
            "name": "Find Work Email",
            "integrationName": "Forager",
            "description": "Find a person's work email from their professional profile.",
            "logoUrl": "https://public-storage-hub.s3.us-west-1.amazonaws.com/Forager.svg",
            "authAccountId": "aa_QAabmvp2UvcA",
            "score": "4",
            "isSkipped": true,
            "inputParameters": [
                {
                    "name": "linkedin_public_identifier",
                    "formulaText": "f_IJ9kCrANUz0IsnoB-I3mQ"
                }
            ]
        },
        {
            "actionKey": "wiza-find-work-email",
            "name": "Find Work Email",
            "integrationName": "Wiza",
            "description": "Enrich a contact by providing a name, company.",
            "logoUrl": "https://public-storage-hub.s3.us-west-1.amazonaws.com/wiza.png",
            "authAccountId": "aa_NRTOnciE9ZB",
            "score": "4",
            "isSkipped": false,
            "inputParameters": [
                {
                    "name": "name",
                    "formulaText": "f_qZofqye3z4zaS41MvzfCj"
                },
                {
                    "name": "domain",
                    "formulaText": "f_wkk09A25XMPYo8zmjKo1"
                }
            ]
        }
    ]
} */
  const param = {
    waterfallFieldName: 'Work Email',
    waterfallGroupName: 'Work Email',
    waterfallConfigs: integrationsInWaterfall.map((item) => {
      const { inputParams, ...others } = item;
      return {
        ...others,
        inputParameters: inputParams.map((i) => ({
          name: i.columnName,
          formulaText: i.selectedOption?.value || '',
        })),
      };
    }),
  };

  const [state, createWaterfallConfig] = useAsyncFn(async () => {
    try {
      const { data } = await _createIntegrationConfig(tableId, param);
      const { fields } = await fetchTable(tableId);
      const groupId = data;
      const fieldIdsWithGroupId = fields
        .filter((f) => f.groupId === groupId)
        ?.map((f) => f.fieldId);
      setWorkEmailVisible(false);

      runAi({
        tableId,
        recordCount: 10,
        fieldIds: fieldIdsWithGroupId,
      });
    } catch (error) {
      const { header, message, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [param]);

  return (
    <Stack
      alignItems={'center'}
      borderTop={' 1px solid   #D0CEDA'}
      flexDirection={'row'}
      gap={1}
      justifyContent={'flex-end'}
      mt={'auto'}
      px={3}
      py={1.5}
    >
      {displayType === DisplayTypeEnum.integration ? (
        <StyledButton
          onClick={() => {
            setWaterfallConfigType(WaterfallConfigTypeEnum.configure);
            setDisplayType(DisplayTypeEnum.main);
          }}
          sx={{ height: '40px !important' }}
          variant={'contained'}
        >
          Save waterfall step
        </StyledButton>
      ) : (
        <>
          <CostCoins
            border={'1px solid #D0CEDA'}
            count={`${COINS_PER_ROW}`}
            textColor={'text.secondary'}
          />
          <StyledButton
            disabled={!tableId || isMissingConfig}
            endIcon={
              <Icon
                component={ICON_ARROW}
                sx={{
                  width: 12,
                  height: 12,
                  '& path': { fill: 'currentColor' },
                }}
              />
            }
            loading={state.loading}
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
            size={'medium'}
            sx={{ height: '40px !important', width: 80 }}
            variant={'contained'}
          >
            Save
          </StyledButton>
        </>
      )}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => {
          setAnchorEl(null);
        }}
        open={Boolean(anchorEl)}
        slotProps={{
          list: {
            sx: {
              p: 0,
              width: 400,
              [`& .${menuItemClasses.root}`]: {
                justifyContent: 'space-between',
              },
            },
          },
        }}
      >
        {rowIds.length > 10 && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              createWaterfallConfig();
            }}
          >
            <Typography color={'text.secondary'} variant={'body2'}>
              Save and run 10 rows
            </Typography>
            <CostCoins bgcolor={'#EFE9FB'} count={`~${COINS_PER_ROW * 10}`} />
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            //   saveAndRun(tableId, rowIds.length);
            return;
          }}
        >
          <Typography color={'text.secondary'} variant={'body2'}>
            Save and run {rowIds.length} rows in this view
          </Typography>
          <CostCoins bgcolor={'#EFE9FB'} count={'~20'} />
        </MenuItem>
        <MenuItem
          onClick={async () => {
            //   try {
            //     if (activeType === ActiveTypeEnum.add) {
            //       await saveDoNotRun(tableId);
            //     }
            //     if (activeType === ActiveTypeEnum.edit) {
            //       await updateAiConfig(tableId);
            //     }
            //     await cb?.();
            //     handleClose();
            //   } catch (err) {
            //     const { header, message, variant } = err as HttpError;
            //     SDRToast({ message, header, variant });
            //   }
            return;
          }}
        >
          <Typography color={'text.secondary'} variant={'body2'}>
            Save and don&#39;t run
          </Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};
