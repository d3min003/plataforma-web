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
