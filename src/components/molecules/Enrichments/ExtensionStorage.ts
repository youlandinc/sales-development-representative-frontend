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
