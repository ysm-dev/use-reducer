import { useState, useMemo } from 'react'

export default (reducer, initialState) => {
  const [state, setState] = useState(initialState)
  const dispatch = useMemo(
    () =>
      Object.keys(reducer).reduce((obj, key) => {
        obj[key] = payload =>
          setState(prevState => ({
            ...prevState,
            ...(typeof reducer[key](payload) === 'function' ? reducer[key](payload)(prevState) : reducer[key](payload)),
          })) || true
        return obj
      }, {}),
    [reducer],
  )
  return [state, dispatch]
}
