// See https://gist.github.com/midudev/5ec4ff91df28bd75c2f7b6bbd7f7fc06

import { useState } from 'react'

const useLegacyState = (initialState = {}) => {
  const [state, setState] = useState(initialState)

  const setLegacyState = (partialNewState) => {
    if (typeof partialNewState === 'object' && partialNewState !== null) {
      const keys = Object.keys(partialNewState)
      const values = Object.values(partialNewState)
      const shouldSetState = keys.some((key, index) => {
        return values[index] !== state[key]
      })
      if (shouldSetState) {
        setState({ ...state, ...partialNewState })
      }
    }
  }

  return [state, setLegacyState]
}

export default useLegacyState
