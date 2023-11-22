import { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography, List, ListItem, ListItemText, IconButton, FormControlLabel, Switch } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { FileUploadFormProps } from '../../interfaces/folder'

const StyledFileInput: React.FC<FileUploadFormProps> = ({ setUploadedFiles, checked, onChange }) => {
  const [uploadedFiles, setUploadedUrls] = useState<File[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const files: File[] = []
    const formData = new FormData()

    acceptedFiles.map(async (file) => {
      try {
        formData.append('file', file)
        files.push(file)
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    })

    setUploadedUrls([...uploadedFiles, ...files])
    setUploadedFiles(formData)
  }, [setUploadedUrls, setUploadedFiles])

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...uploadedFiles]
    updatedFiles.splice(index, 1)
    setUploadedUrls(updatedFiles)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const dropzoneStyle: React.CSSProperties = useMemo(
    () => ({
      border: '2px dashed #cccccc',
      borderRadius: '4px',
      padding: '50px',
      textAlign: 'center',
      cursor: 'pointer',
      width: '100%',
    }),
    []
  )

  return (
    <>
      <Box>
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} />}
          label="Is Public"
        />
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <div {...getRootProps()} style={dropzoneStyle}>
          <input {...getInputProps()} />
          <Typography variant="h6">Drag & drop files here, or click to select files</Typography>
        </div>
      </Box>
      <Box>
        <List>
          {uploadedFiles.map((file, index) => (
            <ListItem key={file.name}>
              <ListItemText primary={file.name} />
              <IconButton onClick={() => handleRemoveFile(index)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  )
}

export default StyledFileInput
