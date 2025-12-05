'use client';
import { useShallow } from 'zustand/react/shallow';

import { Box } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { FC, useEffect } from 'react';

import { _uploadFile } from '@/request';

import { SDRToast } from '@/components/atoms/StyledToast';

import { useSettingsStore } from '@/stores/useSettingsStore';
import { TOOLBAR } from './data';

interface StyledTinyEditorProps {
  onChange?: (dialogApi: any, details: any) => void;
  value?: string;
  placeholder?: string;
  showSignatureButton?: boolean;
}

export const StyledTinyEditor: FC<StyledTinyEditorProps> = ({
  onChange,
  value,
  placeholder = 'Start typing here...',
  showSignatureButton = true,
}) => {
  const { signatures, fetchSignatures } = useSettingsStore(
    useShallow((state) => ({
      signatures: state.signatures,
      fetchSignatures: state.fetchSignatures,
    })),
  );

  useEffect(() => {
    if (showSignatureButton) {
      fetchSignatures();
    }
  }, [fetchSignatures, showSignatureButton]);

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

  return (
    <Box
      sx={(theme) => ({
        '& .tox-promotion': { display: 'none' },
        '& .tox-tinymce': {
          borderWidth: '1px !important',
          borderColor: '#D0CEDA !important',
        },
        '& .tox .tox-edit-area::before': {
          borderColor: `${theme.palette.text.default} !important`,
        },
      })}
    >
      <Editor
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
            if (signatures.length === 0 || !showSignatureButton) {
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
                  text: item.senderName,
                  onAction: () => {
                    editor.insertContent(item.signatureContent);
                  },
                }));
                callback(menus);
              },
            });
            const defaultPStyle = 'margin: 0; ';
            editor.on('GetContent', (e: any) => {
              const wrapper = document.createElement('div');
              wrapper.innerHTML = e.content;
              wrapper.querySelectorAll('p').forEach((p) => {
                if (!p.getAttribute('style')) {
                  p.setAttribute('style', defaultPStyle);
                }
              });
              e.content = wrapper.innerHTML;
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
          placeholder: placeholder,
          // 禁用顶部的 "Explore Trial" 提示
          promotion: false,
          // 禁用品牌标志
          branding: false,
          // 禁用元素路径显示
          elementpath: false,
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
              formData.append('bizType', 'FIRM_COMMON');
              const response = await _uploadFile(formData);
              if (Array.isArray(response.data)) {
                const urlWithToken = response.data[0].url.split('?')[0];
                return urlWithToken;
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
          // 保留样式属性
          allow_html_in_named_anchor: true,
          paste_data_images: true,
          menubar: false,
        }}
        licenseKey="gpl"
        onEditorChange={onChange}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        value={value}
      />
    </Box>
  );
};
