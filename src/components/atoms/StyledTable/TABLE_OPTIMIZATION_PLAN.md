# Table 组件优化方案

## 一、当前问题分析

### 1.1 Props层面问题

**核心文件**: `StyledTable.tsx`

#### 发现的问题：
- ✗ **类型不严格**: 大量使用 `any[]` 类型，缺乏类型安全
- ✗ **Props过多**: 16个props，职责不清晰
- ✗ **回调函数分散**: `onCellEdit`, `onColumnResize`, `onHeaderMenuClick` 等多个回调，缺乏统一的事件处理模式
- ✗ **配置对象扁平化**: `virtualization` 配置混在props中，应该独立管理

#### 具体位置：
```typescript
// src/components/atoms/StyledTable/StyledTable.tsx:50-92
interface StyledTableProps {
  columns: any[];                    // ❌ 应该定义严格的TableColumn类型
  data: any[];                       // ❌ 应该使用泛型 <TData>
  addMenuItems?: {...}[];            // ❌ 应该定义MenuItem类型
  onHeaderMenuClick?: ({...}) => void; // ❌ 事件处理类型过于复杂
  virtualization?: {...};            // ❌ 应该提取为VirtualizationConfig
  aiLoading?: Record<...>;           // ❌ 应该定义LoadingState类型
}
```

---

### 1.2 内部逻辑处理问题

**核心文件**: `StyledTable.tsx`, `useProspectTable.ts`

#### 发现的问题：

##### StyledTable组件：

1. **状态管理混乱** (Line 114-146)
   - ✗ 11个独立的useState，没有使用useReducer
   - ✗ 状态更新逻辑分散在各处
   - ✗ `cellState`, `headerState` 结构相似但独立管理

```typescript
// ❌ 当前实现
const [cellState, setCellState] = useState<{...} | null>(null);
const [headerState, setHeaderState] = useState<{...} | null>(null);
const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
const [headerMenuAnchor, setHeaderMenuAnchor] = useState<null | HTMLElement>(null);
const [aiRunMenuAnchor, setAiRunMenuAnchor] = useState<null | HTMLElement>(null);
// ... 还有6个state
```

2. **交互逻辑过于复杂** (Line 532-628)
   - ✗ `onHeaderClick` 函数包含80行代码，7层if-else嵌套
   - ✗ 状态转换逻辑不清晰，难以维护
   - ✗ 没有使用状态机模式

```typescript
// ❌ Line 532-628: 复杂的点击处理逻辑
const onHeaderClick = useCallback((e: MouseEvent, columnId: string) => {
  // 80行代码，包含多层嵌套的条件判断
  if (clickX > rightEdge - 12) { return; }
  if (columnSizingInfo.isResizingColumn) { ... }
  const isCurrentlyActive = ...;
  const isCurrentlyShowingMenu = ...;
  if (isCurrentlyActive && isCurrentlyShowingMenu && !headerState?.isEditing) { ... }
  if (hasActiveCellInCurrentColumn) { ... }
  // ... 更多条件
}, [...]);
```

3. **Meta对象职责过重** (Line 249-385)
   - ✗ 包含20+个方法，职责不清晰
   - ✗ 将UI状态管理、数据更新、AI处理混在一起
   - ✗ 难以测试和维护

```typescript
// ❌ Line 249-385: 臃肿的meta对象
meta: {
  updateData: ...,
  isEditing: ...,
  isActive: ...,
  hasActiveInRow: ...,
  setCellMode: ...,
  isAiLoading: ...,
  triggerAiProcess: ...,
  hasAiColumnInRow: ...,
  triggerBatchAiProcess: ...,
  triggerRelatedAiProcess: ...,
  getAiColumns: ...,
  onRunAi: ...,
  openAiRunMenu: ...,
  // ... 还有8个方法
}
```

4. **渲染函数过长** (Line 644-963)
   - ✗ `renderContent` 函数300+行
   - ✗ Header和Body渲染逻辑重复
   - ✗ Pinned cells和Virtual cells代码重复度高

##### useProspectTable Hook：

1. **Hook职责过重** (Line 45-673)
   - ✗ 单个Hook 600+行，包含太多职责
   - ✗ 数据加载、AI处理、虚拟化、WebSocket全在一起
   - ✗ 难以测试和复用

2. **状态同步问题** (Line 61-72)
   - ✗ 同时使用 `rowsMapRef` 和 `rowsMap` state
   - ✗ 容易造成数据不一致
   - ✗ 过多的useRef (6个) 表明状态设计有问题

