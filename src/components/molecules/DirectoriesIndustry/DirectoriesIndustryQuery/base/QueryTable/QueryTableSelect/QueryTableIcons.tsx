import { Icon, SvgIconProps } from '@mui/material';

import ICON_ARROW_DOWN_SVG from '../../assets/icon-arrow-down.svg';
import ICON_CLOSE_SVG from '../../assets/icon-close.svg';
import ICON_COMPANY_SVG from './assets/icon-company.svg';
import ICON_CSV_SVG from './assets/icon-csv.svg';
import ICON_FOLDER_SVG from './assets/icon-folder.svg';
import ICON_MORE_SVG from './assets/icon-more.svg';
import ICON_OPEN_SVG from './assets/icon-open.svg';
import ICON_PEOPLE_SVG from './assets/icon-people.svg';
import ICON_TABLE_NORMAL_SVG from './assets/icon-table-normal.svg';
import ICON_TICK_SVG from './assets/icon-tick.svg';

import { EnrichmentTableEnum } from '@/types';

type IconSize = 12 | 14 | 16 | 20 | 24;

export const QueryTableIcon = {
  ArrowDown: ({ size = 12, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_ARROW_DOWN_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Close: ({ size = 24, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_CLOSE_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Company: ({ size = 20, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_COMPANY_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Csv: ({ size = 20, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_CSV_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Folder: ({ size = 20, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_FOLDER_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  More: ({ size = 20, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_MORE_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Open: ({ size = 20, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_OPEN_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  People: ({ size = 20, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_PEOPLE_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TableNormal: ({
    size = 20,
    ...props
  }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_TABLE_NORMAL_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Tick: ({ size = 20, ...props }: SvgIconProps & { size?: IconSize }) => (
    <Icon
      component={ICON_TICK_SVG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
};

export const TABLE_SOURCE_ICON: Record<EnrichmentTableEnum, React.ReactNode> = {
  [EnrichmentTableEnum.find_people]: <QueryTableIcon.People />,
  [EnrichmentTableEnum.find_companies]: <QueryTableIcon.Company />,
  [EnrichmentTableEnum.from_csv]: <QueryTableIcon.Csv />,
  [EnrichmentTableEnum.blank_table]: <QueryTableIcon.Folder />,
  [EnrichmentTableEnum.crm_list]: <QueryTableIcon.Folder />,
  [EnrichmentTableEnum.agent]: <QueryTableIcon.Folder />,
};
