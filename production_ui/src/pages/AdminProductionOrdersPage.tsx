import { useEffect, useState } from "react";
import {
    Container, Paper, Typography, TextField, Button, Stack,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
    FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Machine, listMachinesPublicApi } from "../api/machines.api";
import {
    type ProductionOrder,
    listProductionOrdersAdminApi,
    createProductionOrderApi, updateProductionOrderApi, deleteProductionOrderApi
} from "../api/production_orders.api";

export default function AdminProductionOrdersPage() {
    const [items, setItems] = useState<ProductionOrder[]>([]);
    const [machines, setMachines] = useState<Machine[]>([]);
    const [error, setError] = useState("");

    const [editId, setEditId] = useState<number | null>(null);
    const [machine, setMachine] = useState<number>(0);

    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [status, setStatus] = useState("en_proceso");

    const load = async () => {
        try {
            setError("");
            const data = await listProductionOrdersAdminApi();
            setItems(data.results); // DRF paginado
        } catch {
            setError("No se pudo cargar órdenes de producción. ¿Login? ¿Token admin?");
        }
    };

    const loadMachines = async () => {
        try {
            const data = await listMachinesPublicApi();
            setMachines(data.results); // DRF paginado
            if (!machine && data.results.length > 0) setMachine(data.results[0].id);
        } catch {
            // si falla, no bloquea la pantalla
        }
    };

    useEffect(() => { load(); loadMachines(); }, []);

    const save = async () => {
        try {
            setError("");
            if (!machine) return setError("Seleccione una machine");
            if (!productName.trim()) return setError("El nombre del producto es requerido");
            if (quantity <= 0) return setError("La cantidad debe ser un número positivo");

            const payload = {
                machine: Number(machine),
                product_name: productName.trim(),
                quantity: Number(quantity),
                status: status.trim(),
            };

            if (editId) await updateProductionOrderApi(editId, payload);
            else await createProductionOrderApi(payload as any);

            setEditId(null);
            setProductName("");
            setQuantity(0);
            setStatus("");
            await load();
        } catch {
            setError("No se pudo guardar orden de producción. ¿Token admin?");
        }
    };

    const startEdit = (order: ProductionOrder) => {
        setEditId(order.id);
        setMachine(order.machine);
        setProductName(order.product_name!);
        setQuantity(order.quantity);
        setStatus(order.status);
    };

    const remove = async (id: number) => {
        try {
            setError("");
            await deleteProductionOrderApi(id);
            await load();
        } catch {
            setError("No se pudo eliminar orden de producción. ¿Token admin?");
        }
    };

    return (
        <Container sx={{ mt: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Admin Órdenes de Producción (Privado)</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Stack spacing={2} sx={{ mb: 2 }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

                        <FormControl sx={{ width: 260 }}>
                            <InputLabel id="machine-label">Machine</InputLabel>
                            <Select
                                labelId="machine-label"
                                label="Machine"
                                value={machine}
                                onChange={(e) => setMachine(Number(e.target.value))}
                            >
                                {machines.map((m) => (
                                    <MenuItem key={m.id} value={m.id}>
                                        {m.name} (#{m.id})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField label="Nombre del Producto"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)} fullWidth />
                        <TextField label="Cantidad"
                            type="number" value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))} sx={{ width: 160 }} />
                    </Stack>

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                        <FormControl sx={{ width: 260 }}>
                            <InputLabel id="estado-label">Estado</InputLabel>
                            <Select
                                labelId="estado-label"
                                label="Estado"
                                value={status}
                                onChange={(e) => setStatus(String(e.target.value))}
                            >
                                <MenuItem value="active">Activo</MenuItem>
                                <MenuItem value="en_proceso">En proceso</MenuItem>
                                <MenuItem value="finalizado">Finalizado</MenuItem>
                            </Select>
                        </FormControl>


                        <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
                        <Button variant="outlined" onClick={() => {
                            setEditId(null);
                            setProductName("");
                            setQuantity(0);
                            setStatus("");
                        }}>Limpiar</Button>
                        <Button variant="outlined" onClick={() => { load(); loadMachines(); }}>Refrescar</Button>
                    </Stack>
                </Stack>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Producto</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.product_name ?? ''}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => startEdit(order)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => remove(order.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Paper>
        </Container>
    );
}