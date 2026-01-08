import { FC } from 'react';
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
import ICON_THINKING_WARNING from './assets/icon_thinking_warning.svg';
import ICON_TRAY_ARROW_DOWN from './assets/icon_thinking_tray_arrow_down.svg';

import ICON_FIND_CHECK_CIRCLE from './assets/icon_find_check_circle.svg';
import ICON_FIND_CHECK_SQUARE_OUTLINE from './assets/icon_find_check_square_outline.svg';
import ICON_FIND_NO_CHECK_SQUARE_OUTLINE from './assets/icon_find_no_check_square_outline.svg';
import ICON_FIND_VALIDATE_FALSE from './assets/icon_find_validate_false.svg';

type IconSize = 12 | 14 | 16 | 18 | 20;

interface DrawersIconProps extends SvgIconProps {
  size?: IconSize | number;
  component: React.ComponentType;
}

export const DrawersIcon: React.FC<DrawersIconProps> = ({
  size = 20,
  component,
  ...props
}) => (
  <Icon
    component={component}
    {...props}
    sx={{ width: size, height: size, ...props.sx }}
  />
);

export const DrawersIconConfig: Record<
  string,
  FC<Omit<DrawersIconProps, 'component'>>
> = {
  DeleteDefault: (props) => (
    <DrawersIcon component={ICON_DELETE_DEFAULT} {...props} />
  ),
  Arrow: (props) => <DrawersIcon component={ICON_ARROW} {...props} />,
  ArrowDown: (props) => <DrawersIcon component={ICON_ARROW_DOWN} {...props} />,
  Close: (props) => <DrawersIcon component={ICON_CLOSE} {...props} />,
  CloseThin: (props) => <DrawersIcon component={ICON_CLOSE_THIN} {...props} />,
  Coins: (props) => <DrawersIcon component={ICON_COINS} {...props} />,
  Collapse: (props) => <DrawersIcon component={ICON_COLLAPSE} {...props} />,
  Delete: (props) => <DrawersIcon component={ICON_DELETE} {...props} />,
  Drag: (props) => <DrawersIcon component={ICON_DRAG} {...props} />,
  Plus: (props) => <DrawersIcon component={ICON_PLUS} {...props} />,
  Sparkle: (props) => <DrawersIcon component={ICON_SPARKLE} {...props} />,
  SparkleFill: (props) => (
    <DrawersIcon component={ICON_SPARKLE_FILL} {...props} />
  ),
  SparkleOutline: (props) => (
    <DrawersIcon component={ICON_SPARKLE_OUTLINE} {...props} />
  ),
  Success: (props) => <DrawersIcon component={ICON_SUCCESS} {...props} />,
  Text: (props) => <DrawersIcon component={ICON_TEXT} {...props} />,
  Warning: (props) => <DrawersIcon component={ICON_WARNING} {...props} />,

  ActionMenuArrowLineRight: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_ARROW_LINE_RIGHT} {...props} />
  ),
  ActionMenuCall: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_CALL} {...props} />
  ),
  ActionMenuCampaign: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_CAMPAIGN} {...props} />
  ),
  ActionMenuCsv: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_CSV} {...props} />
  ),
  ActionMenuLighting: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_LIGHTING} {...props} />
  ),
  ActionMenuSearch: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_SEARCH} {...props} />
  ),
  ActionMenuShare: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_SHARE} {...props} />
  ),
  ActionMenuSuccess: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_SUCCESS} {...props} />
  ),
  ActionMenuSuggestions: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_SUGGESTIONS} {...props} />
  ),
  ActionMenuSuggestionsBlue: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_SUGGESTIONS_BLUE} {...props} />
  ),
  ActionMenuTarget: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_TARGET} {...props} />
  ),
  ActionMenuWarningTriangle: (props) => (
    <DrawersIcon component={ICON_ACTION_MENU_WARNING_TRIANGLE} {...props} />
  ),

  EnrichmentAction: (props) => (
    <DrawersIcon component={ICON_ENRICHMENT_ACTION} {...props} />
  ),
  EnrichmentAi: (props) => (
    <DrawersIcon component={ICON_ENRICHMENT_AI} {...props} />
  ),
  EnrichmentIntegrations: (props) => (
    <DrawersIcon component={ICON_ENRICHMENT_INTEGRATIONS} {...props} />
  ),

  Thinking: (props) => <DrawersIcon component={ICON_THINKING} {...props} />,
  ThinkingArrowUpRight: (props) => (
    <DrawersIcon component={ICON_THINKING_ARROW_UP_RIGHT} {...props} />
  ),
  ThinkingError: (props) => (
    <DrawersIcon component={ICON_THINKING_ERROR} {...props} />
  ),
  ThinkingFork: (props) => (
    <DrawersIcon component={ICON_THINKING_FORK} {...props} />
  ),
  ThinkingListChecks: (props) => (
    <DrawersIcon component={ICON_THINKING_LIST_CHECKS} {...props} />
  ),
  ThinkingNormal: (props) => (
    <DrawersIcon component={ICON_THINKING_NORMAL} {...props} />
  ),
  ThinkingSearch: (props) => (
    <DrawersIcon component={ICON_THINKING_SEARCH} {...props} />
  ),
  ThinkingSuccess: (props) => (
    <DrawersIcon component={ICON_THINKING_SUCCESS} {...props} />
  ),
  ThinkingWarning: (props) => (
    <DrawersIcon component={ICON_THINKING_WARNING} {...props} />
  ),
  TrayArrowDown: (props) => (
    <DrawersIcon component={ICON_TRAY_ARROW_DOWN} {...props} />
  ),

  FindCheckCircle: (props) => (
    <DrawersIcon component={ICON_FIND_CHECK_CIRCLE} {...props} />
  ),
  FindCheckSquareOutline: (props) => (
    <DrawersIcon component={ICON_FIND_CHECK_SQUARE_OUTLINE} {...props} />
  ),
  FindNoCheckSquareOutline: (props) => (
    <DrawersIcon component={ICON_FIND_NO_CHECK_SQUARE_OUTLINE} {...props} />
  ),
  FindValidateFalse: (props) => (
    <DrawersIcon component={ICON_FIND_VALIDATE_FALSE} {...props} />
  ),
};
