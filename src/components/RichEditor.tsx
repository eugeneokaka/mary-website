'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import type { JSONContent } from '@tiptap/react';
import { Attachment } from './AttachmentNode';
import styles from './RichEditor.module.css';

const TEXT_COLORS = [
  '#1e3f2b', // primary green
  '#000000',
  '#374151',
  '#dc2626',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#0891b2',
  '#2563eb',
  '#7c3aed',
  '#db2777',
];

const HIGHLIGHT_COLORS = [
  '#fef08a', // default yellow
  '#fed7aa',
  '#fecaca',
  '#bbf7d0',
  '#bfdbfe',
  '#ddd6fe',
  '#fbcfe8',
  '#e7e5e4',
];

interface UploadedFile {
  href: string;
  name: string;
  size: number;
}

interface RichEditorProps {
  value?: JSONContent | null;
  onChange: (json: JSONContent) => void;
  /** When provided, the Image button uploads a file through this handler and
   *  inserts the returned URL. When omitted, falls back to a URL prompt. */
  onImageUpload?: (file: File) => Promise<string>;
  /** When provided, the File button uploads a document and inserts a
   *  downloadable attachment block. */
  onFileUpload?: (file: File) => Promise<UploadedFile>;
  placeholder?: string;
  editable?: boolean;
}

export default function RichEditor({
  value,
  onChange,
  onImageUpload,
  onFileUpload,
  placeholder = 'Start writing your article…',
  editable = true,
}: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [openColor, setOpenColor] = useState<'text' | 'highlight' | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      Attachment,
      Placeholder.configure({ placeholder }),
    ],
    content: value ?? undefined,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: styles.prose,
      },
    },
  });

  // Keep editor content in sync if `value` changes externally (e.g. loading a post)
  useEffect(() => {
    if (editor && value && !editor.isDestroyed) {
      const current = JSON.stringify(editor.getJSON());
      const incoming = JSON.stringify(value);
      if (current !== incoming) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }
  }, [value, editor]);

  if (!editor) {
    return <div className={styles.editorWrap} />;
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href ?? '';
    const url = window.prompt('Link URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const triggerImagePicker = () => {
    if (onImageUpload) {
      fileInputRef.current?.click();
    } else {
      const url = window.prompt('Image URL');
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onImageUpload) return;

    setUploading(true);
    try {
      const src = await onImageUpload(file);
      editor.chain().focus().setImage({ src }).run();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload image';
      window.alert(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onFileUpload) return;

    setUploadingFile(true);
    try {
      const uploaded = await onFileUpload(file);
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'attachment',
          attrs: { href: uploaded.href, name: uploaded.name, size: uploaded.size },
        })
        .run();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload file';
      window.alert(msg);
    } finally {
      setUploadingFile(false);
    }
  };

  const btn = (active: boolean) =>
    `${styles.toolbarBtn} ${active ? styles.toolbarBtnActive : ''}`;

  const currentColor = editor.getAttributes('textStyle').color as string | undefined;
  const currentHighlight = editor.getAttributes('highlight').color as string | undefined;

  return (
    <div className={styles.editorWrap}>
      {editable && (
        <div className={styles.toolbar}>
          <button
            type="button"
            className={btn(editor.isActive('bold'))}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            className={btn(editor.isActive('italic'))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className={btn(editor.isActive('underline'))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <span style={{ textDecoration: 'underline' }}>U</span>
          </button>

          {/* Text color */}
          <div className={styles.colorGroup}>
            <button
              type="button"
              className={`${styles.toolbarBtn} ${openColor === 'text' ? styles.toolbarBtnActive : ''}`}
              onClick={() => setOpenColor(openColor === 'text' ? null : 'text')}
              title="Text color"
            >
              <span
                className={styles.colorUnderlined}
                style={{ color: currentColor || 'var(--color-primary)' }}
              >
                A
              </span>
            </button>
            {openColor === 'text' && (
              <div className={styles.palette}>
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={styles.paletteSwatch}
                    style={{ backgroundColor: c }}
                    onClick={() => {
                      editor.chain().focus().setColor(c).run();
                      setOpenColor(null);
                    }}
                    title={c}
                  />
                ))}
                <button
                  type="button"
                  className={`${styles.paletteSwatch} ${styles.paletteClear}`}
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setOpenColor(null);
                  }}
                  title="Remove color"
                >
                  &#824;
                </button>
              </div>
            )}
          </div>

          {/* Highlight color */}
          <div className={styles.colorGroup}>
            <button
              type="button"
              className={`${styles.toolbarBtn} ${openColor === 'highlight' ? styles.toolbarBtnActive : ''}`}
              onClick={() => setOpenColor(openColor === 'highlight' ? null : 'highlight')}
              title="Highlight color"
            >
              <span
                className={styles.colorUnderlined}
                style={{ backgroundColor: currentHighlight || 'transparent' }}
              >
                H
              </span>
            </button>
            {openColor === 'highlight' && (
              <div className={styles.palette}>
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={styles.paletteSwatch}
                    style={{ backgroundColor: c }}
                    onClick={() => {
                      editor.chain().focus().setHighlight({ color: c }).run();
                      setOpenColor(null);
                    }}
                    title={c}
                  />
                ))}
                <button
                  type="button"
                  className={`${styles.paletteSwatch} ${styles.paletteClear}`}
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                    setOpenColor(null);
                  }}
                  title="Remove highlight"
                >
                  &#824;
                </button>
              </div>
            )}
          </div>

          <span className={styles.divider} />
          <button
            type="button"
            className={btn(editor.isActive('heading', { level: 1 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            className={btn(editor.isActive('heading', { level: 2 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            className={btn(editor.isActive('heading', { level: 3 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            H3
          </button>
          <span className={styles.divider} />
          <button
            type="button"
            className={btn(editor.isActive('bulletList'))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            &bull; List
          </button>
          <button
            type="button"
            className={btn(editor.isActive('orderedList'))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered list"
          >
            1. List
          </button>
          <button
            type="button"
            className={btn(editor.isActive('blockquote'))}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
          >
            &ldquo;&rdquo;
          </button>
          <span className={styles.divider} />
          <button
            type="button"
            className={btn(editor.isActive({ textAlign: 'left' }))}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align left"
          >
            &#8598;
          </button>
          <button
            type="button"
            className={btn(editor.isActive({ textAlign: 'center' }))}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align center"
          >
            &#8597;
          </button>
          <span className={styles.divider} />
          <button
            type="button"
            className={btn(editor.isActive('link'))}
            onClick={addLink}
            title="Add link"
          >
            Link
          </button>
          <button
            type="button"
            className={btn(false)}
            onClick={triggerImagePicker}
            disabled={uploading}
            title={onImageUpload ? 'Upload image' : 'Add image by URL'}
          >
            {uploading ? 'Uploading…' : 'Image'}
          </button>
          {onFileUpload && (
            <button
              type="button"
              className={btn(false)}
              onClick={() => docInputRef.current?.click()}
              disabled={uploadingFile}
              title="Upload a downloadable file (PDF, Word, Excel, PowerPoint…)"
            >
              {uploadingFile ? 'Uploading…' : 'File'}
            </button>
          )}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenFileInput}
        onChange={handleFileChosen}
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.zip"
        className={styles.hiddenFileInput}
        onChange={handleDocumentChosen}
      />
      <EditorContent editor={editor} className={styles.contentArea} />
    </div>
  );
}