```typescript
// ❌ 双重状态维护
const rowsMapRef = useRef<Record<string, any>>({});
const [rowsMap, setRowsMap] = useState<Record<string, any>>({});
// 在多处需要同时更新两者
rowsMapRef.current = {...};
setRowsMap(prev => ({...}));
```

3. **复杂的条件判断** (Line 350-423, 569-655)
   - ✗ `onAiProcess` 包含多层嵌套判断
   - ✗ `onRunAi` 包含复杂的if-else分支
   - ✗ 缺乏清晰的错误处理

---

### 1.3 组件协调问题

#### 发现的问题：

1. **组件通信方式混乱**
   - ✗ 通过meta对象传递方法
   - ✗ 通过props传递回调
   - ✗ 通过context传递状态
   - ❌ 缺乏统一的通信模式

2. **子组件props透传**
   - ✗ `StyledTableBodyCell` 接收10+个props
   - ✗ `StyledTableHeadCell` 接收15+个props
   - ✗ 很多props只是为了透传到更深层组件

3. **性能优化不足**
   - ✗ `renderContent` 的依赖数组包含12个依赖
   - ✗ `StyledTableBodyCell` 使用memo但效果有限
   - ✗ 缺少有效的性能监控

4. **调试代码未清理**
   - ✗ Line 760: `console.log(header)` 未删除

---

## 二、优化方案

### 阶段一：类型系统重构 (1-2天)

#### 目标：建立严格的类型系统，提高类型安全

#### 步骤：

**Step 1.1**: 创建类型定义文件
```typescript
// src/components/atoms/StyledTable/types.ts

// 列配置类型
export interface TableColumn<TData = any> {
  fieldId: string;
  fieldName: string;
  fieldType: TableColumnTypeEnum;
  actionKey?: string;
  width?: number;
  pin?: boolean;
  visible?: boolean;
  dependentFieldId?: string;
}

// 泛型数据类型
export type TableData<TData = any> = TData & {
  id: string;
  __loading?: boolean;
};

// AI字段值类型
export interface AiFieldValue {
  value: string;
  isFinished?: boolean;
  externalContent?: any;
}

// 加载状态类型
export type LoadingState = Record<string, Record<string, boolean>>;

// 虚拟化配置类型
export interface VirtualizationConfig {
  enabled?: boolean;
  rowHeight?: number;
  scrollContainer?: RefObject<HTMLDivElement | null>;
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
}

// 菜单项类型
export interface MenuItem {
  label: string;
  value: string;
  icon?: any;
  submenu?: MenuItem[];
}

// 事件处理类型
export type TableEventHandler = (event: TableEvent) => void;

export type TableEvent = 
  | { type: 'cell.edit'; recordId: string; fieldId: string; value: any }
  | { type: 'cell.click'; columnId: string; rowId: string; data: any }
  | { type: 'column.resize'; fieldId: string; width: number }
  | { type: 'column.pin'; columnId: string; pinned: boolean }
  | { type: 'column.visible'; columnId: string; visible: boolean }
  | { type: 'column.delete'; columnId: string }
  | { type: 'column.rename'; columnId: string; newName: string }
  | { type: 'ai.run'; params: AiRunParams }
  | { type: 'rows.add'; count: number };

// AI运行参数类型（使用discriminated union）
export type AiRunParams = 
  | { mode: 'single'; fieldId: string; recordId: string }
  | { mode: 'batch'; fieldId: string; recordCount?: number }
  | { mode: 'all'; fieldId: string };
```

**Step 1.2**: 重构Props接口
```typescript
// src/components/atoms/StyledTable/StyledTable.tsx

export interface StyledTableProps<TData = any> {
  // 数据相关
  columns: TableColumn[];
  rowIds: string[];
  data: TableData<TData>[];
  
  // 配置相关
  virtualization?: VirtualizationConfig;
  scrolled?: boolean;
  
  // AI相关
  aiLoading?: LoadingState;
  onAiProcess?: (recordId: string, columnId: string) => void;
  
  // 菜单相关
  addMenuItems?: MenuItem[];
  addRowsFooter?: ReactNode;
  
  // 统一事件处理
  onEvent: TableEventHandler;
}
```

**验收标准**：
- ✓ 所有 `any` 类型被具体类型替代
- ✓ 通过TypeScript严格模式检查
- ✓ IDE提供完整的类型提示

---

### 阶段二：状态管理重构 (2-3天)

