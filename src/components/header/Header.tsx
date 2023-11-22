import { Box, Grid } from '@mui/material'
import StyledSearchInput from '../styled/StyledSearchInput'
import UserProfile from '../user-profile/UserProfile'
import { AuthUserProps } from '../../interfaces/auth'
import { useFolderContext } from '../../providers/folder'
import { useCallback, useEffect, useState } from 'react'
import { FileProps, FolderProps } from '../../interfaces/folder'

const Header: React.FC<AuthUserProps> = ({ token, user }) => {
  const { rootFolder, setRootFolder } = useFolderContext()
  const [folder, setFolder] = useState<FolderProps | null>(null)
  const [filteredFolders, setFilteredFolders] = useState<FolderProps[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileProps[]>([])

  const searchRecursive = (folders: FolderProps[] | undefined, inputValue: string): void => {
    if (folders) {
      folders.forEach(folder => {
        if (folder.name.toLowerCase().includes(inputValue)) {
          setFilteredFolders(prevFolders => [...prevFolders, folder])
        }

        searchFiles(folder.files, inputValue)

        const nestedFolders = folder.folders
        searchRecursive(nestedFolders, inputValue)
      })
    }
  }

  const searchFiles = (files: FileProps[] | undefined, inputValue: string) => {
    if (files) {
      const matchingFiles = files.filter(file => file.name.toLowerCase().includes(inputValue))
      setFilteredFiles(prevFiles => [...prevFiles, ...matchingFiles])
    }
  }

  const handleSearch = useCallback(
    async (query: string) => {
      setFilteredFolders([])
      setFilteredFiles([])

      if (query.trim() === '') {
        setRootFolder(folder)
        return
      }

      try {
        if (rootFolder) {
          searchRecursive([rootFolder], query)
        }
      } catch (error) {
        console.error('Error occurred during search:', error)
      }
    },
    [folder, setRootFolder]
  )

  useEffect(() => {
    if (!folder) setFolder(rootFolder)
  }, [folder, rootFolder])

  useEffect(() => {
    if (filteredFolders.length > 0 || filteredFiles.length > 0) {
      setRootFolder({
        id: null,
        name: 'search results',
        files: filteredFiles ?? [],
        folders: filteredFolders ?? [],
      })
    }
  }, [filteredFolders, filteredFiles, setRootFolder])

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: 'lightgray',
        px: 1,
        py: 3.5,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          px: 2,
          py: 1,
        }}
      >
        {token && <UserProfile name={user?.name} email={user?.email} avatar={user?.avatar} />}
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {
          token &&
          <Grid container justifyContent="center" alignItems="center">
            <StyledSearchInput onSearch={handleSearch} />
          </Grid>
        }
      </Box>
    </Box>
  )
}

export default Header