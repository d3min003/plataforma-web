import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Box, Typography, TextField, Button, CircularProgress, List, ListItem, ListItemText, Paper, InputAdornment } from '@mui/material';

type Property = { id: string; title: string; price: number; status: 'Available' | 'Sold' };

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/properties');
    const data = await res.json();
    setProperties(data.properties ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, price, status: 'Available' }),
      });
      if (res.ok) {
        setTitle('');
        setPrice(0);
        await load();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Typography variant="h4" sx={{ mb: 2 }}>Propiedades</Typography>
      <Paper sx={{ p: 2, mb: 3 }} component="form" onSubmit={onSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr auto' }, gap: 2, alignItems: 'center' }}>
          <TextField label="Título" value={title} onChange={e => setTitle(e.target.value)} required fullWidth />
          <TextField
            label="Precio"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            type="number"
            inputProps={{ min: 0 }}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 200 }}>
            {loading ? <CircularProgress size={20} /> : 'Agregar propiedad'}
          </Button>
        </Box>
      </Paper>

      <Paper>
        <List>
          {properties.map(p => (
            <ListItem key={p.id} divider>
              <ListItemText primary={p.title} secondary={`$${p.price.toLocaleString()} — ${p.status}`} />
            </ListItem>
          ))}
          {properties.length === 0 && (
            <ListItem>
              <ListItemText primary="Sin propiedades aún" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Layout>
  );
}
