import { createContext, useContext, useState } from 'react'

import { ProviderProps } from '../interfaces/auth'
import { FolderProps } from '../interfaces/folder'

interface FolderContextProps {
  rootFolder: FolderProps | null
  setRootFolder: React.Dispatch<React.SetStateAction<FolderProps | null>>
}

const FolderContext = createContext<FolderContextProps | undefined>(undefined)

const FolderProvider: React.FC<ProviderProps> = ({ children }) => {
  const [rootFolder, setRootFolder] = useState<FolderProps | null>(null)

  return <FolderContext.Provider value={{ rootFolder, setRootFolder }}>{children}</FolderContext.Provider>
}

export const useFolderContext = () => {
  const context = useContext(FolderContext)
  if (!context) {
    throw new Error('useFolderContext must be used within a FolderProvider')
  }
  return context
}

export default FolderProvider
