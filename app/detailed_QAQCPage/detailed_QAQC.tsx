import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/styles/default";
import { Header } from "@/components/Header";
import { AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import QAModal from "@/components/QAModal";
import { createAsyncThunk } from "@reduxjs/toolkit";

const detailed_QAQC = () => {
  const params = useLocalSearchParams();
  const [qaDetail, setQaDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisibleQG, setModalVisibleQG] = useState(false);
  const [modalVisibleQB, setModalVisibleQB] = useState(false); // Thêm state này

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


  const handleSubmitGood = async (value) => {
    console.log("📌 Người dùng nhập số lượng đạt:", value);
    console.log("📌 Đang gửi PUT request với ID:", params.id);

    const quantityGood = Number(value);
    if (isNaN(quantityGood) || quantityGood < 0) {
      console.error("❌ Giá trị không hợp lệ!");
      return;
    }

    // Kiểm tra quantityGood không vượt quá quantityProduct
    const totalProduct = qaDetail?.quantityProduct || 0;
    if (quantityGood > totalProduct) {
      console.error("❌ Số lượng đạt không thể lớn hơn tổng số sản phẩm!");
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
      quantityGood: quantityGood, // Giá trị mới từ input
      quantityBad: qaDetail?.quantityBad || 0,
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
        console.log("✅ Cập nhật số lượng đạt thành công:", result.data?.message || "Thành công");
        setQaDetail((prev) => ({
          ...prev,
          quantityGood: quantityGood,
        }));
        setModalVisibleQG(false); // Đóng modal số lượng đạt
      } else {
        const errorMsg = result?.ErrorMessage || result?.message || "API không trả về thông tin lỗi rõ ràng";
        console.error("❌ Lỗi từ API:", errorMsg);
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi request:", error.message);
    }
  };

  useEffect(() => {
    const fetchQaDetail = async () => {
      try {
        console.log("Fetching QA detail for ID:", params.id);
        const response = await fetch(`https://api-xuongmay-dev.lighttail.com/api/qadetail/${params.id}`);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);
        setQaDetail(result.data);
      } catch (err) {
        console.error("Error fetching QA detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQaDetail();
    } else {
      setError("No task ID provided");
      setLoading(false);
    }
  }, [params.id]);

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
      <View style={[defaultStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[defaultStyles.text, { color: '#FF0000' }]}>Lỗi: {error}</Text>
      </View>
    );
  }

  // Create a header text that combines name and code
  const headerText = qaDetail?.name && qaDetail?.code
    ? `${qaDetail.name} - ${qaDetail.code}`
    : "Chi tiết QA";

  return (
    <View style={defaultStyles.container}>
      <Header text={headerText} />
      <View style={{ flexDirection: "column", alignItems: "center", flex: 1 }}>
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
          <View style={styles.detailQuant}>
            <Text style={defaultStyles.text}>Số lượng đạt</Text>
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
            <Text style={defaultStyles.text}>Số lượng lỗi</Text>
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

        {/* feature */}
        <View style={styles.featureContainer}>
          <TouchableOpacity style={styles.feature}>
            <Feather name="trash" size={24} color="#fff" />
            <Text
              style={{ ...defaultStyles.text, color: "#fff", paddingLeft: 10 }}
            >
              Xoá lỗi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feature, { backgroundColor: "#1C9D1F" }]}
            onPress={() => setModalVisibleQB(true)}
          >
            <FontAwesome5 name="flag" size={24} color="#fff" />
            <Text style={{ ...defaultStyles.text, color: "#fff", paddingLeft: 10 }}>
              Báo cáo
            </Text>
          </TouchableOpacity>
          <QAModal
            visible={modalVisibleQB}
            onClose={() => setModalVisibleQB(false)}
            onSubmit={handleSubmitBad}
            title="Số lượng lỗi"
            label="Nhập số lượng sản phẩm lỗi"
            placeholder="Nhập số lượng"
            keyboardType="numeric"
            cancelText="Hủy"
            submitText="Báo cáo"
            isRequired={true}
            maxLength={10}
          />

          <TouchableOpacity
            style={[styles.feature, { backgroundColor: "#2589FF" }]}
          >
            <AntDesign name="plus" size={24} color="#fff" />
            <Text
              style={{ ...defaultStyles.text, color: "#fff", paddingLeft: 10 }}
            >
              Thêm lỗi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feature, { backgroundColor: "#8979FF" }]}
            onPress={() => setModalVisibleQG(true)}
          >
            <Text style={{ ...defaultStyles.text, color: "#fff" }}>
              Nhập SL đạt
            </Text>
          </TouchableOpacity>

          <QAModal
            visible={modalVisibleQG}
            onClose={() => setModalVisibleQG(false)}
            onSubmit={handleSubmitGood}
            title="Số lượng đạt"
            label="Nhập số lượng sản phẩm đạt"
            placeholder="Nhập số lượng"
            keyboardType="numeric"
            cancelText="Hủy"
            submitText="Xác nhận"
            isRequired={true}
            maxLength={10}
          />

        </View>
        {/* Choose number */}
        <View style={styles.allnumberContainer}>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    flexDirection: "row",
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
    width: 143,
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  featureContainer: {
    width: 319,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  numberContainer: {
    fontSize: 16,
    fontWeight: 500,
    paddingVertical: 28,
    paddingHorizontal: 25,
    backgroundColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4.65, // Added for iOS
    elevation: 7, // Added for Android
  },
  allnumberContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 319,
    gap: 12,
    marginTop: 30,
  },
});