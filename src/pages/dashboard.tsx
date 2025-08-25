import Layout from '@/components/Layout';
import { Paper, Typography, Box } from '@mui/material';

const Card = ({ title, value }: { title: string; value: string | number }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="overline" color="text.secondary">{title}</Typography>
    <Typography variant="h4">{value}</Typography>
  </Paper>
);

export default function Dashboard() {
  return (
    <Layout>
      <Typography variant="h4" sx={{ mb: 2 }}>Dashboard</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <Card title="Leads mensuales" value={42} />
        <Card title="Revenue MTD" value="$120k" />
        <Card title="Propiedades activas" value={18} />
        <Card title="Conversión" value="12%" />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">Próximamente: gráficos y embudos interactivos.</Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
