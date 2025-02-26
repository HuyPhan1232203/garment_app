import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { defaultStyles } from "@/styles/default";
import axios from "axios";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Header } from "@/components/Header";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { storeTaskDetail } from "@/slices/taskDetailSlice";

const QATask = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchQATasks();
    }, []);

    const fetchQATasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://api-xuongmay-dev.lighttail.com/api/qadetail?pageIndex=1&pageSize=10');
            setTasks(response.data.data.items);
            console.log(response.data.data.items);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching QA tasks:', err);
            setError('Có lỗi xảy ra khi tải dữ liệu');
            setLoading(false);
        }
    };

    const handleTaskPress = (task) => {
        // Lưu thông tin task được chọn vào Redux store
        dispatch(storeTaskDetail(task));
        // Điều hướng đến trang chi tiết task
        router.push({
            pathname: "/detailed_QAQCPage/detailed_QAQC",
            params: { id: task.id, name: task.name, code: task.code }
          });          
        console.log("Task id: ",task.id);
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
                <Header text='QAQC - role' />
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[defaultStyles.container, styles.centered]}>
                <Header text='QAQC - role' />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchQATasks}>
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={defaultStyles.container}>
            <Header text='QAQC - role' />
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
    )
}

export default QATask

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
    },
    listContainer: {
        width: '100%',
        paddingBottom: 16,
    },
    taskItem: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009DFF80',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    taskHeader: {
        gap: 4,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    taskText: {
        fontWeight: '500',
        marginRight: 8,
        fontSize: 24,
        color: '#003366',
    },
    taskCode: {
        fontWeight: '500',
        marginRight: 8,
        fontSize: 24,
        color: '#555',
    },
    taskName: {
        fontSize: 24,
        fontWeight: '500',
    },
    taskDescription: {
        color: '#666',
        fontSize: 14,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#0066cc',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    }
});