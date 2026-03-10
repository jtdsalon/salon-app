import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  TextField,
  Stack,
  Fade,
  CircularProgress
} from '@mui/material';
import { Image as ImageIcon, Camera, Layers, Trash2 } from 'lucide-react';
import { FeedPost } from './types';
import { optimizeImage } from '@/lib/util/imageProcessor';

interface FeedComposerProps {
  open: boolean;
  onClose: () => void;
  onSave: (post: FeedPost) => void;
  editingPost: FeedPost | null;
  currentUser: {
    id: string;
    name: string;
    avatar: string;
    type: 'customer' | 'salon';
  };
}

const COLORS = {
  primary: '#0F172A',
  accentGold: '#D4AF37',
  vibrantGold: '#C5A028',
  royalBlue: '#1E3A8A',
  textSecondary: '#64748b',
  border: '#F1F5F9',
  bgLight: '#FCFCFC',
};

const FeedComposer: React.FC<FeedComposerProps> = ({ open, onClose, onSave, editingPost, currentUser }) => {
  const [caption, setCaption] = useState('');
  const [imageAfter, setImageAfter] = useState<string | null>(null);
  const [imageBefore, setImageBefore] = useState<string | null>(null);
  const [isTransformation, setIsTransformation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const afterInputRef = useRef<HTMLInputElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (editingPost) {
        setCaption(editingPost.caption || '');
        setImageAfter(editingPost.image || null);
        setImageBefore(editingPost.imageBefore || null);
        setIsTransformation(editingPost.isTransformation || false);
      } else {
        setCaption('');
        setImageAfter(null);
        setImageBefore(null);
        setIsTransformation(false);
      }
    }
  }, [editingPost, open]);

  const handleUpload = (type: 'before' | 'after') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        // Optimize image before setting state
        const optimized = await optimizeImage(file, { maxWidth: 1600, quality: 0.85 });
        if (type === 'before') {
          setImageBefore(optimized);
          setIsTransformation(true);
        } else {
          setImageAfter(optimized);
        }
      } catch (err) {
        console.error("Optimization failed:", err);
      } finally {
        setIsProcessing(false);
      }
    }
    e.target.value = '';
  };

  const handleSaveInternal = () => {
    if (!caption.trim() && !imageAfter) return;

    // Added isLiked to satisfy FeedPost interface requirements
    onSave({
      id: editingPost?.id || Math.random().toString(36).substr(2, 9),
      userId: editingPost?.userId || currentUser.id,
      userName: editingPost?.userName || currentUser.name,
      userAvatar: editingPost?.userAvatar || currentUser.avatar,
      userType: editingPost?.userType || currentUser.type,
      caption: caption.trim(),
      image: imageAfter || undefined,
      imageBefore: isTransformation ? imageBefore || undefined : undefined,
      isTransformation: isTransformation && !!imageAfter && !!imageBefore,
      likes: editingPost?.likes || 0,
      isLiked: editingPost?.isLiked || false,
      timeAgo: editingPost?.timeAgo || 'Just now',
      comments: editingPost?.comments || []
    });
    
    onClose();
  };

  const ImageBox = ({ 
    img, 
    label, 
    type, 
    active 
  }: { 
    img: string | null; 
    label: string; 
    type: 'before' | 'after';
    active?: boolean;
  }) => (
    <Box 
      onClick={() => !isProcessing && (type === 'after' ? afterInputRef.current?.click() : beforeInputRef.current?.click())}
      sx={{ 
        flex: 1,
        height: 200,
        borderRadius: '32px',
        border: active ? `2px solid ${COLORS.royalBlue}` : `1.5px solid ${COLORS.border}`,
        bgcolor: COLORS.bgLight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isProcessing ? 'wait' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: isProcessing ? COLORS.border : COLORS.accentGold,
          bgcolor: isProcessing ? COLORS.bgLight : 'rgba(212, 175, 55, 0.02)'
        }
      }}
    >
      {img ? (
        <>
          <Box component="img" src={img} sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isProcessing ? 0.5 : 1 }} />
          {!isProcessing && (
            <IconButton 
              size="small" 
              onClick={(e) => { 
                e.stopPropagation(); 
                type === 'after' ? setImageAfter(null) : setImageBefore(null); 
              }}
              sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' } }}
            >
              <Trash2 size={14} color="#ef4444" />
            </IconButton>
          )}
        </>
      ) : (
        <>
          {isProcessing ? (
            <CircularProgress size={24} sx={{ color: COLORS.accentGold }} />
          ) : (
            <>
              {type === 'after' ? <ImageIcon size={28} color={COLORS.textSecondary} strokeWidth={1} /> : <Camera size={28} color={COLORS.textSecondary} strokeWidth={1} />}
              <Typography sx={{ mt: 1.5, fontSize: '10px', fontWeight: 800, color: COLORS.textSecondary, letterSpacing: '0.15em' }}>
                {label.toUpperCase()}
              </Typography>
            </>
          )}
        </>
      )}
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: '48px', 
          p: 2,
          boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
        <Typography sx={{ 
          color: COLORS.royalBlue, 
          fontWeight: 600, 
          fontSize: '18px', 
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          {editingPost ? 'Edit Masterpiece' : 'New Masterpiece'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4 }}>
        <Stack spacing={4} alignItems="center">
          <TextField
            fullWidth
            multiline
            placeholder="Describe the aesthetic..."
            variant="standard"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: { 
                fontSize: '15px', 
                color: COLORS.textSecondary,
                textAlign: 'left',
                fontWeight: 300,
                '& textarea': { textAlign: 'left' }
              }
            }}
          />

          <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
            <ImageBox 
              img={imageAfter} 
              label="Final" 
              type="after" 
            />
            {isTransformation && (
              <Fade in>
                <Box sx={{ flex: 1 }}>
                  <ImageBox 
                    img={imageBefore} 
                    label="Initial" 
                    type="before" 
                    active={!!imageBefore}
                  />
                </Box>
              </Fade>
            )}
          </Box>

          <Button
            variant="outlined"
            onClick={() => setIsTransformation(!isTransformation)}
            startIcon={<Layers size={18} />}
            sx={{ 
              borderRadius: '100px',
              px: 4,
              py: 1.5,
              borderColor: isTransformation ? COLORS.royalBlue : COLORS.border,
              color: isTransformation ? COLORS.royalBlue : COLORS.textSecondary,
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'none',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: COLORS.royalBlue,
                bgcolor: 'rgba(30, 58, 138, 0.05)'
              }
            }}
          >
            Metamorphosis Mode
          </Button>
        </Stack>

        <input 
          type="file" 
          accept="image/*" 
          ref={afterInputRef} 
          style={{ display: 'none' }} 
          onChange={handleUpload('after')} 
        />
        <input 
          type="file" 
          accept="image/*" 
          ref={beforeInputRef} 
          style={{ display: 'none' }} 
          onChange={handleUpload('before')} 
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 3, pb: 6, px: 4 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: COLORS.textSecondary, 
            fontWeight: 700, 
            fontSize: '14px',
            textTransform: 'none'
          }}
        >
          Discard
        </Button>
        <Button 
          variant="contained" 
          disableElevation
          disabled={isProcessing || (!caption.trim() && !imageAfter)}
          onClick={handleSaveInternal}
          sx={{ 
            borderRadius: '100px', 
            bgcolor: COLORS.primary, 
            color: '#fff',
            px: 6, 
            py: 1.5,
            fontWeight: 800,
            fontSize: '14px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#1e293b'
            },
            '&.Mui-disabled': {
              bgcolor: COLORS.bgLight,
              color: '#cbd5e1'
            }
          }}
        >
          {editingPost ? 'Update' : 'Publish'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedComposer;