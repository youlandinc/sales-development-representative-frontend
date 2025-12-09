# DialogActionsMenu Component

A comprehensive actions menu dialog component based on the Figma design (node-id: 18452:15274).

## Features

- **Search functionality**: Filter actions with a search input
- **Tab navigation**: Switch between Suggestions, Enrichments, and Exports
- **Collapsible sections**: Organize actions into expandable groups
- **Action items**: Display enrichment actions with icons, descriptions, and provider badges
- **Atlas Intelligence**: Special section for AI-powered tasks

## Usage

```tsx
import { DialogActionsMenu } from '@/components/molecules';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Actions Menu</button>
      <DialogActionsMenu
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Controls the dialog visibility |
| `onClose` | `() => void` | Yes | Callback when dialog is closed |

## Components Structure

### Base Components

- **StyledActionItem**: Individual action item with icon, title, description, and optional badges
- **StyledTabButton**: Tab button for switching between sections
- **StyledSearchInput**: Search input field with icon
- **StyledProviderBadges**: Overlapping provider logos display

### Icons

- **IconSuggestion**: Orange atom-style icon for suggestions
- **IconAtlas**: Purple sparkle icon for Atlas Intelligence

## Styling

All colors are based on the Figma design system:
- Text/main: #363440
- Text/secondary: #6F6C7D
- Gray/200: #F0F0F4
- Gray/300: #DFDEE6
- Gray/400: #D0CEDA
- Gray/500: #B0ADBD
- Warning: #F9A240
- Primary/500: #6E4EFB

## Integration Points

To integrate with actual data:

1. Replace mock provider images in `suggestionItems`
2. Add click handlers for each action item
3. Implement search filtering logic
4. Add content for Enrichments and Exports tabs
5. Connect to your enrichment data store

## Example with State Management

```tsx
import { DialogActionsMenu } from '@/components/molecules';
import { useProspectTableStore } from '@/stores/enrichment';

function EnrichmentActions() {
  const { dialogVisible, dialogType, closeDialog } = useProspectTableStore();
  
  return (
    <DialogActionsMenu
      open={dialogVisible && dialogType === 'actions_menu'}
      onClose={closeDialog}
    />
  );
}
```
