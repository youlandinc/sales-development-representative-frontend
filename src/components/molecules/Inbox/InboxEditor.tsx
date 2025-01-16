import { forwardRef, useImperativeHandle, useState } from 'react';
import { CKEditorEventPayload, useCKEditor } from 'ckeditor4-react';
import { CKEditorInstance } from 'ckeditor4-react/dist/types';
import { Box } from '@mui/material';

type InboxEditorProps = {
  handleChange?: (e: CKEditorEventPayload<'change'>) => void;
};

export type InboxEditorForwardRefProps = {
  editInstance: CKEditorInstance;
};

export const InboxEditor = forwardRef<
  InboxEditorForwardRefProps,
  InboxEditorProps
>(({ handleChange }, ref) => {
  // const [editor, setEditor] = useState<CKEditorInstance | null>(null);
  const [element, setElement] = useState(null);
  const { editor, status } = useCKEditor({
    element,
    config: {
      versionCheck: false,
      extraPlugins: 'justify,font,colorbutton',
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
      //dispatchEvent,
    },
    subscribeTo: ['beforeLoad', 'instanceReady', 'change'],
  });

  useImperativeHandle(ref, () => ({
    editInstance: editor as CKEditorInstance,
  }));

  return <Box ref={setElement}></Box>;
});
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
