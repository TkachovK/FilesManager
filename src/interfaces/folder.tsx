import { Dispatch, SetStateAction } from "react"

export interface PermissionsProps {
  action: string
  email: string
  avatar?: string
}

export interface AccessLinkProps {
  access: string
  link: string
  disabled: boolean
  linkedType: string
}

export interface FileProps {
  id?: number | null
  name: string
  isPublic?: boolean
  action?: string
  filePath?: string
  permissions?: PermissionsProps[]
  link?: AccessLinkProps
}

export interface FolderProps {
  id?: number | null
  name: string
  parentId?: number | null
  action?: string
  files?: FileProps[]
  folders?: FolderProps[]
  permissions?: PermissionsProps[]
  link?: AccessLinkProps
}

export interface CreateFolderProps {
  name: string
  parentId?: number | null
  permissions?: PermissionsProps[]
}

export interface FolderRootProps {
  rootFolder: FolderProps
}

export interface FileInfoProps {
  filePath?: string
  isPublic?: boolean
  name?: string
  showDashboardButton: boolean
}

export interface SetFolderRootProps extends FolderRootProps {
  setRootFolder: Dispatch<SetStateAction<FolderProps | null>>
}

export interface FileUploadFormProps {
  checked: boolean
  onChange: (checked: boolean) => void
  setUploadedFiles: Dispatch<SetStateAction<FormData | null>>
}

export interface ErrorAlertProps {
  errors: string[] | null
  setErrors: React.Dispatch<React.SetStateAction<string[] | null>>
}

export interface PermissionsModalProps extends ErrorAlertProps {
  emailActions: PermissionsProps[]
  setEmailActions: React.Dispatch<React.SetStateAction<PermissionsProps[]>>
  accessLink: AccessLinkProps
  setAccessLink: React.Dispatch<React.SetStateAction<AccessLinkProps>>
}