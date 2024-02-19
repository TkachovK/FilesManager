import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { InsertDriveFile as FileIcon } from '@mui/icons-material'
import { Box, Button, Menu, MenuItem, Modal, TextField, Typography } from '@mui/material'

import { AccessLinkProps, FileProps, PermissionsProps, SetFolderRootProps } from '../../../interfaces/folder'
import { useAuth } from '../../../providers/auth'
import { cloneFile, deleteFile, renameFile, uploadFiles } from '../../../services/files'
import { managePermissions } from '../../../services/shared'
import { SetStateFunction } from '../../../utils/types'
import FileInfo from '../../file-info/FileInfo'
import FileUploadForm from '../../styled/StyledFileInput'
import StyledItemsList from '../../styled/StyledItemsList'
import StyledModal from '../../styled/StyledModal'
import StyledPermissionsModal from '../../styled/StyledPermissionsModal'

interface FileActions {
  [key: string]: string[]
}

const fileActions: FileActions = {
  view: ['View'],
  edit: ['View', 'Clone', 'Remove', 'Rename'],
  creator: ['View', 'Clone', 'Remove', 'Rename', 'Edit'],
}

const accessLinkDefault: AccessLinkProps = {
  access: '',
  link: '',
  disabled: true,
  linkedType: '',
}

