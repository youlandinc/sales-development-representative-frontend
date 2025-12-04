import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { CommandsListProps } from '@/types';

export const CommandsList: FC<CommandsListProps> = memo(
  ({ items, command }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);
    const itemsRef = useRef<HTMLDivElement>(null);

    const scrollToItem = useCallback((index: number) => {
      if (itemsRef.current && itemsRef.current.children[index]) {
        (itemsRef.current.children[index] as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }, []);

    const selectItem = useCallback(
      (index: number) => {
        if (items.length > 0 && items[0].title !== 'No results found') {
          setSelectedIndex(index);
          scrollToItem(index);
        }
      },
      [items, scrollToItem],
    );

    const upHandler = useCallback(() => {
      setIsKeyboardActive(true);
      if (selectedIndex !== null) {
        selectItem((selectedIndex - 1 + items.length) % items.length);
      } else if (items.length > 0) {
        selectItem(items.length - 1);
      }
    }, [items, selectedIndex, selectItem]);

    const downHandler = useCallback(() => {
      setIsKeyboardActive(true);
      if (selectedIndex !== null) {
        selectItem((selectedIndex + 1) % items.length);
      } else if (items.length > 0) {
        selectItem(0);
      }
    }, [items, selectedIndex, selectItem]);

    const enterHandler = useCallback(() => {
      if (selectedIndex !== null) {
        const item = items[selectedIndex];
        if (item && !item.disabled && typeof command === 'function') {
          command(item);
          return true;
        }
      }
      return false;
    }, [selectedIndex, items, command]);

    const onClickToSelectItem = useCallback(
      (item: (typeof items)[number]) => {
        setIsKeyboardActive(false);
        command(item);
      },
      [command],
    );

    const onMouseEnterItem = useCallback(() => {
      if (isKeyboardActive) {
        setIsKeyboardActive(false);
        setSelectedIndex(null);
      }
    }, [isKeyboardActive]);

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          upHandler();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          downHandler();
        } else if (event.key === 'Enter') {
          event.preventDefault();
          if (enterHandler()) {
            event.stopPropagation();
          }
        }
      };

      document.addEventListener('keydown', onKeyDown, true);
      return () => {
        document.removeEventListener('keydown', onKeyDown, true);
      };
    }, [upHandler, downHandler, enterHandler]);

    return (
      <div className="slash-menu" ref={itemsRef}>
        {items.map((item, index) => {
          return (
            <button
              className={`slash-menu__item ${
                isKeyboardActive && index === selectedIndex
                  ? 'slash-menu__item--selected'
                  : ''
              } ${item.disabled ? 'slash-menu__item--disabled' : ''}`}
              disabled={item.disabled}
              key={index}
              onClick={() => onClickToSelectItem(item)}
              onMouseEnter={onMouseEnterItem}
            >
              {item.icon && item.icon}
              <span className="slash-menu__item-title">{item.title}</span>
            </button>
          );
        })}
      </div>
    );
  },
);

CommandsList.displayName = 'CommandsList';
