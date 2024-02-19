import axios, { AxiosResponse } from 'axios'

import { FolderProps, PermissionsProps } from '../interfaces/folder'

const token = localStorage.getItem('token')

export const getAvailableFolders = async (userEmail?: string) => {
  try {
    const { data }: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_URL}/folders`, {
      params: {
        userEmail,
      },
    })
    return data
  } catch (error) {
    console.error('Error fetching available folders:', error)
  }
}

export const getFolder = async (id: number) => {
  try {
    const { data }: AxiosResponse = await axios.get<FolderProps>(`${process.env.REACT_APP_API_URL}/folders/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching folder:', error)
  }
}

export const createFolder = async (folderData: FolderProps, userEmail?: string) => {
  try {
    const { data }: AxiosResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/folders`,
      {
        ...folderData,
        userEmail,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    )
    return data
  } catch (error) {
    console.error('Error creating folder:', error)
  }
}

export const cloneFolder = async (
  folderId?: number | null,
  parentId?: number | null,
  permissions?: PermissionsProps[]
) => {
  try {
    const { data }: AxiosResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/folders/clone/${folderId}`,
      {
        parentId,
        permissions,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    )
    return data
  } catch (error) {
    console.error('Error creating folder:', error)
  }
}

export const renameFolder = async (folderId?: number | null, name?: string, userEmail?: string) => {
  try {
    const { data }: AxiosResponse = await axios.put(
      `${process.env.REACT_APP_API_URL}/folders/${folderId}`,
      {
        name,
        userEmail,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    )
    return data
  } catch (error) {
    console.error('Error creating folder:', error)
  }
}

export const deleteFolder = async (id?: number | null): Promise<void> => {
  try {
    axios.delete(`${process.env.REACT_APP_API_URL}/folders/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
  } catch (error) {
    console.error('Error fetching folder:', error)
  }
}
