import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/styles/default";
import { Header } from "@/components/Header";
import { AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import QAModal from "@/components/QAModal";
import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const detailed_QAQC = () => {
  const params = useLocalSearchParams();
  const [qaDetail, setQaDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisibleQG, setModalVisibleQG] = useState(false);
  const [modalVisibleQB, setModalVisibleQB] = useState(false); // Thêm state này
  const [inputValue, setInputValue] = useState('');

  const handleSubmitBad = async (value) => {
    console.log("📌 Người dùng nhập số lượng lỗi:", value);
    console.log("📌 Đang gửi PUT request với ID:", params.id);

    const quantityBad = Number(value);
    if (isNaN(quantityBad) || quantityBad < 0) {
      console.error("❌ Giá trị không hợp lệ!");
      return;
    }

    // Kiểm tra quantityBad không vượt quá quantityProduct
    const totalProduct = qaDetail?.quantityProduct || 0;
    if (quantityBad > totalProduct) {
      console.error("❌ Số lượng lỗi không thể lớn hơn tổng số sản phẩm!");
      return;
    }

    // Hàm chuẩn hóa định dạng ngày thành YYYY-MM-DD HH:mm
    const formatDate = (date) => {
      if (!date) return "2025-07-02 00:00"; // Giá trị mặc định nếu không có
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const updatedData = {
      code: qaDetail?.code || "QAD00004",
      name: qaDetail?.name || "string",
      description: qaDetail?.description || "string",
      quantityGood: qaDetail?.quantityGood || 0,
      quantityBad: quantityBad,
      quantityProduct: totalProduct,
      dateStart: formatDate(qaDetail?.dateStart),
      dateEnd: formatDate(qaDetail?.dateEnd),
      qaTaskId: qaDetail?.qaTaskId || params.id,
      shift: qaDetail?.shift || "string",
    };

    try {
      const response = await fetch(`https://api-xuongmay-dev.lighttail.com/api/qadetail/${params.id}`, {
        method: "PUT",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      console.log("📌 API Response (raw):", result);
      console.log("📌 Response status:", response.status);
      console.log("📌 JSON body gửi đi:", JSON.stringify(updatedData, null, 2));

      if (response.ok && result?.statusCode === 200) {
        console.log("✅ Cập nhật số lượng lỗi thành công:", result.data?.message || "Thành công");
        setQaDetail((prev) => ({
          ...prev,
          quantityBad: quantityBad,
        }));
        setModalVisibleQB(false);
      } else {
        const errorMsg = result?.ErrorMessage || result?.message || "API không trả về thông tin lỗi rõ ràng";
        console.error("❌ Lỗi từ API:", errorMsg);
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi request:", error.message);
    }
  };

  //hàm báo cáo số lượng 
  const handleReport = async () => {
    // Kiểm tra xem đã nhập số lượng chưa
    if (!inputValue || inputValue.trim() === '') {
      alert('Vui lòng nhập số lượng sản phẩm đạt!');
      return;
    }

    const quantityGood = Number(inputValue);

    // Kiểm tra số lượng hợp lệ
    if (isNaN(quantityGood) || quantityGood < 0) {
      alert('Số lượng không hợp lệ!');
      return;
    }

    // Kiểm tra số lượng không vượt quá tổng số
    const totalProduct = qaDetail?.quantityProduct || 0;
    if (quantityGood > totalProduct) {
      alert('Số lượng đạt không thể lớn hơn tổng số sản phẩm!');
      return;
    }

    try {
      const updatedData = {
        code: qaDetail?.code || "QAD00004",
        name: qaDetail?.name || "string",
        description: qaDetail?.description || "string",
        quantityGood: quantityGood,
        quantityBad: qaDetail?.quantityBad || 0,
        quantityProduct: totalProduct,
        dateStart: qaDetail?.dateStart,
        dateEnd: qaDetail?.dateEnd,
        qaTaskId: qaDetail?.qaTaskId || params.id,
        shift: qaDetail?.shift || "string",
      };

      const response = await fetch(
        `https://api-xuongmay-dev.lighttail.com/api/qadetail/${params.id}`,
        {
          method: "PUT",
          headers: {
            "accept": "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();

      if (response.ok && result?.statusCode === 200) {
        // Cập nhật state local
        setQaDetail(prev => ({
          ...prev,
          quantityGood: quantityGood
        }));

        // Xóa dữ liệu input và local storage
        setInputValue('');
        await AsyncStorage.removeItem(`qaDetail_${params.id}`);

        alert('Báo cáo số lượng thành công!');
      } else {
        alert('Có lỗi xảy ra khi báo cáo!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi báo cáo:', error);
      alert('Có lỗi xảy ra khi báo cáo!');
    }
  };

  const saveToLocalStorage = async (value) => {
    try {
      const key = `qaDetail_${params.id}`;
      await AsyncStorage.setItem(key, value);
      console.log('✅ Đã lưu dữ liệu vào local storage');
    } catch (error) {
      console.error('❌ Lỗi khi lưu dữ liệu:', error);
    }
  };

  const loadFromLocalStorage = async () => {
    try {
      const key = `qaDetail_${params.id}`;
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setInputValue(value);
        console.log('✅ Đã lấy dữ liệu từ local storage:', value);
      }
    } catch (error) {
      console.error('❌ Lỗi khi lấy dữ liệu:', error);
    }
  };

  useEffect(() => {
    const fetchQaDetail = async () => {
      try {
        console.log("Fetching QA detail for ID:", params.id);
        const response = await fetch(`https://api-xuongmay-dev.lighttail.com/api/qadetail/getbyqatask/${params.id}`);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.data === null) {
          setError("Không có chi tiết trong khung giờ này");
          setQaDetail(null);
          setLoading(false);
          return; // Thêm return để dừng execution
        }

        setQaDetail(result.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching QA detail:", err);
        setError(err.message);
        setQaDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQaDetail();
    loadFromLocalStorage();
  }, [params.id]);

  // Thêm hàm formatTime để định dạng giờ
  const formatTime = (dateString) => {
    if (!dateString) return "00:00";
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  //hàm resetLocalStorage đặt giá trị ở local = null
  const resetLocalStorage = async () => {
    try {
      const key = `qaDetail_${params.id}`;
      await AsyncStorage.removeItem(key);
      setInputValue(''); // Reset giá trị input về rỗng
      console.log('✅ Đã xóa dữ liệu local storage');
    } catch (error) {
      console.error('❌ Lỗi khi xóa dữ liệu:', error);
    }
  };

  if (loading) {
    return (
      <View style={[defaultStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#009DFF" />
        <Text style={defaultStyles.text}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={defaultStyles.container}>
        <Header text="Chi tiết QA" />
        <View style={[styles.errorContainer, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[defaultStyles.text, styles.errorText]}>{error}</Text>
        </View>
      </View>
    );
  }

  // Create a header text that combines name and code
  const headerText = qaDetail?.name && qaDetail?.code
    ? `${qaDetail.name} - ${qaDetail.code}`
    : "Chi tiết QA";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={defaultStyles.container}
      keyboardVerticalOffset={20} // Thêm offset 20 đơn vị
    >
      <Header text={headerText} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 50 // Thêm padding bottom để tránh bàn phím
        }}>
          {/* quantity */}
          <View style={styles.quantityTextContainer}>
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="calculator-outline" size={24} color="black" />
              <Text style={styles.quantityText}>Tổng số lượng:</Text>
            </View>
            <Text style={styles.quantityText}>{qaDetail?.quantityProduct || 0}</Text>
          </View>
          {/* detail quantity  */}
          <View style={styles.detailQuantContainer}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <View style={styles.detailQuant}>
                <Text style={defaultStyles.text}>Sản phẩm đạt</Text>
                <Text
                  style={[
                    defaultStyles.text,
                    { color: "#18611E", fontWeight: 600, paddingTop: 15 },
                  ]}
                >
                  {qaDetail?.quantityGood || 0}
                </Text>
              </View>

              <View style={styles.detailQuant}>
                <Text style={defaultStyles.text}>Sản phẩm lỗi</Text>
                <Text
                  style={[
                    defaultStyles.text,
                    { color: "#FF0000", fontWeight: 600, paddingTop: 15 },
                  ]}
                >
                  {qaDetail?.quantityBad || 0}
                </Text>
              </View>
            </View>
            <View style={styles.detailQuant}>
              <Text style={defaultStyles.text}>Giờ kết thúc</Text>
              <Text
                style={[
                  defaultStyles.text,
                  { color: "#FF0000", fontWeight: 600, paddingTop: 15 },
                ]}
              >
                {formatTime(qaDetail?.dateEnd) || "00:00"}
              </Text>
            </View>
          </View>

          {/* feature */}
          <View style={styles.featureContainer}>
            <TouchableOpacity style={[styles.feature, {}]}>
              <Text style={{ ...defaultStyles.text, color: "#fff" }}>
                Đặt lại ô nhập
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feature, {}]}
              onPress={handleReport}
            >
              <Text style={{ ...defaultStyles.text, color: "#fff" }}>
                Báo cáo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feature, {}]}
              onPress={resetLocalStorage}
            >
              <Text style={{ ...defaultStyles.text, color: "#fff" }}>
                Đặt lại dữ liệu local
              </Text>
            </TouchableOpacity>
          </View>
          {/* Choose number */}
          <View style={styles.allnumberContainer}>
            {/* Mỗi button lỗi */}
            <TouchableOpacity style={styles.numberWrapper}>
              <Text style={styles.numberText}>Chỉ Thừa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberWrapper}>
              <Text style={styles.numberText}>Cháy thủng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberWrapper}>
              <Text style={styles.numberText}>Bông rộp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberWrapper}>
              <Text style={styles.numberText}>Rách</Text>
            </TouchableOpacity>
            <Text>
              Fetch api mã lỗi
            </Text>
          </View>
          <TextInput
            style={[styles.input, { marginBottom: 20 }]} // Thêm marginBottom
            placeholder="Nhập số lượng"
            placeholderTextColor="#666"
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              saveToLocalStorage(text);
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            keyboardType="numeric"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default detailed_QAQC;

const styles = StyleSheet.create({
  quantityText: {
    ...defaultStyles.text,
    fontWeight: 500,
  },
  quantityTextContainer: {
    marginVertical: 30,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: 18,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 319,
    alignItems: "center",
  },
  detailQuantContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#009DFF80",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 319,
  },
  detailQuant: {
    ...defaultStyles.text,
    flexDirection: "column",
    alignItems: "center",
  },
  infoContainer: {
    width: 319,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginTop: 20,
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    ...defaultStyles.text,
    fontWeight: "500",
  },
  infoValue: {
    ...defaultStyles.text,
  },
  feature: {
    flexDirection: "row",
    backgroundColor: "#FF111191",
    alignItems: "center",
    width: 'auto',
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  featureContainer: {
    gap: 10,
    width: 319,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    flexWrap: "wrap",
  },
  numberWrapper: {
    backgroundColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: 5,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 28,
    paddingHorizontal: 25,
  },
  allnumberContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 319,
    gap: 12,
    marginTop: 30,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    width: 319,
    height: 50,
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});