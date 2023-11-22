import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Paper } from '@mui/material'
import { FileInfoProps } from '../../interfaces/folder'

const FileInfo: React.FC<FileInfoProps> = ({ name, filePath, isPublic, showDashboardButton }) => {
  const navigate = useNavigate()

  const redirectToHome = () => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        borderRadius: 5,
        boxShadow: 24
      }}
    >
      <Paper style={{ padding: '16px', textAlign: 'center' }}>
        <Typography variant="h5">{name}</Typography>
        <Typography>File Path: {filePath}</Typography>
        <Typography>Public: {isPublic ? 'Yes' : 'No'}</Typography>
        {showDashboardButton && (
          <Button variant="contained" color="primary" onClick={redirectToHome}>
            Go to Dashboard
          </Button>
        )}
      </Paper>
    </Box>
  )
}

export default FileInfo