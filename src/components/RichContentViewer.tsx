'use client';

import React from 'react';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import type { JSONContent } from '@tiptap/react';
import { Attachment } from './AttachmentNode';
import { withPostId } from '@/lib/analytics-client';
import styles from './RichContentViewer.module.css';

interface RichContentViewerProps {
  content: string | JSONContent;
  /** When provided, attachment links are tagged so downloads can be counted. */
  postId?: string;
}

function parseContent(content: string | JSONContent): JSONContent | null {
  if (!content) return null;
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      return parsed as JSONContent;
    } catch {
      return null;
    }
  }
  return content;
}

export default function RichContentViewer({ content, postId }: RichContentViewerProps) {
  const parsed = parseContent(content);

  if (!parsed) {
    // Fallback for legacy plain-text posts: render the string as preformatted text
    if (typeof content === 'string') {
      return <div className={styles.fallback}>{content}</div>;
    }
    return null;
  }

  const json = postId ? tagAttachments(parsed, postId) : parsed;

  const html = generateHTML(json, [
    StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ openOnClick: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    Image.configure({ inline: false, allowBase64: true }),
    Attachment,
  ]);

  return <div className={styles.viewer} dangerouslySetInnerHTML={{ __html: html }} />;
}

function tagAttachments(node: JSONContent, postId: string): JSONContent {
  if (node.type === 'attachment') {
    return {
      ...node,
      attrs: {
        ...node.attrs,
        href: withPostId(node.attrs?.href as string | undefined, postId),
      },
    };
  }

  if (Array.isArray(node.content)) {
    return { ...node, content: node.content.map((child) => tagAttachments(child, postId)) };
  }

  return node;
}