'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  CKBox,
  CKBoxImageEdit,
  // ClassicEditor,
  CloudServices,
  Emoji,
  Essentials,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Mention,
  Paragraph,
  PasteFromOffice,
  PictureEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
} from 'ckeditor5';

export const StyledCkEditor = (props: {
  data: string;
  onChange: (content: string) => void;
}) => {
  const editorConfiguration = {
    licenseKey: 'GPL',
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      // 'underline',
      '|',
      // 'emoji',
      'link',
      'insertImage',
      'mediaEmbed',
      'insertTable',
      'blockQuote',
      '|',
      'bulletedList',
      'numberedList',
      // 'todoList',
      'outdent',
      'indent',

      'undo', //撤销
      'redo', //重做
    ],
  };

  return (
    <CKEditor
      config={editorConfiguration}
      data={props.data}
      editor={ClassicEditor}
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
    />
  );
};
