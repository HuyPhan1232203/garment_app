import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/styles/default";
import { Header } from "@/components/Header";
import { AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import ModalQuantityGood from "@/components/ModalQuantityGood";

const detailed_QAQC = () => {
  const params = useLocalSearchParams();
  const [qaDetail, setQaDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

          <ModalQuantityGood
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />

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

        {/* Task info */}
        {/* <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã:</Text>
            <Text style={styles.infoValue}>{qaDetail?.code || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ca:</Text>
            <Text style={styles.infoValue}>{qaDetail?.shift === "morning" ? "Sáng" : qaDetail?.shift === "afternoon" ? "Chiều" : qaDetail?.shift}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bắt đầu:</Text>
            <Text style={styles.infoValue}>
              {qaDetail?.dateStart ? new Date(qaDetail.dateStart).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : "-"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kết thúc:</Text>
            <Text style={styles.infoValue}>
              {qaDetail?.dateEnd ? new Date(qaDetail.dateEnd).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : "-"}
            </Text>
          </View>
        </View> */}

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
          >
            <FontAwesome5 name="flag" size={24} color="#fff" />
            <Text
              style={{ ...defaultStyles.text, color: "#fff", paddingLeft: 10 }}
            >
              Báo cáo
            </Text>
          </TouchableOpacity>
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
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={{ ...defaultStyles.text, color: "#fff" }}>
              Nhập SL đạt
            </Text>
          </TouchableOpacity>
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