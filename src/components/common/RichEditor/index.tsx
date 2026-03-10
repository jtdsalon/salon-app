import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Stack, IconButton, Typography, alpha, Tooltip, useTheme
} from '@mui/material';
import {
    Bold, Italic, Underline, List, ListOrdered, Eraser, Type
} from 'lucide-react';

interface RichEditorProps {
    value: string;
    onChange: (val: string) => void;
    isDark: boolean;
    placeholder?: string;
    error?: boolean;
    minHeight?: number;
}

const RichEditor: React.FC<RichEditorProps> = ({
    value,
    onChange,
    isDark,
    placeholder,
    error,
    minHeight = 180
}) => {
    const theme = useTheme();
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Sync internal HTML with external value prop
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Only update if the editor isn't the active element to prevent cursor jumping
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    const execCommand = (command: string, cmdValue: string = '') => {
        document.execCommand(command, false, cmdValue);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const toolbarButtons = [
        { icon: <Bold size={14} />, cmd: 'bold', label: 'Bold' },
        { icon: <Italic size={14} />, cmd: 'italic', label: 'Italic' },
        { icon: <Underline size={14} />, cmd: 'underline', label: 'Underline' },
        { icon: <ListOrdered size={14} />, cmd: 'insertOrderedList', label: 'Numbered List' },
        { icon: <List size={14} />, cmd: 'insertUnorderedList', label: 'Bullet List' },
        { icon: <Eraser size={14} />, cmd: 'removeFormat', label: 'Clear Formatting' },
    ];

    return (
        <Box sx={{
            borderRadius: '16px',
            border: '1px solid',
            borderColor: error ? '#F43F5E' : (isFocused ? '#EAB308' : (isDark ? 'rgba(255,255,255,0.1)' : 'divider')),
            bgcolor: isDark ? alpha('#FFF', 0.02) : alpha('#000', 0.01),
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: error ? '#F43F5E' : '#EAB308' }
        }}>
            {/* Artisan Toolbar */}
            <Stack
                direction="row"
                spacing={0.5}
                sx={{
                    p: 1,
                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderBottom: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'divider'
                }}
            >
                {toolbarButtons.map((btn, i) => (
                    <Tooltip key={i} title={btn.label} arrow>
                        <IconButton
                            size="small"
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent focus loss from editor
                                execCommand(btn.cmd);
                            }}
                            sx={{
                                width: 30, height: 30, borderRadius: '8px',
                                color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                                '&:hover': { bgcolor: alpha('#EAB308', 0.1), color: '#EAB308' }
                            }}
                        >
                            {btn.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </Stack>

            {/* Editor Surface */}
            <Box
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    handleInput(); // Final sync on blur
                }}
                {...({ 'data-placeholder': placeholder } as any)}
                sx={{
                    minHeight: minHeight,
                    maxHeight: 500,
                    overflowY: 'auto',
                    p: 2.5,
                    outline: 'none',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: isDark ? alpha('#FFF', 0.9) : 'text.primary',
                    // Placeholder logic
                    '&:empty:before': {
                        content: 'attr(data-placeholder)',
                        color: 'text.secondary',
                        opacity: 0.5,
                        pointerEvents: 'none',
                        display: 'block'
                    },
                    // Fixing List Visibility (Explicit markers)
                    '& ul': {
                        listStyleType: 'disc',
                        pl: 4,
                        my: 1,
                        '& li': { mb: 0.5 }
                    },
                    '& ol': {
                        listStyleType: 'decimal',
                        pl: 4,
                        my: 1,
                        '& li': { mb: 0.5 }
                    },
                    // Styling text nodes
                    '& b, & strong': { fontWeight: 900, color: isDark ? 'white' : 'black' },
                    '& i, & em': { fontStyle: 'italic' },
                    '& u': { textDecoration: 'underline' }
                }}
            />
        </Box>
    );
};

export default RichEditor;