import { Link } from 'react-router-dom'
import { Box, Button, Container, Typography } from '@mui/material'

const NotFound: React.FC = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
    <Container maxWidth="md">
      <Typography variant="h1">404</Typography>
      <Typography variant="h4">Page Not Found</Typography>
      <Typography variant="body1">Sorry, the page you are looking for might be in another castle.</Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Go Home
      </Button>
    </Container>
  </Box>
)

export default NotFound
