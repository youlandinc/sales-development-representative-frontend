import { Icon, SvgIconProps } from '@mui/material';

import ICON_DELETE_DEFAULT from './assets/Icon_delete_default.svg';
import ICON_ARROW from './assets/icon_arrow.svg';
import ICON_ARROW_DOWN from './assets/icon_arrow_down.svg';
import ICON_CLOSE from './assets/icon_close.svg';
import ICON_CLOSE_THIN from './assets/icon_close_thin.svg';
import ICON_COINS from './assets/icon_coins.svg';
import ICON_COLLAPSE from './assets/icon_collapse.svg';
import ICON_DELETE from './assets/icon_delete.svg';
import ICON_DRAG from './assets/icon_drag.svg';
import ICON_PLUS from './assets/icon_plus.svg';
import ICON_SPARKLE from './assets/icon_sparkle.svg';
import ICON_SPARKLE_FILL from './assets/icon_sparkle_fill.svg';
import ICON_SPARKLE_OUTLINE from './assets/icon_sparkle_outline.svg';
import ICON_SUCCESS from './assets/icon_success.svg';
import ICON_TEXT from './assets/icon_text.svg';
import ICON_WARNING from './assets/icon_warning.svg';

import ICON_ACTION_MENU_ARROW_LINE_RIGHT from './assets/icon_action_menu_arrow_line_right.svg';
import ICON_ACTION_MENU_CALL from './assets/icon_action_menu_call.svg';
import ICON_ACTION_MENU_CAMPAIGN from './assets/icon_action_menu_campaign.svg';
import ICON_ACTION_MENU_CSV from './assets/icon_action_menu_csv.svg';
import ICON_ACTION_MENU_LIGHTING from './assets/icon_action_menu_lighting.svg';
import ICON_ACTION_MENU_SEARCH from './assets/icon_action_menu_search.svg';
import ICON_ACTION_MENU_SHARE from './assets/icon_action_menu_share.svg';
import ICON_ACTION_MENU_SUCCESS from './assets/icon_action_menu_success.svg';
import ICON_ACTION_MENU_SUGGESTIONS from './assets/icon_action_menu_suggestions.svg';
import ICON_ACTION_MENU_SUGGESTIONS_BLUE from './assets/icon_action_menu_suggestions_blue.svg';
import ICON_ACTION_MENU_TARGET from './assets/icon_action_menu_target.svg';
import ICON_ACTION_MENU_WARNING_TRIANGLE from './assets/icon_action_menu_warning_triangle.svg';

import ICON_ENRICHMENT_ACTION from './assets/icon_enrichment_action.svg';
import ICON_ENRICHMENT_AI from './assets/icon_enrichment_ai.svg';
import ICON_ENRICHMENT_INTEGRATIONS from './assets/icon_enrichment_integrations.svg';

import ICON_THINKING from './assets/icon_thinking.svg';
import ICON_THINKING_ARROW_UP_RIGHT from './assets/icon_thinking_arrow_up_right.svg';
import ICON_THINKING_ERROR from './assets/icon_thinking_error.svg';
import ICON_THINKING_FORK from './assets/icon_thinking_fork.svg';
import ICON_THINKING_LIST_CHECKS from './assets/icon_thinking_list_checks.svg';
import ICON_THINKING_NORMAL from './assets/icon_thinking_normal.svg';
import ICON_THINKING_SEARCH from './assets/icon_thinking_search.svg';
import ICON_THINKING_SUCCESS from './assets/icon_thinking_success.svg';
import ICON_TRAY_ARROW_DOWN from './assets/icon_thinking_tray_arrow_down.svg';
import ICON_THINKING_WARNING from './assets/icon_thinking_warning.svg';

import ICON_FIND_CHECK_CIRCLE from './assets/icon_find_check_circle.svg';
import ICON_FIND_CHECK_SQUARE_OUTLINE from './assets/icon_find_check_square_outline.svg';
import ICON_FIND_NO_CHECK_SQUARE_OUTLINE from './assets/icon_find_no_check_square_outline.svg';
import ICON_FIND_VALIDATE_FALSE from './assets/icon_find_validate_false.svg';

type IconSize = 12 | 14 | 16 | 18 | 20;

interface DrawersIconProps extends SvgIconProps {
  size?: IconSize | number;
}

export const DrawersIconConfig = {
  DeleteDefault: ({ size = 20, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_DELETE_DEFAULT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Arrow: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ARROW}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ArrowDown: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ARROW_DOWN}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Close: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_CLOSE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  CloseThin: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_CLOSE_THIN}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Coins: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_COINS}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Collapse: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_COLLAPSE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Delete: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_DELETE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Drag: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_DRAG}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Plus: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_PLUS}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Sparkle: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_SPARKLE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  SparkleFill: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_SPARKLE_FILL}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  SparkleOutline: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_SPARKLE_OUTLINE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Success: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_SUCCESS}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Text: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_TEXT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  Warning: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_WARNING}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ActionMenuArrowLineRight: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_ARROW_LINE_RIGHT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuCall: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_CALL}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuCampaign: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_CAMPAIGN}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuCsv: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_CSV}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuLighting: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_LIGHTING}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuSearch: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_SEARCH}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuShare: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_SHARE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuSuccess: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_SUCCESS}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuSuggestions: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_SUGGESTIONS}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuSuggestionsBlue: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_SUGGESTIONS_BLUE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuTarget: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_TARGET}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ActionMenuWarningTriangle: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ACTION_MENU_WARNING_TRIANGLE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  EnrichmentAction: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ENRICHMENT_ACTION}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  EnrichmentAi: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ENRICHMENT_AI}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  EnrichmentIntegrations: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_ENRICHMENT_INTEGRATIONS}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Thinking: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_THINKING}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ThinkingArrowUpRight: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_THINKING_ARROW_UP_RIGHT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ThinkingError: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_THINKING_ERROR}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ThinkingFork: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_THINKING_FORK}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ThinkingListChecks: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_THINKING_LIST_CHECKS}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ThinkingNormal: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_THINKING_NORMAL}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ThinkingSearch: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_THINKING_SEARCH}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ThinkingSuccess: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_THINKING_SUCCESS}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  ThinkingWarning: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_THINKING_WARNING}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  TrayArrowDown: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_TRAY_ARROW_DOWN}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  FindCheckCircle: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_FIND_CHECK_CIRCLE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  FindCheckSquareOutline: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_FIND_CHECK_SQUARE_OUTLINE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  FindNoCheckSquareOutline: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_FIND_NO_CHECK_SQUARE_OUTLINE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
  FindValidateFalse: ({ size = 16, ...props }: DrawersIconProps) => (
    <Icon
      component={ICON_FIND_VALIDATE_FALSE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),
};