#### 目标：使用useReducer统一状态管理，简化状态更新逻辑

#### 步骤：

**Step 2.1**: 定义状态类型和Actions
```typescript
// src/components/atoms/StyledTable/state.ts

export interface TableState {
  // Cell状态
  activeCell: { recordId: string; columnId: string; isEditing: boolean } | null;
  
  // Header状态
  activeHeader: { columnId: string; isEditing: boolean } | null;
  
  // Menu状态
  menu: {
    type: 'add' | 'header' | 'ai-run' | null;
    anchorEl: HTMLElement | null;
    columnId?: string;
  };
  
  // Column状态
  columnSizing: ColumnSizingState;
  columnPinning: ColumnPinningState;
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  
  // Row状态
  rowSelection: RowSelectionState;
}

export type TableAction =
  | { type: 'CELL_ACTIVATE'; payload: { recordId: string; columnId: string } }
  | { type: 'CELL_EDIT'; payload: { recordId: string; columnId: string } }
  | { type: 'CELL_CLEAR' }
  | { type: 'HEADER_ACTIVATE'; payload: { columnId: string } }
  | { type: 'HEADER_EDIT'; payload: { columnId: string } }
  | { type: 'HEADER_CLEAR' }
  | { type: 'MENU_OPEN'; payload: { type: 'add' | 'header' | 'ai-run'; anchorEl: HTMLElement; columnId?: string } }
  | { type: 'MENU_CLOSE' }
  | { type: 'COLUMN_RESIZE'; payload: ColumnSizingState }
  | { type: 'COLUMN_PIN'; payload: ColumnPinningState }
  | { type: 'COLUMN_VISIBILITY'; payload: VisibilityState }
  | { type: 'ROW_SELECTION'; payload: RowSelectionState };

export function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case 'CELL_ACTIVATE':
      return {
        ...state,
        activeCell: { ...action.payload, isEditing: false },
        activeHeader: { columnId: action.payload.columnId, isEditing: false },
        menu: { type: null, anchorEl: null },
      };
    
    case 'CELL_EDIT':
      return {
        ...state,
        activeCell: { ...action.payload, isEditing: true },
      };
    
    case 'CELL_CLEAR':
      return {
        ...state,
        activeCell: null,
        activeHeader: null,
      };
    
    case 'MENU_OPEN':
      return {
        ...state,
        menu: action.payload,
      };
    
    case 'MENU_CLOSE':
      return {
        ...state,
        menu: { type: null, anchorEl: null },
      };
    
    // ... 其他cases
    
    default:
      return state;
  }
}
```

**Step 2.2**: 使用useReducer重构组件
```typescript
// src/components/atoms/StyledTable/StyledTable.tsx

export const StyledTable: FC<StyledTableProps> = (props) => {
  const [state, dispatch] = useReducer(tableReducer, initialState);
  
  // 简化的事件处理
  const handleCellClick = useCallback((recordId: string, columnId: string) => {
    dispatch({ type: 'CELL_ACTIVATE', payload: { recordId, columnId } });
  }, []);
  
  const handleCellDoubleClick = useCallback((recordId: string, columnId: string) => {
    dispatch({ type: 'CELL_EDIT', payload: { recordId, columnId } });
  }, []);
  
  // ...
};
```

**Step 2.3**: 拆分useProspectTable Hook
```typescript
// src/components/molecules/ProspectDetail/hooks/useTableData.ts
export function useTableData(tableId: string) {
  // 只负责数据加载和管理
}

// src/components/molecules/ProspectDetail/hooks/useAiProcessing.ts
export function useAiProcessing(columns: TableColumn[], rowIds: string[]) {
  // 只负责AI处理逻辑
}

// src/components/molecules/ProspectDetail/hooks/useVirtualization.ts
export function useVirtualization(config: VirtualizationConfig) {
  // 只负责虚拟化相关逻辑
}

// 主Hook变为组合器
export function useProspectTable(tableId: string) {
  const tableData = useTableData(tableId);
  const aiProcessing = useAiProcessing(tableData.columns, tableData.rowIds);
  const virtualization = useVirtualization(config);
  
  return {
    ...tableData,
    ...aiProcessing,
    ...virtualization,
  };
}
```

**验收标准**：
- ✓ 状态更新逻辑集中在reducer中
- ✓ 组件代码减少30%以上
- ✓ 状态转换清晰可追踪

---

### 阶段三：交互逻辑优化 (2天)

