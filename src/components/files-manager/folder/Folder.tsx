import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Folder as FolderIcon } from '@mui/icons-material'
import { Box, Button, Menu, MenuItem, TextField, Typography } from '@mui/material'

import {
  AccessLinkProps,
  CreateFolderProps,
  FolderProps,
  PermissionsProps,
  SetFolderRootProps,
} from '../../../interfaces/folder'
import { useAuth } from '../../../providers/auth'
import {
  cloneFolder,
  createFolder,
  deleteFolder,
  getAvailableFolders,
  getFolder,
  renameFolder,
} from '../../../services/folders'
import { managePermissions } from '../../../services/shared'
import { SetStateFunction } from '../../../utils/types'
import StyledItemsList from '../../styled/StyledItemsList'
import StyledModal from '../../styled/StyledModal'
import StyledPermissionsModal from '../../styled/StyledPermissionsModal'

interface FolderActions {
  [key: string]: string[]
}

const folderActions: FolderActions = {
  view: ['Open'],
  edit: ['Open', 'Clone', 'Remove', 'Rename'],
  creator: ['Open', 'Clone', 'Remove', 'Rename', 'Edit'],
}

const accessLinkDefault: AccessLinkProps = {
  access: '',
  link: '',
  disabled: true,
  linkedType: '',
}

