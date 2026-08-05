import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Machine, listMachinesAdminApi, createMachineApi, updateMachineApi, deleteMachineApi } from "../api/machines.api";

export default function AdminMachinesPage() {
  const [items, setItems] = useState<Machine[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);

  const load = async () => {
    try {
      setError("");
      const data = await listMachinesAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };


  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!name.trim()) return setError("El nombre es requerido");

      const payload = {
        name: name.trim(),
        is_active: isActive,
      };

      if (editId) await updateMachineApi(editId, payload);
      else await createMachineApi(payload as any);

      setEditId(null);
      setName("");
      setIsActive(false);
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Machine) => {
    setEditId(v.id);
    setName(v.name);
    setIsActive(!!v.is_active);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteMachineApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar máquina. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Máquinas (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <FormControlLabel
              control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
              label="Activo"
            />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setName(""); setIsActive(false); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell>{machine.id}</TableCell>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.is_active ? "Sí" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(machine)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(machine.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}