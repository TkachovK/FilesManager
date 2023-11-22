import { Dispatch, ReactNode, SetStateAction } from "react"

export interface User {
  name?: string
  email?: string
  avatar?: string
}

export interface UserContextProps {
  user: User
  setUser: React.Dispatch<React.SetStateAction<any>>
}

export interface ProviderProps {
  children: ReactNode
}

export interface AuthUserProps {
  token: string | null
  user: User | null
}

export interface AuthContextProps extends AuthUserProps {
  setToken: Dispatch<SetStateAction<string | null>>
  setUser: Dispatch<SetStateAction<User | null>>
}
