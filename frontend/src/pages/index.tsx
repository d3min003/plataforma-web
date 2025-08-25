import * as React from 'react';
import Head from 'next/head';
import { Container, Typography, List, ListItem, ListItemText, Link as MLink } from '@mui/material';

export default function Home() {
  return (
    <>
      <Head>
        <title>CRM Web Inmobiliario</title>
      </Head>
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>CRM Web Inmobiliario</Typography>
        <Typography variant="body1" gutterBottom>
          Frontend con Next.js + MUI. Backend separado.
        </Typography>
        <List>
          <ListItem><ListItemText primary={<MLink href="/api/health">/api/health (desde backend)</MLink>} /></ListItem>
        </List>
      </Container>
    </>
  );
}
