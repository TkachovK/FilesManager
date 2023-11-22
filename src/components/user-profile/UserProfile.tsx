import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, Box, Button, Tooltip, Typography } from "@mui/material"
import { User } from "../../interfaces/auth"
import { useAuth } from "../../providers/auth"

const UserProfile: React.FC<User> = ({ name, email, avatar }) => {
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)

  const handleLogout = () => {
    setToken('')
    navigate("/", { replace: true })
  }

  const handleAvatarClick = () => {
    setShowDetails(!showDetails)
  }

  return (
    <Tooltip
      open={showDetails}
      onClose={() => setShowDetails(false)}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={
        <Box sx={{ p: 2, maxWidth: 200, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="body2">{email}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleLogout}>
              Log Out
            </Button>
          </Box>
        </Box>
      }
      arrow
    >
      <Box onClick={handleAvatarClick}>
        <Avatar alt={name} src={avatar} />
      </Box>
    </Tooltip>
  )
}

export default UserProfile