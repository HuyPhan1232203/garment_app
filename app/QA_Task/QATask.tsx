import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions // Thêm Dimensions
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { defaultStyles } from "@/styles/default";
  import axios from "axios";
  import { useLocalSearchParams } from "expo-router/build/hooks";
  import { Header } from "@/components/Header";
  import { router } from "expo-router";
  import { useDispatch } from "react-redux";
  import { storeTaskDetail } from "@/slices/taskDetailSlice";
  
  // Lấy kích thước màn hình
  const { width, height } = Dimensions.get('window');
  
  const QATask = () => {
    const { id, name } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
  
    useEffect(() => {
      fetchQATasks();
    }, [id]); // Thêm id vào dependency array
  
    const fetchQATasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api-xuongmay-dev.lighttail.com/api/qatask/getqalist?pageIndex=1&pageSize=10&departmentId=${id}`
        );
        setTasks(response.data.data.items);
        console.log("Dữ liệu nhận được:", response.data.data.items);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
        setLoading(false);
      }
    };
  
    const handleTaskPress = (task) => {
      // Lưu thông tin task vào Redux store
      dispatch(storeTaskDetail(task));
      
      // Điều hướng đến trang chi tiết và truyền params
      router.push({
        pathname: "/detailed_QAQCPage/detailed_QAQC",
        params: { 
          id: task.id,
          name: task.name,
          code: task.code,
          quantityProduct: task.quantityProduct
        }
      });          
      console.log("Task được chọn:", task);
    };
  
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => handleTaskPress(item)}
      >
        <View style={styles.taskHeader}>
          <Text style={styles.taskText}>{item.code}</Text>
          <Text style={styles.taskText}>-</Text>
          <Text style={styles.taskText}>{item.name}</Text>
        </View>
        <Text style={styles.taskText} numberOfLines={2}>
          Số lượng: {item.quantityProduct || "--"}
        </Text>
      </TouchableOpacity>
    );
  
    if (loading) {
      return (
        <View style={[defaultStyles.container, styles.centered]}>
          <Header text='QAQC - role' isChild={true} />
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={[defaultStyles.container, styles.centered]}>
          <Header text='QAQC - role' isChild={true} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchQATasks}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    return (
      <View style={defaultStyles.container}>
        <Header text={`QAQC - ${name}`} isChild={true} />
        <View style={styles.container}>
          <Text style={styles.title}>Danh sách tasks QAQC</Text>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Không có task</Text>
            }
          />
        </View>
      </View>
    );
  };
  
  export default QATask;
  
  const styles = StyleSheet.create({
    container: {
      padding: width * 0.04, // 4% chiều rộng thay cho 16
      flex: 1,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      alignSelf: 'center',
      fontSize: width * 0.06, // 6% chiều rộng thay cho 24
      fontWeight: '700',
      marginBottom: height * 0.02, // 2% chiều cao thay cho 16
    },
    listContainer: {
      width: '100%',
      paddingBottom: height * 0.02, // 2% chiều cao thay cho 16
    },
    taskItem: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#009DFF80',
      padding: width * 0.04, // 4% chiều rộng thay cho 16
      borderRadius: width * 0.02, // 2% chiều rộng thay cho 8
      marginBottom: height * 0.015, // 1.5% chiều cao thay cho 12
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: height * 0.0012 }, // 0.12% chiều cao thay cho 1
      shadowOpacity: 0.22,
      shadowRadius: width * 0.0055, // 0.55% chiều rộng thay cho 2.22
    },
    taskHeader: {
      gap: width * 0.01, // 1% chiều rộng thay cho 4
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: height * 0.01, // 1% chiều cao thay cho 8
    },
    taskText: {
      fontWeight: '500',
      marginRight: width * 0.02, // 2% chiều rộng thay cho 8
      fontSize: width * 0.06, // 6% chiều rộng thay cho 24
      color: '#003366',
    },
    taskCode: {
      fontWeight: '500',
      marginRight: width * 0.02, // 2% chiều rộng thay cho 8
      fontSize: width * 0.06, // 6% chiều rộng thay cho 24
      color: '#555',
    },
    taskName: {
      fontSize: width * 0.06, // 6% chiều rộng thay cho 24
      fontWeight: '500',
    },
    taskDescription: {
      color: '#666',
      fontSize: width * 0.035, // 3.5% chiều rộng thay cho 14
    },
    errorText: {
      color: 'red',
      marginBottom: height * 0.02, // 2% chiều cao thay cho 16
      textAlign: 'center',
      fontSize: width * 0.04, // 4% chiều rộng thay cho giá trị mặc định
    },
    retryButton: {
      backgroundColor: '#0066cc',
      paddingVertical: height * 0.01, // 1% chiều cao thay cho 8
      paddingHorizontal: width * 0.04, // 4% chiều rộng thay cho 16
      borderRadius: width * 0.01, // 1% chiều rộng thay cho 4
    },
    retryButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: width * 0.04, // 4% chiều rộng thay cho giá trị mặc định
    },
    emptyText: {
      textAlign: 'center',
      marginTop: height * 0.025, // 2.5% chiều cao thay cho 20
      color: '#666',
      fontSize: width * 0.04, // 4% chiều rộng thay cho giá trị mặc định
    },
  });