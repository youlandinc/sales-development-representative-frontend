'use client';

import { _uploadFile } from '@/request';
import { Editor } from '@tinymce/tinymce-react';
import { FC } from 'react';
import { SDRToast } from '../StyledToast';
import { Box } from '@mui/material';

interface StyledTinyEditorProps {
  onChange?: (dialogApi: any, details: any) => void;
  initialValue?: string;
}

export const StyledTinyEditor: FC<StyledTinyEditorProps> = ({
  onChange,
  initialValue,
}: StyledTinyEditorProps) => {
  if (!process.env.NEXT_PUBLIC_TINYMCE_API_KEY) {
    return null;
  }

  return (
    <Box sx={{ '& .tox-promotion': { display: 'none' } }}>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        init={{
          // 添加自定义按钮和菜单
          setup: (editor: any) => {
            // 添加自定义按钮
            editor.ui.registry.addButton('customInsertButton', {
              text: '自定义插入',
              icon: 'plus',
              onAction: () => {
                // 点击按钮时打开菜单
                editor.execCommand('customInsertMenu');
              },
            });

            // 添加自定义菜单
            editor.ui.registry.addMenuButton('customInsertMenu', {
              text: '自定义插入',
              icon: 'plus',
              fetch: (callback: any) => {
                const items = [
                  {
                    type: 'menuitem',
                    text: '插入签名',
                    onAction: () => {
                      editor.insertContent(
                        '<div class="signature">-- 您的签名 --</div>',
                      );
                    },
                  },
                  {
                    type: 'menuitem',
                    text: '插入模板1',
                    onAction: () => {
                      editor.insertContent('<p>这是模板1的内容</p>');
                    },
                  },
                  {
                    type: 'menuitem',
                    text: '插入模板2',
                    onAction: () => {
                      editor.insertContent('<p>这是模板2的内容</p>');
                    },
                  },
                ];
                callback(items);
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
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment| showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat|customInsertMenu',
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
              return '12323123';
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
        }}
        initialValue={initialValue}
        onEditorChange={onChange}
      />
    </Box>
  );
};
