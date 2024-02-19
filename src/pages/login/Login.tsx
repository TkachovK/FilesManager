import { Box, Button, Typography } from '@mui/material'

const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google` ?? ''
  }

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Files Manager
      </Typography>
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  )
}

export default Login
