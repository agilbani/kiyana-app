import { ThemedText } from "@/components";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  value?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  onSelect: (val: string) => void;
}

const SelectInput: React.FC<Props> = ({
  label,
  value,
  options,
  placeholder = "Pilih...",
  disabled,
  onSelect,
}) => {
  const [visible, setVisible] = useState(false);
  const selected = options.find((o) => o.value == value);

  return (
    <View style={{ marginBottom: 8 }}>
      {label && <ThemedText>{label}</ThemedText>}

      <TouchableOpacity
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={[
          styles.input,
          disabled && { backgroundColor: "#f3f4f6" },
        ]}
      >
        <ThemedText color={selected ? "#111" : "#9ca3af"}>
          {selected ? selected.label : placeholder}
        </ThemedText>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalCard}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                  style={[
                    styles.option,
                    item.value === value && styles.selected,
                  ]}
                >
                  <ThemedText
                    color={item.value === value ? "#fff" : "#111"}
                    type={item.value === value ? "SemiBold" : "Regular"}
                  >
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    borderRadius: 16,
    backgroundColor: "#fff",
    maxHeight: "70%",
    paddingVertical: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  selected: {
    backgroundColor: "#2563eb",
  },
});

export default SelectInput;
