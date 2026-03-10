import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';

export const ComparisonSlider = ({ before, after }: { before: string; after: string }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, x)));
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <Box 
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden', 
        cursor: 'ew-resize',
        userSelect: 'none'
      }}
    >
      <Box 
        component="img" 
        src={after} 
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: `${position}%`, 
          height: '100%', 
          overflow: 'hidden', 
          borderRight: '2px solid white' 
        }}
      >
        <Box 
          component="img" 
          src={before} 
          sx={{ 
            // Fix: Consolidating duplicate width property to avoid syntax error in object literal
            width: containerRef.current?.offsetWidth || '100%', 
            height: '100%', 
            objectFit: 'cover', 
            maxWidth: 'none',
          }} 
        />
      </Box>
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: `${position}%`, 
          transform: 'translate(-50%, -50%)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 2,
          '&::before, &::after': {
            content: '""',
            width: 0,
            height: 0,
            borderStyle: 'solid',
          },
          '&::before': {
            borderWidth: '6px 8px 6px 0',
            borderColor: 'transparent #0F172A transparent transparent',
            marginRight: '2px',
          },
          '&::after': {
            borderWidth: '6px 0 6px 8px',
            borderColor: 'transparent transparent transparent #0F172A',
            marginLeft: '2px',
          }
        }}
      />
    </Box>
  );
};