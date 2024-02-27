import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState({});

  useEffect(() => {
    fetchTodos();
  }, [selectedDate]); // selectedDate가 변경될 때마다 fetchTodos 함수를 호출

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`http://192.168.0.160:8080/api/todos`);
      const todosData = response.data;
      setTodos(todosData);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!selectedDate) return; // 날짜가 선택되지 않은 경우 무시
    try {
      await axios.post(`http://192.168.0.160:8080/api/todos`, {
        contents: todoText
      });
      // 성공적으로 추가되면 해당 날짜의 todos를 다시 불러옴
      fetchTodos();
    } catch (error) {
      console.error('계획 추가 실패 :', error);
    }
    setTodoText(''); // Todo 입력 창 비우기
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text>{item.contents}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true } }}
      />
      <TextInput
        style={styles.input}
        value={todoText}
        onChangeText={setTodoText}
        placeholder="Add todo"
      />
      <Button title="Add Todo" onPress={addTodo} />
      <FlatList
        data={todos[selectedDate] || []}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  todoItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginTop: 10,
    borderRadius: 5,
  },
});