import { Suspense } from 'react';
import Checkbox from 'expo-checkbox';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSuspenseQuery, QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import axios from 'axios'


export default function App() {
  return (
    <PersistQueryClientProvider
      persistOptions={{ persister: persister }}
      client={queryClient}
    >
      <View style={styles.container}>
        <Suspense fallback={<ActivityIndicator />}>
          <Todo />
        </Suspense>
      </View>
    </PersistQueryClientProvider>
  );
}

const queryClient = new QueryClient({})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

function Todo() {
  const { data: todo } = useTodo()
  return (
    <View style={{flexDirection: 'row'}}>
      <Checkbox
          value={todo.completed}
          style={{alignSelf: 'center'}}
        />
      <Text style={{marginLeft: 8}}>{todo.title}</Text>
    </View>
  )
}

function useTodo() {
  return useSuspenseQuery({
    queryKey: ['todo'],
    queryFn: async () => {
      return await fetchTodo()
    }
  })
}

async function fetchTodo() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
  return response.data
}