const FolderComponent: React.FC<SetFolderRootProps> = ({ rootFolder, setRootFolder }) => {
  const { user } = useAuth()
  const folderId = useParams()

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<FolderProps | null>(null)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const [folderName, setFolderName] = useState<string | undefined>('')
  const [inputName, setInputName] = useState<string | undefined>('')
  const [folderBreadcrumbs, setFolderBreadcrumbs] = useState<FolderProps[]>([])
  const [emailActions, setEmailActions] = useState<PermissionsProps[]>([])
  const [accessLink, setAccessLink] = useState<AccessLinkProps>(accessLinkDefault)
  const [errors, setErrors] = useState<string[] | null>(null)
  const [currentAction, setCurrentAction] = useState<string | undefined>('')

  const toggleModal = (setModalOpen: SetStateFunction<boolean>): void => {
    setModalOpen(prevState => !prevState)
  }

  const handleCloseModal = () => {
    setFolderName('')
    setInputName('')
    setEmailActions([])
    setIsRenameModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value)
  }

  const handleItemClick = (event: React.MouseEvent<HTMLElement>, item: FolderProps) => {
    setMenuAnchor(event.currentTarget)
    if (item.action) setCurrentAction(item.action)
    setSelectedItem(item)
  }

  const handleCloseMenu = () => {
    setMenuAnchor(null)
    setSelectedItem(null)
  }

  const handleOpenItem = () => {
    setMenuAnchor(null)
    setRootFolder(selectedItem)
    if (selectedItem) setFolderBreadcrumbs(prevFolders => [...prevFolders, selectedItem])
  }

  const handleCloneItem = async () => {
    setMenuAnchor(null)
    const data = await cloneFolder(selectedItem?.id, rootFolder.id, selectedItem?.permissions)
    setRootFolder(prevObject => ({
      ...prevObject,
      folders: [...(prevObject?.folders ?? []), { ...data, action: 'creator' }],
    }))
  }

  const handleRenameItem = () => {
    setFolderName(selectedItem?.name)
    setInputName(selectedItem?.name)
    toggleModal(setIsRenameModalOpen)
    setMenuAnchor(null)
  }

  const handleEditItem = () => {
    setFolderName(selectedItem?.name)
    setEmailActions([...(selectedItem?.permissions ?? [])])
    setAccessLink(selectedItem?.link ?? accessLinkDefault)
    toggleModal(setIsEditModalOpen)
    setMenuAnchor(null)
  }

  const handleRemoveItem = async () => {
    setFolderName(selectedItem?.name)
    toggleModal(setIsDeleteModalOpen)
    setMenuAnchor(null)
  }

  const handleBreadcrumbClick = async (item: FolderProps, clickedIndex: number) => {
    if (item.id) {
      const fetchedData = await getFolder(item.id)
      setRootFolder(fetchedData)
    } else {
      const fetchedData = await getAvailableFolders(user?.email)
      setRootFolder({
        id: null,
        name: 'root',
        files: [],
        folders: fetchedData ?? [],
      })
    }
    const updatedBreadcrumbs = folderBreadcrumbs.slice(0, clickedIndex + 1)
    setFolderBreadcrumbs(updatedBreadcrumbs)
  }

  const removeItem = async () => {
    deleteFolder(selectedItem?.id)
    const updatedFolders = rootFolder?.folders?.filter(folder => folder.id !== selectedItem?.id)
    setRootFolder(prevObject => ({
      ...prevObject,
      folders: updatedFolders,
    }))
    toggleModal(setIsDeleteModalOpen)
    setMenuAnchor(null)
  }

  const createEditItem = async ({ name }: CreateFolderProps) => {
    setMenuAnchor(null)
    if (folderName) {
      renameFolder(selectedItem?.id, name, user?.email)
      setRootFolder(prevObject => ({
        ...prevObject,
        folders: prevObject?.folders?.map(folder => (folder.id === selectedItem?.id ? { ...folder, name } : folder)),
      }))
    } else {
      const data = await createFolder(
        {
          name,
          parentId: rootFolder.id,
        },
        user?.email
      )
      setRootFolder(prevObject => ({
        ...prevObject,
        folders: [
          ...(prevObject?.folders ?? []),
          { id: data.id, name, parentId: rootFolder.id, action: 'creator', folders: [] },
        ],
      }))
    }
  }

  const setPermissions = async () => {
    try {
      const response = await managePermissions('folders', selectedItem?.id, emailActions, accessLink)
      if (response.error) {
        setErrors(response.error)
      } else {
        const updatedFolder = { ...selectedItem, permissions: [...emailActions], link: accessLink }
        const prevFolders = [...(rootFolder?.folders?.filter(folder => folder.id !== selectedItem?.id) ?? [])]

        setRootFolder(prevObject => ({
          ...prevObject,
          folders: [...prevFolders, updatedFolder],
        }))
        handleCloseModal()
      }
    } catch (error) {
      console.log('Unexpected error:', error)
      setErrors(['An unexpected error occurred. Please try again.'])
    }
  }

  const handleSaveModal = () => {
    createEditItem({ name: inputName as string })
    handleCloseModal()
  }

  useEffect(() => {
    setFolderBreadcrumbs([rootFolder])
  }, [])

  useEffect(() => {
    if (folderId) {
      user ? setCurrentAction(rootFolder.link?.access) : setCurrentAction('view')
    }
  }, [folderId, user])

  const menuItems = [
    { label: 'Open', onClick: handleOpenItem },
    { label: 'Clone', onClick: handleCloneItem },
    { label: 'Remove', onClick: handleRemoveItem },
    { label: 'Rename', onClick: handleRenameItem },
    { label: 'Edit', onClick: handleEditItem },
  ]

  const getMenuItems = () => {
    const availableActions = currentAction ? folderActions[currentAction] : []
    return menuItems.filter(item => availableActions.includes(item.label))
  }

  return (
    <Box margin="4rem 8rem">
      <Typography variant="h6">
        {folderBreadcrumbs.map((item, index) => (
          <Fragment key={index}>
            <span onClick={() => handleBreadcrumbClick(item, index)}>{item.name}</span>
            {index < folderBreadcrumbs.length - 1 && <span> &gt; </span>}
          </Fragment>
        ))}
      </Typography>
      <Box marginTop="5rem">
        <Typography variant="h4">Folders</Typography>
        <StyledItemsList items={rootFolder.folders} logo={<FolderIcon />} handleItemClick={handleItemClick} />
        {((user && rootFolder.id && currentAction !== 'view') || rootFolder.id === null) && (
          <Box display="flex" justifyContent="center" sx={{ margin: '0 auto' }}>
            <Button variant="contained" onClick={() => toggleModal(setIsRenameModalOpen)}>
              Add folder
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
          title={`${folderName ? 'Edit' : 'Create'} folder`}
          isOpen={isRenameModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveModal}
          inputComponent={
            <TextField label="Enter text" variant="outlined" value={inputName} onChange={handleInputChange} />
          }
        />
        <StyledModal
          title={`Permissions for folder ${folderName}`}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSave={setPermissions}
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
        <StyledModal
          title="Are you sure?"
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModal}
          onSave={removeItem}
          inputComponent={
            <Typography variant="h5" textAlign="center">
              Are you sure you want to delete folder with all files({folderName})?
            </Typography>
          }
          buttonNames={['Yes', 'No']}
        />
      </Box>
    </Box>
  )
}

export default FolderComponent
