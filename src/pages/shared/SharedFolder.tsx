import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFolderContext } from "../../providers/folder"
import { getShared } from "../../services/shared"
import FilesManager from "../../components/files-manager/FilesManager"
import NotFound from "../../components/not-found/NotFound"

const SharedFolder = () => {
  const { rootFolder, setRootFolder } = useFolderContext()
  const { id } = useParams<{ id: string }>()
  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  useEffect(() => {
    const fetchFolder = async () => {
      const { data } = await getShared(id, 'folders')
      setRootFolder(data)
      setIsDisabled(data?.link?.disabled)
    }

    fetchFolder()
  }, [])

  if (rootFolder && isDisabled) {
    return <NotFound />
  }
  return (
    <FilesManager shared />
  )
}

export default SharedFolder