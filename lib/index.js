import { useState, useMemo } from 'react'

export default (reducer, initialState) => {
  const [state, setState] = useState(initialState)
  const dispatch = useMemo(
    () =>
      Object.keys(reducer(state)).reduce((obj, key) => {
        obj[key] = payload =>
          setState(prevState => ({
            ...prevState,
            ...reducer(prevState)[key](payload),
          })) || true
        return obj
      }, {}),
    [reducer],
  )
  return [state, dispatch]
}
