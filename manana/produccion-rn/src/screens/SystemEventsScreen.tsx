import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";

import { listSystemEventsApi, createSystemEventApi, deleteSystemEventApi } from "../api/systemEvent.api";
import type { SystemEvent } from "../types/systemEvent";
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
    return input.trim();
}

export default function SystemEventsScreen() {
    const [items, setItems] = useState<SystemEvent[]>([]);
    const [eventType, setEventType] = useState("");
    const [source, setSource] = useState("");
    const [details, setDetails] = useState("");
    const [created_at, setCreated_at] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const load = async (): Promise<void> => {
        try {
            setErrorMessage("");
            const data = await listSystemEventsApi();
            setItems(toArray(data));
        } catch {
            setErrorMessage("No se pudo cargar system events. ¿Login? ¿Token?");
        }
    };

    useEffect(() => { load(); }, []);

    const createItem = async (): Promise<void> => {
        try {
            setErrorMessage("");

            const cleanEventType = normalizeText(eventType);
            if (!cleanEventType) return setErrorMessage("Event Type es requerido");

            const created = await createSystemEventApi({
                event_type: cleanEventType,
                source: normalizeText(source) || undefined,
                details: normalizeText(details) || undefined,
                created_at: normalizeText(created_at) || undefined,
            });

            setItems((prev) => [created, ...prev]);
            setEventType("");
            setSource("");
            setDetails("");
            setCreated_at("");
        } catch {
            setErrorMessage("No se pudo crear system event.");
        }
    };

    const removeItem = async (id: string): Promise<void> => {
        try {
            setErrorMessage("");
            await deleteSystemEventApi(id);
            setItems((prev) => prev.filter((it) => it.id !== id));
        } catch {
            setErrorMessage("No se pudo eliminar system event.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Service Types</Text>
            {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            <Text style={styles.label}>Tipo de Evento</Text>
            <TextInput
                value={eventType}
                onChangeText={setEventType}
                placeholder="Cambio de aceite"
                placeholderTextColor="#8b949e"
                style={styles.input}
            />

            <Text style={styles.label}>Descripción (opcional)</Text>
            <TextInput
                value={details}
                onChangeText={setDetails}
                placeholder="Aceite + filtro"
                placeholderTextColor="#8b949e"
                style={styles.input}
            />
            <Text style={styles.label}>Origen (opcional)</Text>
            <TextInput
                value={source}
                onChangeText={setSource}
                placeholder="Origen del evento"
                placeholderTextColor="#8b949e"
                style={styles.input}
            />
            <Text style={styles.label}>Fecha (opcional)</Text>
            <TextInput
                value={created_at}
                onChangeText={setCreated_at}
                placeholder="2024-06-01T12:00:00Z"
                placeholderTextColor="#8b949e"
                style={styles.input}
            />

            <Pressable onPress={createItem} style={styles.btn}>
                <Text style={styles.btnText}>Crear</Text>
            </Pressable>

            <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
                <Text style={styles.btnText}>Refrescar</Text>
            </Pressable>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.rowText} numberOfLines={1}>{item.event_type}</Text>
                            {!!item.details && <Text style={styles.rowSub} numberOfLines={1}>{item.details}</Text>}
                        </View>

                        <Pressable onPress={() => removeItem(item.id)}>
                            <Text style={styles.del}>Eliminar</Text>
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
    title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
    error: { color: "#ff7b72", marginBottom: 10 },
    label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
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
    del: { color: "#ff7b72", fontWeight: "700" },
});