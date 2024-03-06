import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';

// 선택된 날짜, Todo 입력 텍스트, 할일 목록을 상태로 관리
export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState([]);

  // 캘린더에서 날짜를 선택했을 때 호출되는 함수
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString); // 선택한 날짜를 상태에 설정
    fetchTodos(day.dateString); // 선택한 날짜에 해당하는 할일 목록을 가져오기 위해 fetchTodos 함수 호출
  };

  const fetchTodos = (selectedDate) => {
    axios.get('http://192.168.0.160:8080/api/todos', {
      params: { // params는 axios에서 사용되는 옵션 중 하나로, HTTP 요청에 쿼리 문자열을 추가하는 데 사용 선택한 날짜를 서버에 전달하기 위함
        date: selectedDate // 선택한 날짜를 서버로 전달하기 위해 쿼리 매개변수로 설정
      }
    })
    .then(response => {
      console.log(response.data); // 서버로부터 받은 응답 데이터 출력
      setTodos(response.data); // 받아온 할일 목록을 상태에 설정
    })
    .catch(error => {
      console.error('Error fetching todos:', error);
      // 에러 처리
    });
  };

  const addTodo = () => {
    axios.post('http://192.168.0.160:8080/api/todos', {
      contents: todoText,  // 할일 내용을 서버에 전달하기 위한 데이터
      registDate: selectedDate, // 할일 등록 날짜를 서버에 전달하기 위한 데이터
      isCompleted: false // 할일 완료 여부를 서버에 전달하기 위한 데이터
    })
    .then(response => {
      console.log(response.data); // 서버로부터 받은 응답 데이터 출력
      // 서버로부터 응답을 받은 후 필요한 작업 수행
  
      // Todo 목록을 업데이트할 수 있도록 코드를 추가하세요
      fetchTodos(selectedDate); // 예시로 fetchTodos 함수를 호출하여 할일 목록을 다시 가져옵니다.
    })
    .catch(error => {
      console.error('Error adding todo:', error);
      // 에러 처리
    });
    
    setTodoText(''); // Todo 입력 창 비우기
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text>{todos.contents}</Text> {/* 할일 내용을 출력 */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress} // 날짜를 선택했을 때 호출되는 함수 설정
        markedDates={{ [selectedDate]: { selected: true } }} // 선택된 날짜를 표시
      />
      <TextInput
        style={styles.input}
        value={todoText}
        onChangeText={setTodoText}
        placeholder="Add todo"
      />
      <Button title="Add Todo" onPress={addTodo} />
      <FlatList
        data={todos}
        renderItem={({ item }) => <Text>{item.contents}</Text>} // 할일 목록 아이템을 렌더링하는 함수 설정
        keyExtractor={(item) => item.id.toString()} // 각 아이템의 고유 키 설정
      /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});