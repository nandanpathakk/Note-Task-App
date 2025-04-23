// components/notes/EditorMenuBar.tsx
"use client";

import { type Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Quote,
    Code,
    Link as LinkIcon,
    Unlink,
    ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Undo,
    Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface EditorMenuBarProps {
    editor: Editor | null;
}

export function EditorMenuBar({ editor }: EditorMenuBarProps) {
    const [linkUrl, setLinkUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    if (!editor) {
        return null;
    }


    const setLink = () => {
        if (linkUrl) {
            editor.chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: linkUrl })
                .run();
            setLinkUrl('');
        }
    };

    const addImage = () => {
        if (imageUrl) {
            editor.chain()
                .focus()
                .setImage({ src: imageUrl })
                .run();
            setImageUrl('');
        }
    };



    return (
        <div className="p-2 border-b flex flex-wrap items-center gap-1 bg-muted/40">
            <TooltipProvider delayDuration={300}>
                <div className="flex flex-wrap items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                data-active={editor.isActive('bold')}
                                aria-label="Bold"
                            >
                                <Bold className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                data-active={editor.isActive('italic')}
                                aria-label="Italic"
                            >
                                <Italic className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                data-active={editor.isActive('underline')}
                                aria-label="Underline"
                            >
                                <Underline className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Underline</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                data-active={editor.isActive('strike')}
                                aria-label="Strikethrough"
                            >
                                <Strikethrough className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Strikethrough</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                data-active={editor.isActive('heading', { level: 2 })}
                                aria-label="Heading 2"
                            >
                                <Heading2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                data-active={editor.isActive('heading', { level: 3 })}
                                aria-label="Heading 3"
                            >
                                <Heading3 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Heading 3</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                data-active={editor.isActive('blockquote')}
                                aria-label="Quote"
                            >
                                <Quote className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Quote</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                data-active={editor.isActive('codeBlock')}
                                aria-label="Code Block"
                            >
                                <Code className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Code Block</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                data-active={editor.isActive('bulletList')}
                                aria-label="Bullet List"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                data-active={editor.isActive('orderedList')}
                                aria-label="Numbered List"
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <Popover>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PopoverTrigger asChild>
                                    <Button
                                        type='button'
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        data-active={editor.isActive('link')}
                                        aria-label="Insert Link"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Insert Link</TooltipContent>
                        </Tooltip>
                        <PopoverContent className="w-80">
                            <div className="flex flex-col gap-2">
                                <h4 className="text-sm font-medium">Insert Link</h4>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://example.com"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type='button' size="sm" onClick={setLink}>Add</Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {editor.isActive('link') && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type='button'
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => editor.chain().focus().unsetLink().run()}
                                    aria-label="Remove Link"
                                >
                                    <Unlink className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove Link</TooltipContent>
                        </Tooltip>
                    )}

                    <Popover>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PopoverTrigger asChild>
                                    <Button
                                        type='button'
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        aria-label="Insert Image"
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Insert Image</TooltipContent>
                        </Tooltip>
                        <PopoverContent className="w-80">
                            <div className="flex flex-col gap-2">
                                <h4 className="text-sm font-medium">Insert Image</h4>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type='button' size="sm" onClick={addImage}>Add</Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                data-active={editor.isActive({ textAlign: 'left' })}
                                aria-label="Align Left"
                            >
                                <AlignLeft className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Align Left</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                data-active={editor.isActive({ textAlign: 'center' })}
                                aria-label="Align Center"
                            >
                                <AlignCenter className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Align Center</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                data-active={editor.isActive({ textAlign: 'right' })}
                                aria-label="Align Right"
                            >
                                <AlignRight className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Align Right</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                data-active={editor.isActive({ textAlign: 'justify' })}
                                aria-label="Justify"
                            >
                                <AlignJustify className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Justify</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                                aria-label="Undo"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type='button'
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                                aria-label="Redo"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}