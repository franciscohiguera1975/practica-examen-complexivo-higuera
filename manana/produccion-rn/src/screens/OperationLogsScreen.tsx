import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listProductionOrdersApi } from "../api/productionOrder.api";
import { listMachinesApi } from "../api/machine.api";
import { listSystemEventsApi } from "../api/systemEvent.api";
import { listOperationLogsApi, createOperationLogApi, deleteOperationLogApi } from "../api/operationLog.api";

import type { ProductionOrder } from "../types/productionOrder";
import type { Machine } from "../types/machine";
import type { SystemEvent } from "../types/systemEvent";
import type { OperationLog } from "../types/operationLog";
import { toArray } from "../types/drf";


function systemEventLabel(st: SystemEvent): string {
  return st.event_type ? `${st.event_type}${st.details ? ` — ${st.details}` : ""}` : st.id;
}

function parseOptionalNumber(input: string): { value?: number; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { value: undefined };
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return { error: "Cost debe ser numérico" };
  return { value: parsed };
}

export default function OperationLogsScreen() {
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>([]);

  const [selectedProductionOrderId, setSelectedProductionOrderId] = useState<number | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(null);
  const [selectedSystemEventId, setSelectedSystemEventId] = useState<string>("");

  const [level, setLevel] = useState("");
  const [message, setMessage] = useState("");
  const [meta, setMeta] = useState("");
  const [created_at, setCreated_at] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const productionOrderById = useMemo(() => {
    const map = new Map<number, ProductionOrder>();
    productionOrders.forEach((v) => map.set(v.id, v));
    return map;
  }, [productionOrders]);

  const machineById = useMemo(() => {
    const map = new Map<number, Machine>();
    machines.forEach((v) => map.set(v.id, v));
    return map;
  }, [machines]);

  const systemEventById = useMemo(() => {
    const map = new Map<string, SystemEvent>();
    systemEvents.forEach((s) => map.set(s.id, s));
    return map;
  }, [systemEvents]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [operationLogsData, productionOrdersData, systemEventsData, machinesData] = await Promise.all([
        listOperationLogsApi(),
        listProductionOrdersApi(),
        listSystemEventsApi(),
        listMachinesApi(),
      ]);

      const operationLogsList = toArray(operationLogsData);
      const productionOrdersList = toArray(productionOrdersData);
      const systemEventsList = toArray(systemEventsData);
      const machinesList = toArray(machinesData);

      setOperationLogs(operationLogsList);
      setProductionOrders(productionOrdersList);
      setMachines(machinesList);
      setSystemEvents(systemEventsList);

      if (selectedProductionOrderId === null && productionOrdersList.length) setSelectedProductionOrderId(productionOrdersList[0].id);
      if (selectedMachineId === null && machinesList.length) setSelectedMachineId(machinesList[0].id);
      if (!selectedSystemEventId && systemEventsList.length) setSelectedSystemEventId(systemEventsList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createOperationLog = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedProductionOrderId === null) return setErrorMessage("Seleccione un vehículo");
      if (!selectedSystemEventId) return setErrorMessage("Seleccione un tipo de servicio");

      const trimmedMessage = message.trim() ? message.trim() : undefined;
      
      

      // NO enviar fecha, backend la toma actual
      const created = await createOperationLogApi({
        order_id: selectedProductionOrderId,
        machine_id: selectedMachineId ?? undefined,
        system_event_id: selectedSystemEventId,
        level: level.trim() ? level.trim() : undefined,
        message: trimmedMessage,
        meta: meta.trim() ? meta.trim() : undefined,
        created_at: created_at.trim() ? created_at.trim() : undefined,
      });

      setOperationLogs((prev) => [created, ...prev]);
      setMessage("");
      setMeta("");
      setLevel("");
      setCreated_at("");
    } catch {
      setErrorMessage("No se pudo crear vehicle service");
    }
  };

  const removeService = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteOperationLogApi(id);
      setOperationLogs((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar vehicle service");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Services</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Orden de Producción</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedProductionOrderId ?? ""}
          onValueChange={(value) => setSelectedProductionOrderId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {productionOrders.map((v) => (
            <Picker.Item key={v.id} label={v.product_name} value={v.id} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Máquinas</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedMachineId ?? ""}
          onValueChange={(value) => setSelectedMachineId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {machines.map((v) => (
            <Picker.Item key={v.id} label={v.name} value={v.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tipo de Evento</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedSystemEventId}
          onValueChange={(value) => setSelectedSystemEventId(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {systemEvents.map((st) => (
            <Picker.Item key={st.id} label={systemEventLabel(st)} value={st.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Mensaje (opcional)</Text>
      <TextInput
        placeholder="Mensaje"
        placeholderTextColor="#8b949e"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />

      <Text style={styles.label}>Meta (opcional)</Text>
      <TextInput
        placeholder="40"
        placeholderTextColor="#8b949e"
        value={meta}
        onChangeText={setMeta}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Fecha  (opcional)</Text>
      <TextInput
        placeholder="40"
        placeholderTextColor="#8b949e"
        value={created_at}
        onChangeText={setCreated_at}
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable onPress={createOperationLog} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear (sin enviar fecha)</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={operationLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const machine = machines.find((m) => m.id === item.machine_id);
          const line1 = machine ? machine.name : "";

          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>{line1}</Text>
                <Text style={styles.rowText} numberOfLines={1}>{item.level}</Text>
                <Text style={styles.rowText} numberOfLines={1}>{item.message}</Text>
              </View>

              <Pressable onPress={() => removeService(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },

  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },

  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "800" },
});