const FileComponent: React.FC<SetFolderRootProps> = ({ rootFolder, setRootFolder }) => {
  const { user } = useAuth()
  const folderId = useParams()

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<FileProps | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const [fileName, setFileName] = useState<string | undefined>('')
  const [uploadedFiles, setUploadedFiles] = useState<FormData | null>(null)
  const [emailActions, setEmailActions] = useState<PermissionsProps[]>([])
  const [accessLink, setAccessLink] = useState<AccessLinkProps>(accessLinkDefault)
  const [errors, setErrors] = useState<string[] | null>(null)
  const [currentAction, setCurrentAction] = useState<string | undefined>('')
  const [isPublic, setIsPublic] = useState<boolean>(false)

  const toggleModal = (setModalOpen: SetStateFunction<boolean>): void => {
    setModalOpen(prevState => !prevState)
  }

  const handleCloseModal = () => {
    setFileName('')
    setUploadedFiles(null)
    setIsModalOpen(false)
    setIsRenameModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(false)
    setIsFileModalOpen(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value)
  }

  const handleItemClick = (event: React.MouseEvent<HTMLElement>, item: FileProps) => {
    setMenuAnchor(event.currentTarget)
    if (item.isPublic) setCurrentAction('edit')
    if (rootFolder.action) setCurrentAction(rootFolder.action)
    setSelectedItem(item)
  }

  const handleCloseMenu = () => {
    setMenuAnchor(null)
    setSelectedItem(null)
  }

  const handleViewItem = () => {
    setMenuAnchor(null)
    toggleModal(setIsFileModalOpen)
  }

  const handleCloneItem = async () => {
    setMenuAnchor(null)
    const data = await cloneFile(selectedItem?.id, rootFolder.id)
    setRootFolder(prevObject => ({
      ...prevObject,
      files: [...(prevObject?.files ?? []), data],
    }))
  }

  const handleRenameItem = () => {
    setFileName(selectedItem?.name)
    toggleModal(setIsRenameModalOpen)
    setMenuAnchor(null)
  }

  const handleRemoveItem = async () => {
    setFileName(selectedItem?.name)
    toggleModal(setIsDeleteModalOpen)
    setMenuAnchor(null)
  }

  const removeItem = async () => {
    await deleteFile(selectedItem?.id)
    const updatedFiles = rootFolder?.files?.filter(folder => folder.id !== selectedItem?.id)
    setRootFolder(prevObject => ({
      ...prevObject,
      files: updatedFiles,
    }))
    toggleModal(setIsDeleteModalOpen)
    setMenuAnchor(null)
  }

  const handleCreateItem = async (uploadedFiles: FormData | null) => {
    setMenuAnchor(null)
    uploadedFiles?.append('isPublic', isPublic.toString())
    user?.email && uploadedFiles?.append('userEmail', user.email.toString())
    const { files } = await uploadFiles(uploadedFiles, rootFolder.id)
    setRootFolder(prevObject => ({
      ...prevObject,
      files,
    }))
  }

  const handleUpdateItem = async () => {
    setMenuAnchor(null)
    await renameFile(selectedItem?.id, fileName)
    setRootFolder(prevObject => ({
      ...prevObject,
      files: prevObject?.files?.map(file => (file.id === selectedItem?.id ? { ...file, name: fileName } : file)),
    }))
  }

  const handleEditItem = () => {
    setFileName(selectedItem?.name)
    setEmailActions([...(selectedItem?.permissions ?? [])])
    setAccessLink(selectedItem?.link ?? accessLinkDefault)
    toggleModal(setIsEditModalOpen)
    setMenuAnchor(null)
  }

  const handleSetPermissions = async () => {
    try {
      const response = await managePermissions('files', selectedItem?.id, emailActions)
      if (response.error) {
        setErrors(response.error)
      } else {
        const updatedFile = { ...selectedItem, permissions: [...emailActions] }
        const prevFiles = [...(rootFolder?.files?.filter(file => file.id !== selectedItem?.id) ?? [])]

        setRootFolder(prevObject => ({
          ...prevObject,
          files: [...prevFiles, updatedFile],
        }))
        handleCloseModal()
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setErrors(['An unexpected error occurred. Please try again.'])
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setIsPublic(checked)
  }

  const handleSaveModal = () => {
    handleCreateItem(uploadedFiles)
    handleCloseModal()
  }

  const handleSaveRenameModal = () => {
    handleUpdateItem()
    handleCloseModal()
  }

  useEffect(() => {
    if (folderId) {
      user ? setCurrentAction(rootFolder.link?.access) : setCurrentAction('view')
    }
  }, [folderId, user])

  const menuItems = [
    { label: 'View', onClick: handleViewItem },
    { label: 'Clone', onClick: handleCloneItem },
    { label: 'Remove', onClick: handleRemoveItem },
    { label: 'Rename', onClick: handleRenameItem },
    { label: 'Edit', onClick: handleEditItem },
  ]

  const getMenuItems = () => {
    const availableActions = currentAction ? fileActions[currentAction] : []
    return menuItems.filter(item => availableActions.includes(item.label))
  }

  return (
    <Box margin="4rem 8rem">
      <Box marginTop="5rem">
        <Typography variant="h4">Files</Typography>
        <StyledItemsList items={rootFolder.files} logo={<FileIcon />} handleItemClick={handleItemClick} />
        {((user && rootFolder.id && currentAction !== 'view') || rootFolder.id === null) && (
          <Box display="flex" justifyContent="center" sx={{ margin: '0 auto' }}>
            <Button variant="contained" onClick={() => toggleModal(setIsModalOpen)}>
              Upload File
            </Button>
          </Box>
        )}
      </Box>
      <Box>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
          {getMenuItems().map((item, index) => (
            <MenuItem key={index} onClick={item.onClick}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
        <StyledModal
          title="File Upload"
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveModal}
          inputComponent={
            <FileUploadForm setUploadedFiles={setUploadedFiles} checked={isPublic} onChange={handleSwitchChange} />
          }
        />
        <StyledModal
          title="Rename File"
          isOpen={isRenameModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveRenameModal}
          inputComponent={
            <TextField label="Enter text" variant="outlined" value={fileName} onChange={handleInputChange} />
          }
        />
        <StyledModal
          title={`Permissions for file ${fileName}`}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSave={handleSetPermissions}
          inputComponent={
            <StyledPermissionsModal
              emailActions={emailActions}
              setEmailActions={setEmailActions}
              accessLink={accessLink}
              setAccessLink={setAccessLink}
              errors={errors}
              setErrors={setErrors}
            />
          }
        />
        <Modal open={isFileModalOpen} onClose={handleCloseModal}>
          <>
            <FileInfo
              filePath={selectedItem?.filePath}
              name={selectedItem?.name}
              isPublic={selectedItem?.isPublic}
              showDashboardButton={false}
            />
          </>
        </Modal>
        <StyledModal
          title="Are you sure?"
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModal}
          onSave={removeItem}
          inputComponent={
            <Typography variant="h5" textAlign="center">
              Are you sure you want to delete {fileName}?
            </Typography>
          }
          buttonNames={['Yes', 'No']}
        />
      </Box>
    </Box>
  )
}

export default FileComponent
