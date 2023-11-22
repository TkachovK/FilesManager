import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from "react"
import jwt_decode from "jwt-decode"
import { AuthContextProps, ProviderProps, User } from "../interfaces/auth"

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
  const [token, setToken_] = useState<string | null>(
    localStorage.getItem("token")
  )
  const [user, setUser_] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  )

  const setToken: Dispatch<SetStateAction<string | null>> = (newToken) => {
    setToken_(newToken)
  }

  const setUser: Dispatch<SetStateAction<User | null>> = (newUser) => {
    setUser_(newUser)
  }

  useEffect(() => {
    if (token) {
      const decodedUser = jwt_decode(token) as User
      setUser(decodedUser)
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(decodedUser))
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }, [token])

  const contextValue = useMemo(() => {
    return {
      token,
      user,
      setToken,
      setUser,
    }
  }, [token, user])

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthProvider