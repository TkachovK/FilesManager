import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import FileInfo from '../../components/file-info/FileInfo'
import { FileInfoProps } from '../../interfaces/folder'
import { getShared } from '../../services/shared'

const accessLinkDefault: FileInfoProps = {
  filePath: '',
  isPublic: false,
  name: '',
  showDashboardButton: true,
}

const SharedFile = () => {
  const { id } = useParams<{ id: string }>()
  const [fileData, setFileData] = useState<FileInfoProps>(accessLinkDefault)

  useEffect(() => {
    const fetchFile = async () => {
      const { data } = await getShared(id, 'files')
      setFileData(data)
    }

    fetchFile()
  }, [])

  return <FileInfo {...fileData} showDashboardButton={true} />
}

export default SharedFile
