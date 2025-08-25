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
