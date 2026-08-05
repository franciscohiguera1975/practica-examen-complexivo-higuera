import { Container, Paper, Typography, Stack } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export default function HomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack component="div" direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
          <DirectionsCarIcon />
          <Typography variant="h5">Examen Frontend — Órdenes Producción UI</Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 2 }}>
          SPA React + TypeScript + MUI + Router. Consume la API del examen (DRF paginado).
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Flujo: Lista (público) → Login → Admin (Panel) → CRUD Órdenes / Machines.
        </Typography>
      </Paper>
    </Container>
  );
}