#### 目标：使用状态机模式简化复杂的交互逻辑

#### 步骤：

**Step 3.1**: 实现Header点击状态机
```typescript
// src/components/atoms/StyledTable/stateMachines/headerClickMachine.ts

type HeaderClickState = 
  | 'idle'
  | 'active'
  | 'showing-menu'
  | 'editing'
  | 'resizing';

type HeaderClickEvent = 
  | { type: 'CLICK' }
  | { type: 'DOUBLE_CLICK' }
  | { type: 'RIGHT_CLICK' }
  | { type: 'START_RESIZE' }
  | { type: 'CLOSE_MENU' };

export function createHeaderClickMachine() {
  const machine = {
    idle: {
      CLICK: 'showing-menu',
      RIGHT_CLICK: 'showing-menu',
      START_RESIZE: 'resizing',
    },
    active: {
      CLICK: 'showing-menu',
      DOUBLE_CLICK: 'editing',
    },
    'showing-menu': {
      CLICK: 'editing',
      CLOSE_MENU: 'active',
    },
    editing: {
      // ...
    },
    resizing: {
      // ...
    },
  };
  
  return {
    transition(state: HeaderClickState, event: HeaderClickEvent): HeaderClickState {
      return machine[state]?.[event.type] || state;
    },
  };
}
```

**Step 3.2**: 应用状态机简化onHeaderClick
```typescript
const headerMachine = createHeaderClickMachine();

const onHeaderClick = useCallback((e: MouseEvent, columnId: string) => {
  // 简化为几行代码
  const newState = headerMachine.transition(
    state.activeHeader?.state || 'idle',
    { type: 'CLICK' }
  );
  
  dispatch({
    type: 'HEADER_STATE_CHANGE',
    payload: { columnId, state: newState },
  });
}, []);
```

**验收标准**：
- ✓ onHeaderClick代码行数减少80%
- ✓ 状态转换逻辑清晰可视化
- ✓ 易于添加新的交互状态

---

### 阶段四：组件拆分与渲染优化 (2-3天)

#### 目标：拆分大组件，提取渲染逻辑，优化性能

#### 步骤：

**Step 4.1**: 拆分renderContent为独立组件
```typescript
// src/components/atoms/StyledTable/TableHeader.tsx
export const TableHeader: FC<TableHeaderProps> = memo((props) => {
  // 只负责Header渲染
});

// src/components/atoms/StyledTable/TableBody.tsx
export const TableBody: FC<TableBodyProps> = memo((props) => {
  // 只负责Body渲染
});

// src/components/atoms/StyledTable/StyledTable.tsx
const renderContent = useCallback((virtualProps) => (
  <>
    <TableHeader {...headerProps} />
    <TableBody {...bodyProps} />
  </>
), [headerProps, bodyProps]);
```

**Step 4.2**: 提取Cell渲染逻辑
```typescript
// src/components/atoms/StyledTable/CellRenderer.tsx
export const CellRenderer: FC<CellRendererProps> = memo((props) => {
  const { cell, isPinned } = props;
  
  // 统一的Cell渲染逻辑，减少重复
  return (
    <StyledTableBodyCell
      {...getCellProps(cell, isPinned)}
    />
  );
});

// 使用工厂函数减少重复
function getCellProps(cell: Cell, isPinned: boolean) {
  return {
    cell,
    isPinned,
    stickyLeft: isPinned ? calculateStickyLeft(cell) : 0,
    // ... 其他props
  };
}
```

**Step 4.3**: 优化性能
```typescript
// 1. 使用useMemo缓存计算结果
const pinnedColumns = useMemo(
  () => columns.filter(col => col.pin),
  [columns]
);

// 2. 使用React.memo + arePropsEqual精确控制重渲染
export const StyledTableBodyCell = memo(
  (props) => { /* ... */ },
  (prev, next) => {
    // 精确比较，只在真正需要时重渲染
    return isShallowEqual(prev, next);
  }
);

// 3. 使用虚拟化减少DOM节点
// 已经在使用，但可以优化overscan配置
```

**验收标准**：
- ✓ renderContent函数减少到100行以内
- ✓ 组件渲染次数减少50%
- ✓ 滚动性能提升（FPS > 55）

---

### 阶段五：Meta对象重构 (1-2天)

#### 目标：拆分meta对象，使用Context替代

#### 步骤：

