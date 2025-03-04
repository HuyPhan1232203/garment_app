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
  const [defectCodes, setDefectCodes] = useState([]);
  const [selectedDefectIds, setSelectedDefectIds] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const fetchDefectCodes = async () => {
    try {
      const response = await fetch(
        "https://api-xuongmay-dev.lighttail.com/api/defectcode?pageIndex=1&pageSize=10"
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Lấy danh sách mã lỗi thành công:", result);

      if (result.data?.items) {
        setDefectCodes(result.data.items);
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách mã lỗi:", error);
    }
  };

  // Thêm useEffect để fetch defect codes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchDefectCodes(),
          loadFromLocalStorage(),
          loadSelectedDefectsFromLocal() // Add this
        ]);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  //hàm báo cáo số lượng 
  const handleReport = async () => {
    // Validation checks như cũ
    if (!inputValue?.trim()) {
      alert('Vui lòng nhập số lượng sản phẩm đạt!');
      return;
    }

    const quantityGood = Number(inputValue);
    const totalProduct = qaDetail?.quantityProduct || 0;

    if (isNaN(quantityGood) || quantityGood < 0) {
      alert('Số lượng không hợp lệ!');
      return;
    }

    if (quantityGood > totalProduct) {
      alert('Số lượng đạt không thể lớn hơn tổng số sản phẩm!');
      return;
    }

    try {
      const currentQuantityGood = Number(qaDetail?.quantityGood || 0);
      const currentQuantityBad = Number(qaDetail?.quantityBad || 0);

      // Tính toán số lượng mới dựa vào có mã lỗi hay không
      const isDefectReport = selectedDefectIds.length > 0;
      const updateQuantityData = {
        typeQuantity: isDefectReport ? 1 : 0,
        quantity: Number(inputValue)
      };

      console.log("📌 QA Detail hiện tại:", qaDetail);
      console.log("📌 Có mã lỗi:", isDefectReport);
      console.log("📌 Dữ liệu gửi đi Update Quantity:", updateQuantityData);

      // Gửi request cập nhật QA Detail
      const response = await fetch(
        `https://api-xuongmay-dev.lighttail.com/api/qadetail/updatequantity/${qaDetail?.id}`,
        {
          method: "PATCH",
          headers: {
            "accept": "*/*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updateQuantityData)
        }
      );

      // Kiểm tra response.text() trước
      const responseText = await response.text();
      console.log("📌 Raw response:", responseText);

      let result = null;
      try {
        // Parse JSON từ text nếu có
        result = responseText ? JSON.parse(responseText) : null;
        console.log("📌 Parsed response:", result);
      } catch (parseError) {
        console.error("❌ Error parsing JSON:", parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok || !result) {
        throw new Error(result?.ErrorMessage || 'Có lỗi xảy ra khi cập nhật số lượng');
      }

      console.log("📌 Kết quả API Update Quantity:", result);

      if (!response.ok) {
        throw new Error(result?.ErrorMessage || 'Có lỗi xảy ra khi cập nhật số lượng');
      }

      // Nếu có mã lỗi được chọn, gửi thêm request để tạo defect product
      if (isDefectReport) {
        const defectData = {
          defectCodeId: selectedDefectIds[0],
          quantity: Number(inputValue),
          qaDetailId: qaDetail?.id
        };

        console.log("📌 Dữ liệu gửi đi cho defect:", defectData);

        const defectResponse = await fetch(
          'https://api-xuongmay-dev.lighttail.com/api/defectproduct/addmanydefect',
          {
            method: 'POST',
            headers: {
              "accept": "*/*",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(defectData)
          }
        );

        const defectResult = await defectResponse.json();
        console.log("📌 Kết quả API Defect:", defectResult);

        if (!defectResponse.ok) {
          throw new Error(defectResult?.message || defectResult?.ErrorMessage || 'Có lỗi xảy ra khi tạo defect product');
        }
        console.log("cập nhật mã lỗi thành công");

      }

      console.log("📌 QA Detail hiện tại:", qaDetail);
      console.log("📌 Số lượng đạt hiện tại:", currentQuantityGood);
      console.log("📌 Số lượng lỗi hiện tại:", currentQuantityBad);
      console.log("📌 Số lượng thêm mới:", inputValue);

      // Cập nhật state và xóa dữ liệu local
      setQaDetail(prev => ({
        ...prev,
        quantityGood: isDefectReport ? currentQuantityGood : currentQuantityGood + Number(inputValue),
        quantityBad: isDefectReport ? currentQuantityBad + Number(inputValue) : currentQuantityBad
      }));

      // Reset form và local storage
      setInputValue('');
      setSelectedDefectIds([]);
      await Promise.all([
        AsyncStorage.removeItem(`qaDetail_${params.id}`),
        AsyncStorage.removeItem(`selectedDefects_${params.id}`)
      ]);

      alert('Báo cáo số lượng thành công!');

    } catch (error) {
      console.error('❌ Lỗi khi gửi báo cáo:', error);
      alert(`Có lỗi xảy ra: ${error.message}`);
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

  const handleDefectSelect = (defectId) => {
    setSelectedDefectIds(prev => {
      let newSelectedIds;
      if (prev.includes(defectId)) {
        // Nếu click vào mã lỗi đang được chọn -> bỏ chọn
        newSelectedIds = [];
      } else {
        // Nếu click vào mã lỗi khác -> chọn mã lỗi mới và bỏ chọn mã cũ
        newSelectedIds = [defectId];
      }

      // Lưu vào local storage
      saveSelectedDefectsToLocal(newSelectedIds);
      return newSelectedIds;
    });
  };

  const saveSelectedDefectsToLocal = async (defectIds) => {
    try {
      const key = `selectedDefects_${params.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(defectIds));
      console.log('✅ Đã lưu mã lỗi vào local storage:', defectIds);
    } catch (error) {
      console.error('❌ Lỗi khi lưu mã lỗi:', error);
    }
  };

  const loadSelectedDefectsFromLocal = async () => {
    try {
      const key = `selectedDefects_${params.id}`;
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setSelectedDefectIds(JSON.parse(value));
        console.log('✅ Đã lấy mã lỗi từ local storage:', value);
      }
    } catch (error) {
      console.error('❌ Lỗi khi lấy mã lỗi:', error);
    }
  };
  const resetDefectSelection = async () => {
    try {
      const key = `selectedDefects_${params.id}`;
      await AsyncStorage.removeItem(key);
      setSelectedDefectIds([]); // Reset về mảng rỗng
      console.log('✅ Đã xóa mã lỗi khỏi local storage');
    } catch (error) {
      console.error('❌ Lỗi khi xóa mã lỗi:', error);
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
              <Text style={defaultStyles.text}>Khung giờ</Text>
              <Text
                style={[
                  defaultStyles.text,
                  { color: "#FF0000", fontWeight: 600, paddingTop: 15 },
                ]}
              >
                {formatTime(qaDetail?.dateStart) || "00:00"}
                -
                {formatTime(qaDetail?.dateEnd) || "00:00"}
              </Text>
            </View>
          </View>

          {/* feature */}
          <View style={styles.featureContainer}>
            <TouchableOpacity
              style={[styles.feature, {}]}
              onPress={resetDefectSelection}
            >
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
                Xóa dữ liệu local
              </Text>
            </TouchableOpacity>
          </View>
          {/* Choose number */}
          <View style={styles.allnumberContainer}>
            {defectCodes.map((defect) => (
              <TouchableOpacity
                key={defect.id}
                style={[
                  styles.numberWrapper,
                  {
                    backgroundColor: defect.backGroundColor || '#fff',
                    borderWidth: selectedDefectIds.includes(defect.id) ? 3 : 0,
                    borderColor: selectedDefectIds.includes(defect.id) ? '#009DFF' : 'transparent'
                  }
                ]}
                onPress={() => handleDefectSelect(defect.id)}
              >
                <Text style={[
                  styles.numberText,
                  {
                    color: defect.textColor || '#000'
                  }
                ]}>
                  {defect.name}
                </Text>
              </TouchableOpacity>
            ))}
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
    width: '100%',
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
    width: "100%",
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
    // Thêm width để item nhỏ hơn
    width: '48%', // Cho phép 2 item trên một hàng
  },
  numberText: {
    fontSize: 14, // Giảm font size từ 16 xuống 14
    fontWeight: '500',
    paddingVertical: 15, // Giảm padding từ 28 xuống 15
    paddingHorizontal: 15, // Giảm padding từ 25 xuống 15
    textAlign: 'center', // Căn giữa text
  },
  allnumberContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 319,
    gap: 8, // Giảm gap từ 12 xuống 8
    marginTop: 30,
    justifyContent: 'space-between', // Căn đều các items
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