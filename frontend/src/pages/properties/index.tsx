import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Box, Typography, TextField, Button, CircularProgress, List, ListItem, ListItemText, Paper, InputAdornment } from '@mui/material';

type Property = { id: string; title: string; price: number; status: 'Available' | 'Sold' };

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch('/api/properties');
    const data = await res.json();
    setProperties(data.properties ?? []);
  };

  useEffect(() => { void load(); }, []);

  const onSubmit = async (e: React.FormEvent) => {
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
  };

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
import * as React from 'react';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  MenuItem,
} from '@mui/material';
import Layout from '@/components/Layout';
import { listProperties, createProperty, type Property } from '@/lib/api';

export default function PropertiesPage() {
  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState<number>(0);
  const [status, setStatus] = React.useState<'Available' | 'Sold'>('Available');
  const [items, setItems] = React.useState<Property[]>([]);

  const load = React.useCallback(async () => {
    const data = await listProperties();
    setItems(data.properties);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const onAdd = async () => {
    if (!title) return;
    await createProperty({ title, price, status });
    setTitle('');
    setPrice(0);
    setStatus('Available');
    load();
  };

  return (
    <Layout>
      <Typography variant="h5" gutterBottom>Propiedades</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Título" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} fullWidth />
          <TextField label="Precio" type="number" value={price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value))} fullWidth />
          <TextField select label="Estado" value={status} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatus(e.target.value as 'Available' | 'Sold')}>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Sold">Sold</MenuItem>
          </TextField>
          <Button variant="contained" onClick={onAdd}>Agregar</Button>
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <List>
          {items.map((p) => (
            <ListItem key={p.id} divider>
              <ListItemText primary={`${p.title} - $${p.price}`} secondary={p.status} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Layout>
  );
}
