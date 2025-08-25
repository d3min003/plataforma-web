import Layout from '@/components/Layout';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Layout>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" gutterBottom>404</Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>Página no encontrada</Typography>
        <Button variant="contained" component={Link} href="/">Volver al inicio</Button>
      </Box>
    </Layout>
  );
}
