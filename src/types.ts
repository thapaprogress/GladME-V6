/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
