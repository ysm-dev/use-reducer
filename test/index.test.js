import { renderHook } from 'react-hooks-testing-library'
import useReducer from '../lib/index.js'

const reducer = state => ({
  addTodo: text => ({ todos: [...state.todos, newTodo(text)] }),
  removeTodo: id => ({ todos: state.todos.filter(t => t.id !== id) }),
  toggleTodo: id => ({
    todos: state.todos.map(t => (t.id !== id ? t : { ...t, done: !t.done })),
  }),
  setInputText: text => ({ inputText: text }),
})

const intialState = {
  inputText: '',
  todos: [],
}

test('useReducer should returns array of state, dispatch', () => {
  const {
    result: { current },
  } = renderHook(() => useReducer(reducer, intialState))
  const [state, dispatch] = current
  expect(state).toBe(intialState)
  Object.keys(dispatch).map(key => {
    expect(typeof dispatch[key]).toBe('function')
  })
})