**Step 5.1**: 创建专门的Context
```typescript
// src/components/atoms/StyledTable/contexts/TableEditContext.tsx
export const TableEditContext = createContext<TableEditContextValue | null>(null);

export function useTableEdit() {
  const context = useContext(TableEditContext);
  if (!context) throw new Error('useTableEdit must be used within TableEditProvider');
  return context;
}

export function TableEditProvider({ children }: PropsWithChildren) {
  const [editState, setEditState] = useState<EditState | null>(null);
  
  const startEdit = useCallback((recordId: string, columnId: string) => {
    setEditState({ recordId, columnId });
  }, []);
  
  const stopEdit = useCallback(() => {
    setEditState(null);
  }, []);
  
  const value = useMemo(() => ({
    editState,
    startEdit,
    stopEdit,
  }), [editState, startEdit, stopEdit]);
  
  return (
    <TableEditContext.Provider value={value}>
      {children}
    </TableEditContext.Provider>
  );
}

// 类似的创建：
// - TableAiContext
// - TableColumnContext
// - TableSelectionContext
```

**Step 5.2**: 使用自定义Hook替代Meta方法
```typescript
// src/components/atoms/StyledTable/hooks/useTableCell.ts
export function useTableCell(recordId: string, columnId: string) {
  const { editState, startEdit, stopEdit } = useTableEdit();
  const { aiState } = useTableAi();
  const { columnMeta } = useTableColumn(columnId);
  
  const isEditing = editState?.recordId === recordId && editState?.columnId === columnId;
  const isAiLoading = aiState[recordId]?.[columnId] ?? false;
  
  return {
    isEditing,
    isAiLoading,
    columnMeta,
    startEdit: () => startEdit(recordId, columnId),
    stopEdit,
  };
}

// 在Cell组件中使用
const StyledTableBodyCell: FC = (props) => {
  const { cell } = props;
  const { isEditing, startEdit, stopEdit } = useTableCell(
    cell.row.id,
    cell.column.id
  );
  
  // 清晰简洁的逻辑
};
```

**验收标准**：
- ✓ Meta对象方法数量减少60%
- ✓ 职责清晰分离
- ✓ 更容易进行单元测试

---

### 阶段六：事件系统统一 (1天)

#### 目标：统一事件处理，简化回调函数

#### 步骤：

**Step 6.1**: 实现事件总线
```typescript
// src/components/atoms/StyledTable/hooks/useTableEventBus.ts

export function useTableEventBus(onEvent: TableEventHandler) {
  const emit = useCallback((event: TableEvent) => {
    onEvent(event);
  }, [onEvent]);
  
  return {
    emitCellEdit: (recordId: string, fieldId: string, value: any) =>
      emit({ type: 'cell.edit', recordId, fieldId, value }),
    
    emitColumnResize: (fieldId: string, width: number) =>
      emit({ type: 'column.resize', fieldId, width }),
    
    emitAiRun: (params: AiRunParams) =>
      emit({ type: 'ai.run', params }),
    
    // ... 其他事件emitter
  };
}
```

**Step 6.2**: 在父组件统一处理事件
```typescript
// src/components/molecules/ProspectDetail/index.tsx

const ProspectDetail: FC = () => {
  const handleTableEvent = useCallback((event: TableEvent) => {
    switch (event.type) {
      case 'cell.edit':
        updateCellValue(event.recordId, event.fieldId, event.value);
        break;
      
      case 'column.resize':
        saveColumnWidth(event.fieldId, event.width);
        break;
      
      case 'ai.run':
        runAiProcess(event.params);
        break;
      
      // ... 集中处理所有事件
    }
  }, []);
  
  return (
    <StyledTable
      {...tableProps}
      onEvent={handleTableEvent}
    />
  );
};
```

**验收标准**：
- ✓ Props从16个减少到8个以内
- ✓ 事件处理逻辑集中在一处
- ✓ 更容易添加事件日志和追踪

---

### 阶段七：文档和测试 (2天)

#### 目标：完善文档，添加测试

#### 步骤：

**Step 7.1**: 编写API文档
```markdown
# StyledTable API文档

## Props

### columns: TableColumn[]
列配置数组，每个列包含：
- fieldId: 唯一标识
- fieldName: 显示名称
- fieldType: 列类型
...

### onEvent: TableEventHandler
统一的事件处理函数，接收TableEvent类型参数
...

## 事件类型

### cell.edit
当单元格编辑完成时触发
...
```

