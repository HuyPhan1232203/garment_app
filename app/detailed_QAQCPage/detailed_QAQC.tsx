import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions // Thêm Dimensions
} from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/styles/default";
import { Header } from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

// Hàm định dạng thời gian
const formatTime = (dateString) => {
  if (!dateString) return "00:00";
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const DetailedQAQC = () => {
  const params = useLocalSearchParams();

  // State declarations
  const [qaDetail, setQaDetail] = useState(null);
  const [initialQaDetail, setInitialQaDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [defectCodes, setDefectCodes] = useState([]);
  const [selectedDefectIds, setSelectedDefectIds] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [quantityGoodTemp, setQuantityGoodTemp] = useState(0);
  const [quantityBadTemp, setQuantityBadTemp] = useState(0);
  const [defectListTemp, setDefectListTemp] = useState([]);

  // API Fetch Functions (giữ nguyên)
  const fetchDefectCodes = async () => {
    try {
      const response = await fetch(
        "https://api-xuongmay-dev.lighttail.com/api/defectcode?pageIndex=1&pageSize=10"
      );
      if (!response.ok) throw new Error(`API responded with status: ${response.status}`);
      const result = await response.json();
      console.log("✅ Fetched defect codes:", result);
      if (result.data?.items) setDefectCodes(result.data.items);
    } catch (error) {
      console.error("❌ Error fetching defect codes:", error);
    }
  };

  const fetchQaDetail = async () => {
    try {
      console.log("Fetching QA detail for ID:", params.id);
      const response = await fetch(`https://api-xuongmay-dev.lighttail.com/api/qadetail/getbyqatask/${params.id}`);
      if (!response.ok) throw new Error(`API responded with status: ${response.status}`);
      const result = await response.json();
      console.log("API Response:", result);

      if (result.data === null) {
        setError("Không có chi tiết trong khung giờ này");
        setQaDetail(null);
        setInitialQaDetail(null);
        return;
      }

      setQaDetail(result.data);
      setInitialQaDetail(result.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching QA detail:", err);
      setError(err.message);
      setQaDetail(null);
      setInitialQaDetail(null);
    } finally {
      setLoading(false);
    }
  };

  // Local Storage Functions (giữ nguyên)
  const saveToLocalStorage = async () => {
    try {
      const key = `tempQuantities_${params.id}`;
      const newValue = Number(inputValue);

      if (isNaN(newValue) || newValue <= 0) {
        console.log('❌ Invalid quantity');
        return;
      }

      let newTempData;

      if (selectedDefectIds.length > 0) {
        const selectedDefects = defectCodes.filter(defect => selectedDefectIds.includes(defect.id));
        const defectNames = selectedDefects.map(defect => defect.name);
        const newDefectEntry = { quantity: newValue, defects: defectNames };
        newTempData = [...defectListTemp, newDefectEntry];
        setDefectListTemp(newTempData);
        setQuantityBadTemp(prev => prev + newValue);
      } else {
        newTempData = {
          quantityGoodTemp: quantityGoodTemp + newValue,
          quantityBadTemp: quantityBadTemp,
        };
        setQuantityGoodTemp(prev => prev + newValue);
      }

      await AsyncStorage.setItem(key, JSON.stringify(newTempData));
      console.log(`✅ Saved to local:`, newTempData);

      setInputValue('');
      console.log('✅ Reset input');
    } catch (error) {
      console.error('❌ Error saving to local storage:', error);
    }
  };

  const loadFromLocalStorage = async () => {
    try {
      const key = `tempQuantities_${params.id}`;
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const tempData = JSON.parse(value);

        if (Array.isArray(tempData)) {
          setDefectListTemp(tempData);
          setQuantityBadTemp(tempData.reduce((sum, item) => sum + item.quantity, 0));
          setQuantityGoodTemp(0);
        } else {
          setQuantityGoodTemp(tempData.quantityGoodTemp || 0);
          setQuantityBadTemp(tempData.quantityBadTemp || 0);
          setDefectListTemp([]);
        }
        console.log('✅ Loaded from local storage:', tempData);
      }
    } catch (error) {
      console.error('❌ Error loading from local storage:', error);
    }
  };

  const resetLocalStorage = async () => {
    try {
      const key = `tempQuantities_${params.id}`;
      await AsyncStorage.removeItem(key);
      setQuantityGoodTemp(0);
      setQuantityBadTemp(0);
      setDefectListTemp([]);
      setInputValue('');
      console.log('✅ Cleared local storage');
    } catch (error) {
      console.error('❌ Error clearing local storage:', error);
    }
  };

  const saveSelectedDefectsToLocal = async (defectIds) => {
    try {
      const key = `selectedDefects_${params.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(defectIds));
      console.log('✅ Saved defect IDs:', defectIds);
    } catch (error) {
      console.error('❌ Error saving defect IDs:', error);
    }
  };

  const loadSelectedDefectsFromLocal = async () => {
    try {
      const key = `selectedDefects_${params.id}`;
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setSelectedDefectIds(JSON.parse(value));
        console.log('✅ Loaded defect IDs:', value);
      }
    } catch (error) {
      console.error('❌ Error loading defect IDs:', error);
    }
  };

  const resetDefectSelection = async () => {
    try {
      const key = `selectedDefects_${params.id}`;
      await AsyncStorage.removeItem(key);
      setSelectedDefectIds([]);
      console.log('✅ Reset defect selection');
    } catch (error) {
      console.error('❌ Error resetting defect selection:', error);
    }
  };

  // Handler Functions (giữ nguyên)
  const handleDefectSelect = (defectId) => {
    setSelectedDefectIds(prev => {
      let newSelectedIds;
      if (prev.includes(defectId)) {
        newSelectedIds = prev.filter(id => id !== defectId);
      } else {
        newSelectedIds = [...prev, defectId];
      }
      saveSelectedDefectsToLocal(newSelectedIds);
      return newSelectedIds;
    });
  };

  const handleReport = async () => {
    const quantityInput = Number(inputValue);
    const totalProduct = qaDetail?.quantityProduct || 0;

    if (isNaN(quantityInput) || quantityInput < 0) {
      alert('Số lượng không hợp lệ!');
      return;
    }

    try {
      let totalTempGood = quantityGoodTemp;
      let totalTempBad = quantityBadTemp;

      if (defectListTemp.length > 0) {
        totalTempBad = defectListTemp.reduce((sum, item) => sum + item.quantity, 0);
      } else if (selectedDefectIds.length === 0) {
        totalTempGood += quantityInput;
      } else {
        totalTempBad += quantityInput;
      }

      const shouldUpdateGood = totalTempGood > 0;
      const shouldUpdateBad = totalTempBad > 0;

      if (shouldUpdateGood) {
        const goodData = {
          typeQuantity: 0,
          quantity: totalTempGood,
        };

        console.log("📌 Sending update quantityGood:", goodData);
        const goodResponse = await fetch(
          `https://api-xuongmay-dev.lighttail.com/api/qadetail/updatequantity/${qaDetail?.id}`,
          {
            method: "PATCH",
            headers: {
              "accept": "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(goodData),
          }
        );

        const goodResult = await goodResponse.json();
        if (!goodResponse.ok) throw new Error(goodResult?.ErrorMessage || 'Error updating quantityGood');
        console.log("✅ QuantityGood updated:", goodResult);
      }

      if (shouldUpdateBad) {
        const badData = {
          typeQuantity: 1,
          quantity: totalTempBad,
        };

        console.log("📌 Sending update quantityBad:", badData);
        const badResponse = await fetch(
          `https://api-xuongmay-dev.lighttail.com/api/qadetail/updatequantity/${qaDetail?.id}`,
          {
            method: "PATCH",
            headers: {
              "accept": "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(badData),
          }
        );

        const badResult = await badResponse.json();
        if (!badResponse.ok) throw new Error(badResult?.ErrorMessage || 'Error updating quantityBad');
        console.log("✅ QuantityBad updated:", badResult);

        if (totalTempBad > 0) {
          let defectCodeIdList = [];

          if (defectListTemp.length > 0) {
            defectListTemp.forEach(entry => {
              const defectIds = defectCodes
                .filter(d => entry.defects.includes(d.name))
                .map(d => d.id);
              defectCodeIdList = [...new Set([...defectCodeIdList, ...defectIds])];
            });
          } else if (selectedDefectIds.length > 0) {
            defectCodeIdList = selectedDefectIds;
          }

          if (defectCodeIdList.length > 0) {
            const defectData = {
              defectCodeIdList: defectCodeIdList,
              quantity: totalTempBad,
              qaDetailId: qaDetail?.id,
            };

            console.log("📌 Sending defect data:", defectData);
            const defectResponse = await fetch(
              'https://api-xuongmay-dev.lighttail.com/api/defectproduct/addmanydefect',
              {
                method: 'POST',
                headers: {
                  "accept": "*/*",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(defectData),
              }
            );

            const defectResult = await defectResponse.json();
            if (!defectResponse.ok) throw new Error(defectResult?.ErrorMessage || 'Error creating defect');
            console.log("✅ Defect created:", defectResult);
          }
        }
      }

      setInputValue('');
      setSelectedDefectIds([]);
      setQuantityGoodTemp(0);
      setQuantityBadTemp(0);
      setDefectListTemp([]);
      await Promise.all([
        AsyncStorage.removeItem(`tempQuantities_${params.id}`),
        AsyncStorage.removeItem(`selectedDefects_${params.id}`),
      ]);

      await fetchQaDetail();

      alert('Báo cáo số lượng thành công!');
    } catch (error) {
      console.error('❌ Error reporting:', error);
      alert(`Có lỗi xảy ra: ${error.message}`);
    }
  };

  // Effects (giữ nguyên)
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchQaDetail(),
        fetchDefectCodes(),
        loadFromLocalStorage(),
        loadSelectedDefectsFromLocal()
      ]);
    };
    initializeData();
  }, [params.id]);

  // Render Logic
  if (loading) return (
    <View style={defaultStyles.container}>
      <Header text="Chi tiết QA" isChild={true} />
      <ActivityIndicator size="large" color="#009DFF" />
    </View>
  );
  if (error) return (
    <View style={defaultStyles.container}>
      <Header text="Chi tiết QA" isChild={true} />
      <View style={[styles.errorContainer, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[defaultStyles.text, styles.errorText]}>{error}</Text>
      </View>
    </View>
  );

  const headerText = qaDetail?.name && qaDetail?.code
    ? `${qaDetail.name} - ${qaDetail.code}`
    : "Chi tiết QA";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={defaultStyles.container}
      keyboardVerticalOffset={height * 0.035} // Sử dụng Dimensions thay cho giá trị cố định 20
    >
      <Header text={headerText} isChild={true} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "column", alignItems: "center", paddingBottom: height * 0.06 }}>
          {/* Quantity Display */}
          <View style={styles.quantityTextContainer}>
            <View style={{ flexDirection: "row", justifyContent:'center', alignItems:'center'}}>
              <Ionicons name="calculator-outline" size={width * 0.06} color="black" />
              <Text style={styles.quantityText}>Tổng số lượng:</Text>
            </View>
            <Text style={styles.quantityText}>{qaDetail?.quantityProduct || 0}</Text>
          </View>

          {/* Detail Quantity */}
          <View style={styles.detailQuantContainer}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <View style={styles.detailQuant}>
                <Text style={defaultStyles.text}>Sản phẩm đạt</Text>
                <Text style={[defaultStyles.text, { color: "#18611E", fontWeight: 600, paddingTop: height * 0.018 }]}>
                  {quantityGoodTemp}
                </Text>
              </View>
              <View style={styles.detailQuant}>
                <Text style={defaultStyles.text}>Sản phẩm lỗi</Text>
                <Text style={[defaultStyles.text, { color: "#FF0000", fontWeight: 600, paddingTop: height * 0.018 }]}>
                  {quantityBadTemp}
                </Text>
              </View>
            </View>
            <View style={styles.detailQuant}>
              <Text style={defaultStyles.text}>Khung giờ</Text>
              <Text style={[defaultStyles.text, { color: "#FF0000", fontWeight: 600, paddingTop: height * 0.018 }]}>
                {formatTime(qaDetail?.dateStart)} - {formatTime(qaDetail?.dateEnd)}
              </Text>
            </View>
          </View>

          {/* Feature Buttons */}
          <View style={styles.featureContainer}>
            <TouchableOpacity style={[styles.feature, {backgroundColor:"#1C9D1F"}]} onPress={resetDefectSelection}>
              <Text style={{ ...defaultStyles.text, color: "#fff" }}>Đặt lại ô nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.feature, {backgroundColor:"#2589FF"}]} onPress={handleReport}>
              <Text style={{ ...defaultStyles.text, color: "#fff" }}>Báo cáo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.feature, {backgroundColor:"#1C9D1F"}]} onPress={resetLocalStorage}>
              <Text style={{ ...defaultStyles.text, color: "#fff" }}>Xóa dữ liệu local</Text>
            </TouchableOpacity>
          </View>

          {/* Defect Codes Selection */}
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
                <Text style={[styles.numberText, { color: defect.textColor || '#000' }]}>
                  {defect.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Nhập số lượng"
              placeholderTextColor="#666"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              returnKeyType="done"
            />
            {inputValue.trim() !== '' && (
              <TouchableOpacity style={styles.doneButton} onPress={saveToLocalStorage}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DetailedQAQC;

const styles = StyleSheet.create({
  quantityTextContainer: {
    marginVertical: height * 0.018, // 1.8% chiều cao màn hình thay cho 15
    backgroundColor: "#D9D9D9",
    borderRadius: width * 0.025, // 2.5% chiều rộng màn hình thay cho 10
    paddingVertical: height * 0.018, // 1.8% chiều cao thay cho 15
    paddingHorizontal: width * 0.025, // 2.5% chiều rộng thay cho 10
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.9, // 90% chiều rộng màn hình thay cho "90%"
    alignItems: "center",
  },
  quantityText: {
    ...defaultStyles.text,
    fontWeight: '500',
    fontSize: width * 0.04, // 4% chiều rộng thay cho giá trị mặc định
  },
  detailQuantContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#009DFF80",
    paddingVertical: height * 0.022, // 2.2% chiều cao thay cho 18
    paddingHorizontal: width * 0.037, // 3.7% chiều rộng thay cho 15
    borderRadius: width * 0.025, // 2.5% chiều rộng thay cho 10
    width: '100%',
  },
  detailQuant: {
    flexDirection: "column",
    alignItems: "center",
  },
  featureContainer: {
    gap: width * 0.025, // 2.5% chiều rộng thay cho 10
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.025, // 2.5% chiều cao thay cho 20
    flexWrap: "wrap",
  },
  feature: {
    alignItems: "center",
    width: 'auto',
    height: height * 0.052, // 5.2% chiều cao thay cho 42
    paddingHorizontal: width * 0.037, // 3.7% chiều rộng thay cho 15
    borderRadius: width * 0.012, // 1.2% chiều rộng thay cho 5
    marginVertical: height * 0.012, // 1.2% chiều cao thay cho 10
    justifyContent: "center",
  },
  allnumberContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: width * 0.9, // 90% chiều rộng thay cho "90%"
    gap: width * 0.02, // 2% chiều rộng thay cho 8
    marginTop: height * 0.037, // 3.7% chiều cao thay cho 30
    justifyContent: 'space-between',
  },
  numberWrapper: {
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: height * 0.0037 }, // 0.37% chiều cao thay cho 3
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: width * 0.012, // 1.2% chiều rộng thay cho 4.65
    elevation: 7,
    borderRadius: width * 0.012, // 1.2% chiều rộng thay cho 5
    width: width * 0.44, // 48% chiều rộng thay cho '48%'
  },
  numberText: {
    fontSize: width * 0.035, // 3.5% chiều rộng thay cho 14
    fontWeight: '500',
    paddingVertical: height * 0.018, // 1.8% chiều cao thay cho 15
    paddingHorizontal: width * 0.037, // 3.7% chiều rộng thay cho 15
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.8, // 80% chiều rộng thay cho 319
    height: height * 0.06, // 6% chiều cao thay cho 50
    backgroundColor: '#fff',
    marginTop: height * 0.025, // 2.5% chiều cao thay cho 20
    paddingLeft: width * 0.037, // 3.7% chiều rộng thay cho 15
    borderRadius: width * 0.025, // 2.5% chiều rộng thay cho 10
    shadowOffset: { width: 0, height: height * 0.0025 }, // 0.25% chiều cao thay cho 2
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: width * 0.01, // 1% chiều rộng thay cho 3.84
    elevation: 5,
  },
  input: {
    fontSize: width * 0.04, // 4% chiều rộng thay cho 16
    color: '#333',
  },
  doneButton: {
    backgroundColor: '#009DFF',
    paddingVertical: height * 0.012, // 1.2% chiều cao thay cho 10
    paddingHorizontal: width * 0.037, // 3.7% chiều rộng thay cho 15
    borderRadius: width * 0.02, // 2% chiều rộng thay cho 8
    marginLeft: width * 0.025, // 2.5% chiều rộng thay cho 10
  },
  doneButtonText: {
    color: '#fff',
    fontSize: width * 0.04, // 4% chiều rộng thay cho 16
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: width * 0.04, // 4% chiều rộng thay cho 16
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});