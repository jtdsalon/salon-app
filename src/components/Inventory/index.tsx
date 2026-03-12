import React, { useState, useMemo } from 'react';
import Grid from '@mui/material/Grid2';
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  Stack, 
  Chip,
  Fade,
  Snackbar,
  Alert,
  useTheme,
  Fab
} from '@mui/material';
import { Search, Sparkles, Star, ShoppingBag, Plus } from 'lucide-react';
import { Product } from './types';

const PRODUCTS: Product[] = [];

interface InventoryProps {
  onAddToCart?: (product: Product) => void;
}

const CATEGORIES = ['All', 'Skincare', 'Haircare', 'Fragrance', 'Tools'];

const Inventory: React.FC<InventoryProps> = ({ onAddToCart }) => {
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleAcquire = (product: Product) => {
    setSelectedProduct(product);
    if (onAddToCart) onAddToCart(product);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ pb: 12, position: 'relative', width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }} className="animate-fadeIn">
      {/* Centered Search Bar */}
      <Box sx={{ maxWidth: { xs: '100%', sm: 800 }, mx: 'auto', mb: 4, mt: 4, px: { xs: 0, sm: 0 } }}>
        <TextField
          fullWidth
          placeholder="Search our apothecary..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={22} color="#94A3B8" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '100px',
              bgcolor: 'background.paper',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
              px: 3,
              py: 0.8,
              fontSize: '16px',
              '& fieldset': { border: 'none' },
            }
          }}
        />
      </Box>

      {/* Centered Category Filters */}
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ mb: 10, overflowX: 'auto', pb: 1, px: 2, '&::-webkit-scrollbar': { display: 'none' } }} 
        justifyContent="center"
      >
        {CATEGORIES.map(cat => (
          <Chip
            key={cat}
            label={cat.toUpperCase()}
            onClick={() => setActiveCategory(cat)}
            sx={{
              bgcolor: activeCategory === cat ? '#0F172A' : 'transparent',
              color: activeCategory === cat ? 'white' : '#64748B',
              fontWeight: 800,
              fontSize: '11px',
              letterSpacing: '0.15em',
              border: activeCategory === cat ? 'none' : '1px solid #F1F5F9',
              px: 1.5,
              height: 44,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { bgcolor: activeCategory === cat ? '#0F172A' : '#F8FAFC' }
            }}
          />
        ))}
      </Stack>

      {/* Product Grid */}
      <Grid container spacing={4}>
        {filteredProducts.length === 0 ? (
          <Grid size={12}>
            <Box sx={{ py: 12, textAlign: 'center', color: 'text.secondary', fontWeight: 600 }}>
              No products in the apothecary yet. Add products to display them here.
            </Box>
          </Grid>
        ) : filteredProducts.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Fade in timeout={500}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: '40px', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: 'none',
                  bgcolor: 'transparent',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': { transform: 'translateY(-10px)' }
                }}
              >
                <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', borderRadius: '40px' }}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover'
                    }}
                  />
                  {/* Rating Badge */}
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <Box sx={{ 
                      bgcolor: 'white', 
                      px: 1.2, 
                      py: 0.5, 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5, 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }}>
                      <Star size={12} fill="#0F172A" color="#0F172A" />
                      <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#0F172A' }}>{product.rating}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#B59410', letterSpacing: '0.15em', mb: 1, textTransform: 'uppercase' }}>
                    {product.brand}
                  </Typography>
                  <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', mb: 1, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    {product.name}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500, mb: 4, px: 1 }}>
                    {product.description}
                  </Typography>
                  
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', mt: 'auto' }}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>
                      {product.price.toLocaleString()} LKR
                    </Typography>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={() => handleAcquire(product)}
                      sx={{ 
                        borderRadius: '100px', 
                        bgcolor: '#0F172A',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 900,
                        letterSpacing: '0.1em',
                        px: 3,
                        py: 1.2,
                      '&:hover': { bgcolor: '#1E293B' }
                    }}
                  >
                    ACQUIRE
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        ))}
      </Grid>

      {/* Shop Bag FAB */}
      <Fab 
        sx={{ 
          position: 'fixed', 
          bottom: 40, 
          right: 40, 
          bgcolor: '#0F172A', 
          width: 80, 
          height: 80,
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
          '&:hover': { bgcolor: '#1E293B', transform: 'scale(1.1)' },
          transition: 'all 0.3s'
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <ShoppingBag size={28} color="#B59410" />
          <Box sx={{ 
            position: 'absolute', 
            top: -4, 
            right: -8, 
            bgcolor: '#B59410', 
            borderRadius: '50%', 
            width: 20, 
            height: 20, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '2px solid #0F172A'
          }}>
            <Plus size={12} color="white" strokeWidth={4} />
          </Box>
        </Box>
      </Fab>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ 
            borderRadius: '100px', 
            bgcolor: '#0F172A', 
            color: 'white',
            fontWeight: 800,
            '& .MuiAlert-icon': { color: '#B59410' }
          }}
          icon={<Sparkles size={20} />}
        >
          {selectedProduct?.name} added to your ritual.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventory;
