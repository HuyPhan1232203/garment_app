import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";

// Định nghĩa đầy đủ props
interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title?: string;
  label?: string;
  placeholder?: string;
  cancelText?: string;
  submitText?: string;
  initialValue?: string;
  keyboardType?: KeyboardTypeOptions;
  isRequired?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
}

const QAModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title = "Nhập thông tin",
  label = "Nhập dữ liệu",
  placeholder = "Nhập giá trị",
  cancelText = "Hủy bỏ",
  submitText = "Xác nhận",
  initialValue = "",
  keyboardType = "default",
  isRequired = false,
  maxLength,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    // Kiểm tra giá trị nếu bắt buộc
    if (isRequired && (!inputValue || inputValue.trim() === "")) {
      setError("Vui lòng nhập thông tin này");
      return;
    }
    
    onSubmit(inputValue);
    setInputValue(initialValue); // Reset giá trị
    setError(null); // Xóa lỗi
    onClose();
  };

  const handleClose = () => {
    setInputValue(initialValue); // Reset giá trị khi đóng
    setError(null); // Xóa lỗi
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.label}>
            {label} {isRequired && <Text style={styles.required}>*</Text>}
          </Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder={placeholder}
            keyboardType={keyboardType}
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              if (error) setError(null);
            }}
            maxLength={maxLength}
            autoFocus={autoFocus}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.buttonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>{submitText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  required: {
    color: "red",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#2589FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default QAModal;