import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Image, Code, FileText, Music } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
  icon?: 'image' | 'code' | 'text' | 'music';
  size?: string;
}

const FILE_TREE: FileNode[] = [
  {
    name: 'Documents',
    type: 'folder',
    children: [
      { name: 'report-2024.pdf', type: 'file', icon: 'text', size: '2.4 MB' },
      { name: 'notes.md', type: 'file', icon: 'text', size: '12 KB' },
      {
        name: 'Projects',
        type: 'folder',
        children: [
          { name: 'battlestation.tsx', type: 'file', icon: 'code', size: '8.2 KB' },
          { name: 'config.json', type: 'file', icon: 'code', size: '1.1 KB' },
        ],
      },
    ],
  },
  {
    name: 'Images',
    type: 'folder',
    children: [
      { name: 'wallpaper.png', type: 'file', icon: 'image', size: '4.8 MB' },
      { name: 'screenshot.jpg', type: 'file', icon: 'image', size: '1.2 MB' },
    ],
  },
  {
    name: 'Music',
    type: 'folder',
    children: [
      { name: 'synthwave-mix.mp3', type: 'file', icon: 'music', size: '8.4 MB' },
      { name: 'ambient-chill.flac', type: 'file', icon: 'music', size: '42 MB' },
    ],
  },
  { name: 'README.md', type: 'file', icon: 'text', size: '4 KB' },
  { name: 'package.json', type: 'file', icon: 'code', size: '2 KB' },
];

const iconMap = {
  image: Image,
  code: Code,
  text: FileText,
  music: Music,
};

interface TreeNodeProps {
  node: FileNode;
  depth?: number;
}

function TreeNode({ node, depth = 0 }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const [isSelected, setIsSelected] = useState(false);

  const FileIcon = node.icon ? iconMap[node.icon] : File;

  return (
    <div>
      <button
        onClick={() => {
          if (node.type === 'folder') {
            setIsOpen(!isOpen);
          } else {
            setIsSelected(!isSelected);
          }
        }}
        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
          isSelected ? 'bg-amber-500/20 border border-amber-500/30' : 'hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {node.type === 'folder' ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
            <Folder
              className={`w-4 h-4 ${isOpen ? 'text-amber-400' : 'text-amber-500/70'}`}
              fill={isOpen ? 'currentColor' : 'none'}
            />
          </>
        ) : (
          <>
            <span className="w-4" />
            <FileIcon className="w-4 h-4 text-slate-400" />
          </>
        )}

        <span className={`flex-1 text-sm ${node.type === 'folder' ? 'text-white' : 'text-slate-300'}`}>
          {node.name}
        </span>

        {node.size && <span className="text-xs text-slate-500">{node.size}</span>}
      </button>

      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileBrowserPanel() {
  return (
    <div className="space-y-4">
      {/* Path breadcrumb */}
      <div className="flex items-center gap-1 text-sm">
        <span className="text-amber-400">~</span>
        <ChevronRight className="w-3 h-3 text-slate-500" />
        <span className="text-slate-300">battlestation</span>
      </div>

      {/* File tree */}
      <div className="bg-black/20 rounded-lg border border-amber-500/10 p-2">
        {FILE_TREE.map((node, i) => (
          <TreeNode key={i} node={node} />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
          <div className="text-lg font-mono font-bold text-white">24</div>
          <div className="text-xs text-slate-500">Files</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
          <div className="text-lg font-mono font-bold text-white">8</div>
          <div className="text-xs text-slate-500">Folders</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
          <div className="text-lg font-mono font-bold text-white">142 MB</div>
          <div className="text-xs text-slate-500">Total</div>
        </div>
      </div>
    </div>
  );
}
