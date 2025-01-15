import { FC } from 'react';
import { Stack } from '@mui/material';
import { CKEditor } from 'ckeditor4-react';

import { InboxSide } from '@/components/organisms';

export const Inbox: FC = () => {
  return (
    <Stack border={'1px solid'} borderColor={'#E5E5E5'} flexDirection={'row'}>
      <InboxSide />
      <CKEditor
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
            { name: 'others' },
            { name: 'about' },
          ],
        }}
        initData="<p>This is an example CKEditor 4 WYSIWYG editor instance.</p>"
      />
    </Stack>
  );
};
