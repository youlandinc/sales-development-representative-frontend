'use client';

import { Box, Skeleton } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { FC, useEffect, useRef } from 'react';

import { _uploadFile } from '@/request';

import { SDRToast } from '@/components/atoms/StyledToast';

import { useSettingsStore } from '@/stores/useSettingsStore';
import { TOOLBAR } from './data';

interface StyledTinyEditorProps {
  onChange?: (dialogApi: any, details: any) => void;
  value?: string;
}

export const StyledTinyEditor: FC<StyledTinyEditorProps> = ({
  onChange,
  value,
}: StyledTinyEditorProps) => {
  const { signatures, fetchSignatures, fetchSignatureLoading } =
    useSettingsStore();

  const editorRef = useRef<any>(null);

  useEffect(() => {
    fetchSignatures();
  }, [fetchSignatures]);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as Element;
      if (target.closest('.tox-dialog')) {
        e.stopImmediatePropagation();
      }
    };
    document.addEventListener('focusin', handleFocusIn);

    // Cleanup function to remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  if (!process.env.NEXT_PUBLIC_TINYMCE_API_KEY) {
    return null;
  }

  if (fetchSignatureLoading) {
    return <Skeleton height={200} />;
  }

  return (
    <Box
      sx={{
        '& .tox-promotion': { display: 'none' },
        '& .tox-tinymce': {
          borderWidth: '1px !important',
          borderColor: '#D0CEDA !important',
        },
      }}
    >
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        init={{
          content_style:
            'p { margin: 0;font-size:12px } body::before { font-size:12px }',
          font_size_formats:
            '8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 48px',
          default_font_size: '12px',
          toolbar_mode: 'sliding',
          ui_mode: 'split',
          // 添加自定义按钮和菜单
          setup: (editor: any) => {
            if (signatures.length === 0) {
              return;
            }
            // 添加自定义按钮
            editor.ui.registry.addButton('customInsertButton', {
              text: 'Email signature',
              icon: 'plus',
              onAction: () => {
                // 点击按钮时打开菜单
                editor.execCommand('customInsertMenu');
              },
            });

            // 添加自定义菜单
            editor.ui.registry.addMenuButton('customInsertMenu', {
              text: 'Email signature',
              icon: 'plus',
              fetch: (callback: any) => {
                const menus = signatures.map((item) => ({
                  type: 'menuitem',
                  text: item.name,
                  onAction: () => {
                    editor.insertContent(item.content);
                  },
                }));
                callback(menus);
              },
            });
          },
          plugins: [
            // Core editing features
            'anchor',
            'autolink',
            'charmap',
            'codesample',
            'emoticons',
            'link',
            'lists',
            'media',
            'searchreplace',
            'table',
            'visualblocks',
            'wordcount',
            'image',
            // Your account includes a free trial of TinyMCE premium features
            // Try the most popular premium features until Nov 6, 2025:
            //   'checklist',
            //   'mediaembed',
            //   'casechange',
            //   'formatpainter',
            //   'pageembed',
            //   'a11ychecker',
            //   'tinymcespellchecker',
            //   'permanentpen',
            //   'powerpaste',
            //   'advtable',
            //   'advcode',
            //   'advtemplate',
            //   //   'uploadcare',
            //   'mentions',
            //   'tinycomments',
            //   'tableofcontents',
            //   'footnotes',
            //   'mergetags',
            //   'autocorrect',
            //   'typography',
            //   'inlinecss',
            //   'markdown',
            //   'importword',
            //   'exportword',
            //   'exportpdf',
          ],
          toolbar:
            signatures && signatures.length > 0
              ? TOOLBAR + ' | customInsertMenu'
              : TOOLBAR,
          // toolbar:
          // 'undo redo | styles | bold italic | link image emoticons | anchor | autolink | charmap | codesample | emoticons | link | lists | media | searchreplace | table | visualblocks | wordcount',
          // toolbar: false,
          tinycomments_mode: 'embedded',
          // tinycomments_author: 'Author name',
          // mergetags_list: [
          //   { value: 'First.Name', title: 'First Name' },
          //   { value: 'Email', title: 'Email' },
          // ],
          // uploadcare_public_key: 'd198ba221e0237f6d192',
          placeholder: 'Start typing here...',
          // 禁用顶部的 "Explore Trial" 提示
          promotion: false,
          // 禁用品牌标志
          branding: false,
          // 禁用帮助菜单
          // help_tabs: [],
          // 禁用状态栏
          // statusbar: false,
          images_upload_handler: async (blobInfo: any) => {
            try {
              const formData = new FormData();
              const file = new File([blobInfo.blob()], blobInfo.filename(), {
                type: blobInfo.blob().type,
              });
              formData.append('files', file);
              const response = await _uploadFile(formData);
              if (Array.isArray(response.data)) {
                return response.data[0].url;
              }
              return '';
            } catch (err) {
              const { message, header, variant } = err as HttpError;
              SDRToast({
                message,
                header,
                variant,
              });
            }
          },
          // 允许的文件类型
          images_file_types: 'jpeg,jpg,png,gif,webp',
          // 文件大小限制 (10MB)
          images_max_size: 10485760,
          menubar: false,
          style_formats: [
            {
              title: 'Image Left',
              selector: 'img',
              styles: {
                float: 'left',
                margin: '0 10px 0 10px',
              },
            },
            {
              title: 'Image Right',
              selector: 'img',
              styles: {
                float: 'right',
                margin: '0 10px 0 10px',
              },
            },
          ],
        }}
        value={value}
        onEditorChange={onChange}
        onInit={(evt, editor) => {
          editorRef.current = editor; // 保存编辑器实例
        }}
      />
    </Box>
  );
};
