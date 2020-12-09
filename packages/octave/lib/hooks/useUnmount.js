// See https://github.com/streamich/react-use/blob/master/src/useUnmount.ts

import { useRef } from 'react'
import useEffectOnce from './useEffectOnce'

const useUnmount = (fn) => {
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffectOnce(() => {
    return () => {
      fnRef.current()
    }
  })
}

export default useUnmount
