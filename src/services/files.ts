import axios, { AxiosResponse } from 'axios'

const token = localStorage.getItem('token')

export const getAvailableFiles = async (userEmail?: string) => {
  try {
    const { data }: AxiosResponse = await axios.get(`${process.env.REACT_APP_API_URL}/files`, {
      params: {
        userEmail,
      },
    })
    return data
  } catch (error) {
    console.error('Error fetching available folders:', error)
  }
}

export const uploadFiles = async (formData: FormData | null, parentId?: number | null) => {
  try {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/folders/filesUpload/${parentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })

    return data
  } catch (error) {
    console.error('Error uploading files:', error)
  }
}

export const cloneFile = async (id?: number | null, parentId?: number | null) => {
  try {
    const { data }: AxiosResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/files/clone/${id}`,
      {
        parentId,
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

export const renameFile = async (id?: number | null, name?: string): Promise<void> => {
  try {
    axios.put(
      `${process.env.REACT_APP_API_URL}/files/${id}`,
      { name },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    )
  } catch (error) {
    console.error('Error renaming folder:', error)
  }
}

export const deleteFile = async (id?: number | null): Promise<void> => {
  try {
    axios.delete(`${process.env.REACT_APP_API_URL}/files/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
  } catch (error) {
    console.error('Error deleting folder:', error)
  }
}
