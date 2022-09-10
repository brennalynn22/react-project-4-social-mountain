import { useState, useEffect, useCallback, createContext } from 'react'

let logoutTimer

const AuthContext = createContext({
  token: '',
  login: () => {},
  logout: () => {},
  userId: null
})

const calculateRemainingTime = (exp) => {
  const currentTime = new Date().getTime()
  const expTime = exp 
  const remainingTime = expTime - currentTime
  return remainingTime
}

const getLocalData = () => {
  const storedToken = localStorage.getItem('token')
  const storedId = localStorage.getItem('userId')
  const storedExp = localStorage.getItem('exp')

  const remainingTime = calculateRemainingTime(storedExp)

  if (remainingTime <= 1000 * 60 * 30) {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('exp')
    return null
  }

  return {
    token: storedToken,
    duration: remainingTime,
    userId: storedId
  }

}

export const AuthContextProvider = (props) => {
  const localData = getLocalData()
  
  let initialToken
  let initialId
  if (localData) {
    initialToken = localData.token
    initialId = localData.userId

  }

  const [token, setToken] = useState(initialToken)
  const [userId, setUserId] = useState(initialId)

  const logout = useCallback(() => {
    console.log('logoutfired')
    setToken(null)
    setUserId(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('exp')

    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }
  }, []);

  const login = (token, exp, userId) => {
    setToken(token)
    setUserId(userId)
    console.log(token, userId, exp)
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('exp', exp)

    const remainingTime = calculateRemainingTime(exp)

    logoutTimer = setTimeout(logout, remainingTime)
  }
    useEffect(() => {
      if (localData) {
        logoutTimer = setTimeout(logout, localData.duration)
      }
    }, [localData, logout])

  const contextValue = {
    token,
    login,
    logout, 
    userId
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext
