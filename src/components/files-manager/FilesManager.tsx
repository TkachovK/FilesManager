import { useEffect } from 'react'

import { useAuth } from '../../providers/auth'
import { useFolderContext } from '../../providers/folder'
import { getAvailableFolders } from '../../services/folders'

import File from './file/File'
import Folder from './folder/Folder'

const FilesManager: React.FC<{ shared?: boolean }> = ({ shared }) => {
  const { user } = useAuth()
  const { rootFolder, setRootFolder } = useFolderContext()

  useEffect(() => {
    const fetchFolders = async () => {
      if (user && !shared) {
        const fetchedData = await getAvailableFolders(user?.email)
        setRootFolder({
          id: null,
          name: 'root',
          files: [],
          folders: fetchedData ?? [],
        })
      }
    }

    fetchFolders()
  }, [user])

  return (
    <>
      {rootFolder && <Folder setRootFolder={setRootFolder} rootFolder={rootFolder} />}
      {rootFolder && <File setRootFolder={setRootFolder} rootFolder={rootFolder} />}
    </>
  )
}

export default FilesManager
