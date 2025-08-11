import { Extension } from '@tiptap/core';

export const ExtensionStorage = Extension.create({
  name: 'sharedSwitch',

  addStorage() {
    return {
      checked: false,
      setChecked(value: boolean) {
        this.checked = value;
        // 触发事件或其它通知逻辑可以放这里
        if (this.onChange) {
          this.onChange(value);
        }
      },
      onChange: undefined as undefined | ((value: boolean) => void),
      subscribe(cb: (value: boolean) => void) {
        this.onChange = cb;
      },
      unsubscribe() {
        this.onChange = undefined;
      },
    };
  },
});

/*
import { Extension } from '@tiptap/core';

export const ExtensionStorage = Extension.create({
  name: 'sharedSwitchStorage',
  addOptions() {
    return {
      checked: true,
      setChecked: () => {},
    };
  },
  addStorage() {
    return {
      checked: true, //this.options.checked,
    };
  },
  addCommands() {
    return {
      setChecked: (val: boolean) => () => {
        this.storage.checked = val;
        this.options.setChecked(val); // 通知外部
        return true;
      },
    };
  },
  // addStorage() {
  //   return {
  //     checked: true,
  //   };
  // },

  // // In SharedSwitchExtension
  // addCommands() {
  //   return {
  //     toggleChecked:
  //       (value: boolean) =>
  //       ({ editor }) => {
  //         editor.storage.sharedSwitchStorage.checked = value;
  //         return true;
  //       },
  //   };
  // },
});
*/
