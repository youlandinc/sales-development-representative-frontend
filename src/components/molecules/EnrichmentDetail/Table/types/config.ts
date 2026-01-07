// ============================================================================
// Configuration Types
// ============================================================================

import { RefObject } from 'react';

export interface VirtualizationConfig {
  enabled?: boolean;
  rowHeight?: number;
  scrollContainer?: RefObject<HTMLDivElement | null>;
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
}
