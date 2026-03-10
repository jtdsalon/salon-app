
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Button,
  Divider,
  useTheme,
  TextField,
} from '@mui/material';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout?: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose, items, onUpdateQuantity, onRemove, onCheckout }) => {
  const theme = useTheme();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { 
          width: { xs: '100%', sm: 400 },
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.05)'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 1, bgcolor: 'secondary.main', borderRadius: '10px', color: 'white' }}>
                <ShoppingBag size={20} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>My Rituals</Typography>
                <Typography variant="caption" color="text.secondary">{items.length} Curated Items</Typography>
              </Box>
            </Stack>
            <IconButton onClick={onClose} sx={{ bgcolor: 'action.hover' }}>
              <X size={20} />
            </IconButton>
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {items.length === 0 ? (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.6 }}>
              <Box sx={{ width: 80, height: 80, borderRadius: '50%', border: '2px dashed', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <ShoppingBag size={32} />
              </Box>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>Your apothecary bag is empty</Typography>
              <Typography variant="body2">Curate your next beauty ritual from our collection.</Typography>
            </Box>
          ) : (
            <Stack spacing={4}>
              {items.map((item) => (
                <Stack key={item.id} direction="row" spacing={2}>
                  <Avatar 
                    src={item.image} 
                    variant="rounded" 
                    sx={{ width: 70, height: 70, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }} 
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: '14px' }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 800, mb: 1, display: 'block' }}>
                      {item.brand}
                    </Typography>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" alignItems="center" sx={{ bgcolor: 'action.hover', borderRadius: '8px', px: 1 }}>
                        <IconButton size="small" onClick={() => onUpdateQuantity(item.id, -1)} disabled={item.quantity <= 1}>
                          <Minus size={14} />
                        </IconButton>
                        <Typography sx={{ mx: 2, fontSize: '13px', fontWeight: 900 }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => onUpdateQuantity(item.id, 1)}>
                          <Plus size={14} />
                        </IconButton>
                      </Stack>
                      <Typography sx={{ fontWeight: 900, fontSize: '14px' }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Box>
                  <IconButton onClick={() => onRemove(item.id)} size="small" sx={{ color: 'text.secondary', alignSelf: 'flex-start' }}>
                    <Trash2 size={16} />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box sx={{ p: 4, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack spacing={2} sx={{ mb: 4 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Aesthetic Subtotal</Typography>
                <Typography sx={{ fontWeight: 900 }}>Rs. {subtotal.toLocaleString()}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Ritual Shipping</Typography>
                <Typography sx={{ fontWeight: 900 }}>FREE</Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Total Value</Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                  Rs. {subtotal.toLocaleString()}
                </Typography>
              </Stack>
            </Stack>
            <Button 
              fullWidth 
              variant="contained" 
              disableElevation
              onClick={onCheckout}
              endIcon={<ArrowRight size={20} />}
              sx={{ borderRadius: '100px', bgcolor: 'text.primary', color: 'background.paper', py: 2, fontWeight: 900 }}
            >
              Secure Checkout
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
