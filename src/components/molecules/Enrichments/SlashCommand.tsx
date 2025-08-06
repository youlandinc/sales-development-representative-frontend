import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import React from 'react';
import { createPortal } from 'react-dom';
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
} from '@mui/material';

export const SlashCommand = Extension.create({
  name: 'slash-command',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: true,

        items: ({ query }) => {
          return [
            {
              title: 'Heading 1',
              command: ({ editor }) =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            },
            {
              title: 'Bullet List',
              command: ({ editor }) =>
                editor.chain().focus().toggleBulletList().run(),
            },
            {
              title: 'Quote',
              command: ({ editor }) =>
                editor.chain().focus().toggleBlockquote().run(),
            },
          ].filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()),
          );
        },

        render: () => {
          let reactRenderer;
          let popup = document.createElement('div');
          document.body.appendChild(popup);

          return {
            onStart: (props) => {
              reactRenderer = new ReactRenderer(SlashMenu, {
                props,
                element: popup,
              });
            },
            onUpdate(props) {
              reactRenderer?.updateProps(props);
            },
            onKeyDown(props) {
              return reactRenderer?.ref?.onKeyDown(props) ?? false;
            },
            onExit() {
              reactRenderer?.destroy();
              popup.remove();
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [Suggestion(this.options.suggestion)];
  },
});

function ReactRenderer(Component, { props, element }) {
  let ref = null;

  const update = (newProps) => {
    ref?.updateProps?.(newProps);
  };

  const destroy = () => {
    ref = null;
    ReactDOM.unmountComponentAtNode(element);
  };

  ReactDOM.render(<Component {...props} ref={(r) => (ref = r)} />, element);

  return { destroy, updateProps: update, ref };
}

const SlashMenu = React.forwardRef(({ items, command, clientRect }, ref) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const anchorEl = React.useRef({ getBoundingClientRect: clientRect });

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % items.length);
        return true;
      }
      if (event.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === 'Enter') {
        command(items[selectedIndex]);
        return true;
      }
      return false;
    },
  }));

  if (!clientRect) return null;

  return createPortal(
    <Popper open anchorEl={anchorEl.current} placement="bottom-start">
      <Paper sx={{ minWidth: 200 }}>
        <List dense>
          {items.map((item, i) => (
            <ListItemButton
              key={i}
              selected={i === selectedIndex}
              onClick={() => command(item)}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Popper>,
    document.body,
  );
});
