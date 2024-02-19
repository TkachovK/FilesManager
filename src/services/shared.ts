import axios, { AxiosResponse } from 'axios'

import { AccessLinkProps, PermissionsProps } from '../interfaces/folder'

export const managePermissions = async (
  type: 'folders' | 'files',
  id?: number | null,
  emailActions?: PermissionsProps[],
  accessLink?: AccessLinkProps
) => {
  try {
    const { data }: AxiosResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/${type}/managePermissions/${id}`,
      { emailActions, accessLink }
    )
    return { data }
  } catch (error: any) {
    return { error: error?.response?.data?.errors || ['An unexpected error occurred. Please try again.'] }
  }
}

export const getShared = async (id?: string, type?: 'folders' | 'files') => {
  try {
    const { data }: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_URL}/${type}/shared/${id}`)
    return { data }
  } catch (error: any) {
    return { error: error?.response?.data?.errors || ['An unexpected error occurred. Please try again.'] }
  }
}
