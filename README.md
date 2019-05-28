# useReducer2 - Simplified useReducer React hook

This library is a custom hook of [hooks API](https://reactjs.org/docs/hooks-intro.html) added in React 16.8.0.

So this document assumes you know the React hooks API.

## Why?

The hooks API has been added to React 16.8.0.

Among the several hooks provided in the [official documentation](https://reactjs.org/docs/hooks-reference.html), there is a [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) hook.

This is an example of the `useReducer` provided in the official document:

```js
const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  )
}
```

This looks great, but there are a few drawbacks.

- It uses `switch-case` statement. I think this is a bit verbose. This can be replaced by a simple object literal. (Related post: [Rewriting Javascript : Replacing the Switch Statement](https://medium.com/chrisburgin/rewriting-javascript-replacing-the-switch-statement-cfff707cf045))

- There are many duplicated and unnecessary boilerplates. For example, you should always pass an object with the action `type` string to the `dispatch` function. And you also need to write `{... state, ...}` every time to merge with the previous state in the `reducer` function.

This new useReducer solves these problems through simplifying the `reducer` and `dispatch`.

## Requirement

Requires `react@16.8.0` or later.

## Installation

```sh
$ npm i use-reducer2
```

## Usage

Example: [CodeSandBox](https://codesandbox.io/s/simple-todo-app-with-usereducer2-dgx09)

```js
import React, { memo } from 'react'
import { render } from 'react-dom'
import useReducer from 'use-reducer2'

const newTodo = value => ({
  id: Date.now().toString(),
  value,
  done: false,
})

const reducer = {
  addTodo: text => state => ({ todos: [...state.todos, newTodo(text)] }),
  removeTodo: id => state => ({
    todos: state.todos.filter(todo => todo.id !== id),
  }),
  toggleTodo: id => state => ({
    todos: state.todos.map(todo => (todo.id !== id ? todo : { ...todo, done: !todo.done })),
  }),
  setInputText: text => ({ inputText: text }),
}

const intialState = {
  inputText: '',
  todos: [],
}

const TodoItem = memo(({ id, value, done, toggleTodo, removeTodo }) => (
  <div>
    <input type="checkbox" checked={done} onChange={() => toggleTodo(id)} />
    {value}
    <button onClick={() => removeTodo(id)}>Done</button>
  </div>
))

const Input = memo(({ inputText, setInputText, addTodo }) => (
  <input
    type="text"
    value={inputText}
    onChange={({ target: { value } }) => setInputText(value)}
    onKeyPress={({ key }) => {
      key === 'Enter' && inputText && addTodo(inputText) && setInputText('')
    }}
  />
))

const App = () => {
  const [state, dispatch] = useReducer(reducer, intialState)
  const { inputText, todos } = state
  const { addTodo, setInputText } = dispatch
  return (
    <>
      <h3>Hello TODO</h3>
      <Input inputText={inputText} {...dispatch} />
      <button onClick={() => inputText && addTodo(inputText) && setInputText('')}>Add</button>
      <br />
      {todos.map(todo => (
        <TodoItem key={todo.id} {...todo} {...dispatch} />
      ))}
    </>
  )
}

render(<App />, document.getElementById('root'))
```

## Features

The reducer is an object literal with actions.

```js
const reducer = {
  addTodo: text => state => ({ todos: [...state.todos, newTodo(text)] }),
  removeTodo: id => state => ({
    todos: state.todos.filter(todo => todo.id !== id),
  }),
  toggleTodo: id => state => ({
    todos: state.todos.map(todo => (todo.id !== id ? todo : { ...todo, done: !todo.done })),
  }),
  setInputText: text => ({ inputText: text }),
}
```

Each key(action name) in this object is a function that takes a payload and returns a partial state.
If you need previous state for new partial state, then return the function that takes previous state returns new state.
This partial state automatically **`shallow merge`** to the state.
So you don't need to manually write `{ ...state, ... }` every time.
This pattern was inspired by [hyperapp](https://github.com/jorgebucaran/hyperapp).

Now, since the `dispatch` returned by useReducer is an object, not a function.
So, you can destructure and pull out the actions only you need as follows:

```js
const App = () => {
  const [state, dispatch] = useReducer(reducer, intialState)
  const { inputText, todos } = state
  const { addTodo, setInputText } = dispatch
  // ...use only "addTodo", "setInputText" in this component
}
```

Similarly, you can use the `{ ... dispatch }` syntax to pass the object to the child component, and destructuring it in `props` so that use only the action you need:

```js
const TodoItem = memo(({ id, value, done, toggleTodo, removeTodo }) => (
  <div>
    <input type="checkbox" checked={done} onChange={() => toggleTodo(id)} />
    {value}
    <button onClick={() => removeTodo(id)}>Done</button>
  </div>
))
```

## LICENSE

[MIT LICENSE](./LICENSE.md)
