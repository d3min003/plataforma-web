import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Box, Typography, TextField, Button, CircularProgress, List, ListItem, ListItemText, Paper } from '@mui/material';

type Lead = { id: string; name: string; email: string };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data.leads ?? []);
  };

  useEffect(() => { void load(); }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      if (res.ok) {
        setName('');
        setEmail('');
        await load();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" sx={{ mb: 2 }}>Leads</Typography>
      <Paper sx={{ p: 2, mb: 3 }} component="form" onSubmit={onSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr auto' }, gap: 2, alignItems: 'center' }}>
          <TextField label="Nombre" value={name} onChange={e => setName(e.target.value)} required fullWidth />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required fullWidth />
          <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 160 }}>
            {loading ? <CircularProgress size={20} /> : 'Agregar lead'}
          </Button>
        </Box>
      </Paper>

      <Paper>
        <List>
          {leads.map(l => (
            <ListItem key={l.id} divider>
              <ListItemText primary={l.name} secondary={l.email} />
            </ListItem>
          ))}
          {leads.length === 0 && (
            <ListItem>
              <ListItemText primary="Sin leads aún" />
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
} from '@mui/material';
import Layout from '@/components/Layout';
import { listLeads, createLead, type Lead } from '@/lib/api';

export default function LeadsPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [items, setItems] = React.useState<Lead[]>([]);

  const load = React.useCallback(async () => {
    const data = await listLeads();
    setItems(data.leads);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const onAdd = async () => {
    if (!name || !email) return;
    await createLead({ name, email });
    setName('');
    setEmail('');
    load();
  };

  return (
    <Layout>
      <Typography variant="h5" gutterBottom>Leads</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Nombre" value={name} onChange={e => setName(e.target.value)} fullWidth />
          <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
          <Button variant="contained" onClick={onAdd}>Agregar</Button>
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <List>
          {items.map(l => (
            <ListItem key={l.id} divider>
              <ListItemText primary={l.name} secondary={l.email} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Layout>
  );
}