**Step 7.2**: 编写单元测试
```typescript
// src/components/atoms/StyledTable/__tests__/StyledTable.test.tsx

describe('StyledTable', () => {
  it('should render columns correctly', () => {
    // ...
  });
  
  it('should handle cell edit event', () => {
    // ...
  });
  
  it('should manage cell state with reducer', () => {
    // ...
  });
});

// src/components/atoms/StyledTable/__tests__/tableReducer.test.ts
describe('tableReducer', () => {
  it('should activate cell', () => {
    const state = initialState;
    const action = { type: 'CELL_ACTIVATE', payload: { recordId: '1', columnId: 'col1' } };
    const newState = tableReducer(state, action);
    expect(newState.activeCell).toEqual({ recordId: '1', columnId: 'col1', isEditing: false });
  });
});
```

**Step 7.3**: 性能测试
```typescript
// src/components/atoms/StyledTable/__tests__/performance.test.tsx

describe('StyledTable Performance', () => {
  it('should render 1000 rows in < 100ms', () => {
    // ...
  });
  
  it('should handle scroll with < 16ms frame time', () => {
    // ...
  });
});
```

**验收标准**：
- ✓ API文档完整清晰
- ✓ 测试覆盖率 > 80%
- ✓ 性能基准测试通过

---

## 三、实施时间表

| 阶段 | 工作内容 | 预计时间 | 负责人 |
|------|---------|---------|--------|
| **阶段一** | 类型系统重构 | 1-2天 | TBD |
| **阶段二** | 状态管理重构 | 2-3天 | TBD |
| **阶段三** | 交互逻辑优化 | 2天 | TBD |
| **阶段四** | 组件拆分与渲染优化 | 2-3天 | TBD |
| **阶段五** | Meta对象重构 | 1-2天 | TBD |
| **阶段六** | 事件系统统一 | 1天 | TBD |
| **阶段七** | 文档和测试 | 2天 | TBD |
| **总计** | | **11-15天** | |

---

## 四、风险评估与应对

### 风险1: 大规模重构可能影响现有功能
**应对**：
- 采用渐进式重构，每个阶段独立
- 每个阶段完成后进行完整回归测试
- 使用feature flag控制新旧代码切换

### 风险2: 性能优化可能引入新问题
**应对**：
- 建立性能基准测试
- 使用React DevTools Profiler持续监控
- 准备回滚方案

### 风险3: 类型重构可能破坏现有集成
**应对**：
- 先添加类型，不修改运行时逻辑
- 提供兼容层过渡
- 与团队充分沟通变更

---

## 五、预期收益

### 代码质量
- ✓ 代码行数减少 30-40%
- ✓ 圈复杂度降低 50%
- ✓ 类型安全性提升 100%

### 可维护性
- ✓ 新功能开发时间减少 40%
- ✓ Bug修复时间减少 50%
- ✓ 代码评审效率提升 60%

### 性能
- ✓ 首次渲染时间减少 20%
- ✓ 滚动性能提升 30%
- ✓ 内存占用减少 15%

### 开发体验
- ✓ IDE提示准确度提升 90%
- ✓ 单元测试覆盖率 > 80%
- ✓ 文档完整性 100%

---

## 六、后续规划

### 短期 (1-2个月)
- 监控优化效果
- 收集团队反馈
- 修复遗留问题

### 中期 (3-6个月)
- 应用优化模式到其他组件
- 建立组件库最佳实践
- 培训团队成员

### 长期 (6个月+)
- 持续性能监控和优化
- 定期技术债务清理
- 探索新的优化技术

---

## 附录

### A. 关键代码位置清单

| 文件 | 行数 | 问题 | 优先级 |
|------|------|------|--------|
| StyledTable.tsx | 50-92 | Props类型不严格 | P0 |
| StyledTable.tsx | 114-146 | 状态管理混乱 | P0 |
| StyledTable.tsx | 532-628 | 交互逻辑复杂 | P1 |
| StyledTable.tsx | 249-385 | Meta对象臃肿 | P1 |
| StyledTable.tsx | 644-963 | 渲染函数过长 | P2 |
| StyledTable.tsx | 760 | 调试代码未清理 | P3 |
| useProspectTable.ts | 45-673 | Hook职责过重 | P0 |
| useProspectTable.ts | 61-72 | 状态同步问题 | P1 |

### B. 参考资料

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [XState - State Machines](https://xstate.js.org/)
- [TanStack Table Documentation](https://tanstack.com/table/v8)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

**文档版本**: v1.0
**创建日期**: 2025-11-10
**最后更新**: 2025-11-10
