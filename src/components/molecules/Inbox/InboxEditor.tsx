import { FC, RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { CKEditor, CKEditorEventPayload, useCKEditor } from 'ckeditor4-react';
import { CKEditorInstance } from 'ckeditor4-react/dist/types';

// import './defaultEditorCss.css';

type InboxEditorProps = {
  handleChange?: (e: CKEditorEventPayload<'change'>) => void;
  initData?: string;
  config?: Record<string, any>;
  ref?: RefObject<InboxEditorForwardRefProps | null>;
  onInstanceReadyCb?: (editor: CKEditorInstance) => void;
};

export type InboxEditorForwardRefProps = {
  editInstance: CKEditorInstance;
};

export const InboxEditor: FC<InboxEditorProps> = ({
  handleChange,
  initData,
  config,
  ref,
  onInstanceReadyCb,
}) => {
  // const [initValue, setInitValue] = useState<string>('');
  const [editor, setEditor] = useState<CKEditorInstance | null>(null);
  // const { visible, close, open } = useSwitch();
  // const [element, setElement] = useState(null);
  /*const { editor, status } = useCKEditor({
    element,
    config: {
      versionCheck: false,
      uiColor: '#FFFFFF',
      extraPlugins: 'justify,font,colorbutton,editorplaceholder',
      editorplaceholder: 'Start typing here...',
      toolbarGroups: [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
        { name: 'forms' },
        // '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        {
          name: 'paragraph',
          groups: ['list', 'indent', 'blocks', 'align', 'bidi'], // 'align' -> 'justify' plugin
        },
        { name: 'links' },
        { name: 'insert' },
        // '/',
        { name: 'styles' }, // 'font and fontsize' -> 'font' plugin
        { name: 'colors' }, // 'colors' -> 'colorbutton' plugin
        { name: 'tools' },
      ],
      contentsCss: ['/css/editorCss.css'],
      style: {
        border: 'none',
      },
    },
    subscribeTo: ['beforeLoad', 'instanceReady', 'change'],
  });*/

  // if (editor) {
  //   editor.addCommand('mySimpleCommand', {
  //     exec: function (edt) {
  //       alert(edt.getData());
  //     },
  //   });
  //   editor.ui.addButton('SuperButton', {
  //     label: 'Click me',
  //     command: 'mySimpleCommand',
  //     toolbar: 'insert',
  //     icon: 'https://avatars1.githubusercontent.com/u/5500999?v=2&s=16',
  //   });
  // }
  useImperativeHandle(ref, () => ({
    editInstance: editor as CKEditorInstance,
  }));

  useEffect(() => {
    if (editor && typeof initData === 'string') {
      editor.setData(initData);
    }
  }, [initData, editor]);

  return (
    <CKEditor
      config={{
        versionCheck: false,
        require: true,
        fontSize_defaultLabel: '12px',
        addCss: 'p {font-size:12px;margin:0;line-height:1.8;}',
        stylesSet: [
          {
            name: 'Line Height 1.5',
            element: 'p',
            styles: {
              'line-height': '1.5',
              margin: '0',
            },
          },
          {
            name: 'Line Height 2.0',
            element: 'p',
            styles: {
              'line-height': '2.0',
              margin: '0',
            },
          },
        ],
        uiColor: '#FFFFFF',
        extraPlugins: 'justify,font,colorbutton,editorplaceholder',
        editorplaceholder: 'Start typing here...',
        toolbarGroups: [
          // { name: 'document', groups: ['mode', 'document', 'doctools'] },
          // { name: 'clipboard', groups: ['clipboard', 'undo'] },
          { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
          { name: 'forms' },
          // '/',
          { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
          {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi'], // 'align' -> 'justify' plugin
          },
          { name: 'links' },
          { name: 'insert' },
          // '/',
          { name: 'styles' }, // 'font and fontsize' -> 'font' plugin
          { name: 'colors' }, // 'colors' -> 'colorbutton' plugin
          // { name: 'tools' },
        ],
        contentsCss: ['/css/editorCss.css'],
        ...config,
      }}
      // initData={initData}
      onBeforeLoad={() => {
        // open();
      }}
      onChange={handleChange}
      onInstanceReady={(event) => {
        // close();
        setEditor(event.editor as unknown as CKEditorInstance);
        // const iframe = document?.querySelector('.cke_reset iframe');
        // if (iframe) {
        //   console.log(iframe);
        // }
        onInstanceReadyCb?.(event.editor as unknown as CKEditorInstance);
      }}
    />
  );
  // return <Box ref={setElement}></Box>;
};
/*<CKEditor
      config={{
        versionCheck: false,
        extraPlugins: 'justify,font,colorbutton',
        toolbarGroups: [
          { name: 'document', groups: ['mode', 'document', 'doctools'] },
          { name: 'clipboard', groups: ['clipboard', 'undo'] },
          { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
          { name: 'forms' },
          '/',
          { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
          {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi'], // 'align' -> 'justify' plugin
          },
          { name: 'links' },
          { name: 'insert' },
          '/',
          { name: 'styles' }, // 'font and fontsize' -> 'font' plugin
          { name: 'colors' }, // 'colors' -> 'colorbutton' plugin
          { name: 'tools' },
        ],
      }}
      onChange={handleChange}
      onInstanceReady={(event) => {
        setEditor(event.editor as unknown as CKEditorInstance);
      }}
    />*/
