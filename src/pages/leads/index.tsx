import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Box, Typography, TextField, Button, CircularProgress, List, ListItem, ListItemText, Paper } from '@mui/material';

type Lead = { id: string; name: string; email: string };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data.leads ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        setName('');
        setEmail('');
        await load();
      }
    } finally {
      setLoading(false);
    }
  }

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
