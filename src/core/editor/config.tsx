// @ts-nocheck
import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import InlineCode from '@editorjs/inline-code';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import Raw from '@editorjs/raw';
import Delimiter from '@editorjs/delimiter';

import Component from './component/index';
import Button from './button/index';
import { API, keyToken } from '@utils';

const inlineToolbar = ['bold', 'italic', 'underline', 'link', 'inlineCode', 'marker'];
export const editorjsConfig: any = {
  defaultBlock: 'paragraph',
  tools: {
    embed: {
      class: Embed,
      config: {
        services: {
          youtube: true,
          coub: true,
          facebook: true,
          instagram: true,
          twitter: true,
          twitch: true,
          miro: true,
          vimeo: true,
          gfycat: true,
          imgur: true,
          vine: true,
          aparat: true,
          codePen: true,
          pinterest: true,
        },
      },
    },
    inlineCode: { class: InlineCode },
    marker: { class: Marker },
    underline: { class: Underline },

    paragraph: {
      class: Paragraph,
      inlineToolbar,
    },
    header: {
      class: Header,
      inlineToolbar,
      config: {
        levels: [3, 4, 5, 6],
        defaultLevel: 4,
      },
    },
    image: {
      class: Image,
      config: {
        captionPlaceholder: 'Alt text',
        uploader: {
          async uploadByFile(file) {
            const bodyFormData = new FormData();
            bodyFormData.append('file', file);
            const { data } = await API.responsible(
              `/file`,
              {},
              {
                ...API.init(),
                method: 'post',
                body: bodyFormData,
                headers: {
                  authorization: 'Bearer ' + (localStorage.getItem(keyToken) || ''),
                  'Accept-Language': localStorage.getItem('i18nextLng') || '',
                },
              },
            );
            return {
              success: 1,
              file: {
                url: data.url,
              },
            };
          },
          async uploadByUrl(url) {
            return {
              success: 1,
              file: {
                url: url,
              },
            };
          },
        },
      },
    },
    list: {
      class: List,
      inlineToolbar,
    },
    code: { class: Code },
    quote: { class: Quote },
    delimiter: { class: Delimiter },
    rawTool: { class: Raw },
    table: {
      class: Table,
      config: {
        rows: 2,
        cols: 3,
      },
    },
    button: { class: Button },
    component: { class: Component },
  },
};
