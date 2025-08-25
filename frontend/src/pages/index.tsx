import * as React from 'react';
import Head from 'next/head';
import { Typography, List, ListItem, ListItemText, Link as MLink, Alert, Stack } from '@mui/material';
import Layout from '@/components/Layout';
import { getHealth } from '@/lib/api';

export default function Home() {
  const [health, setHealth] = React.useState<string | null>(null);

  React.useEffect(() => {
    getHealth().then(h => setHealth(`${h.status} @ ${new Date(h.timestamp).toLocaleString()}`)).catch(() => setHealth(null));
  }, []);

  return (
    <>
      <Head>
        <title>CRM Web Inmobiliario</title>
      </Head>
      <Layout>
        <Stack spacing={2}>
          <Typography variant="h4">CRM Web Inmobiliario</Typography>
          {health && <Alert severity="success">API saludable: {health}</Alert>}
          <List>
            <ListItem>
              <ListItemText primary={<MLink href="/api/health">/api/health (desde backend)</MLink>} />
            </ListItem>
          </List>
        </Stack>
      </Layout>
    </>
  );
}
