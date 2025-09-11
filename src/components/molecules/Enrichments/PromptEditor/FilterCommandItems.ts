import { DefaultCommandItems } from './DefaultCommandItems';
import { CommandItem } from '@/types';

export const FilterCommandItems = (
  query: string | undefined,
  commandItems: CommandItem[] = DefaultCommandItems,
): CommandItem[] => {
  const normalizedQuery = query?.toLowerCase().trim() ?? '';

  if (!normalizedQuery) {
    return commandItems;
  }

  const matchingItems = commandItems.filter((item) => {
    const title = item.title.toLowerCase();
    return (
      title.includes(normalizedQuery) ||
      normalizedQuery.split(' ').every((word) => title.includes(word))
    );
  });

  return matchingItems.length > 0
    ? matchingItems
    : [{ title: 'No results found', disabled: true, command: () => {} }];
};
