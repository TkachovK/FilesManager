import { useState } from 'react'
import {
  Alert as MuiAlert,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { PermissionsProps, PermissionsModalProps } from '../../interfaces/folder'

const Alert = (props: any) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const StyledPermissionsModal: React.FC<PermissionsModalProps> = ({
  emailActions,
  setEmailActions,
  accessLink,
  setAccessLink,
  errors,
  setErrors,
}) => {
  const [inputText, setInputText] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const handleAddEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isUniqueEmail = emailActions.filter((obj) => obj.email === inputText.trim())
    const isValidEmail = emailRegex.test(inputText.trim()) && isUniqueEmail.length === 0
    setIsValidEmail(isValidEmail)

    if (inputText.trim() !== '' && isValidEmail) {
      const newEmailAction: PermissionsProps = {
        email: inputText.trim(),
        action: 'view',
      }
      setEmailActions([...emailActions, newEmailAction])
      setInputText('')
    }
  }

  const handleActionChange = (index: number, e: SelectChangeEvent<string>) => {
    const updatedEmailActions = [...emailActions]
    updatedEmailActions[index] = {
      ...updatedEmailActions[index],
      action: e.target.value,
    }
    setEmailActions(updatedEmailActions)
  }

  const handleRemoveFile = (index: number) => {
    const updatedEmailActions = [...emailActions]
    updatedEmailActions.splice(index, 1)
    setEmailActions(updatedEmailActions)
  }

  const handleToggleAccessLink = (e: SelectChangeEvent<string>) => {
    setAccessLink(prev => ({
      ...prev,
      disabled: e.target.value === 'disabled' ?? false,
    }))
  }

  const handleAccessLinkChange = (e: SelectChangeEvent<string>) => {
    setAccessLink(prev => ({
      ...prev,
      access: e.target.value,
    }))
  }

  const handleCopyLink = () => {
    copyToClipboard(`${process.env.REACT_APP_CLIENT_URL}/shared/${accessLink.linkedType}/${accessLink.link}`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <Typography variant="h6" fontWeight={800} sx={{ mr: '10px', mb: '10px' }}>Users with access</Typography>
      <Box mb={1} display="flex" alignItems="baseline">
        <TextField
          label="Enter Email"
          variant="outlined"
          fullWidth
          value={inputText}
          error={!isValidEmail}
          helperText={!isValidEmail ? 'Invalid email address' : ' '}
          InputProps={{
            inputMode: 'email',
            startAdornment: <InputAdornment position="start">@</InputAdornment>,
          }}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEmail}
          sx={{ width: '80px', marginLeft: '10px' }}
        >
          Add
        </Button>
      </Box>
      <Box>
        {emailActions.map((emailAction, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Typography variant="body1" sx={{ mr: '16px' }}>
              {emailAction.email}
            </Typography>
            {emailAction.action === 'creator' ? (
              <Typography variant="body1" sx={{ mr: '64px' }}>
                Creator
              </Typography>
            ) : (
              <Box>
                <Select
                  value={emailAction.action}
                  onChange={(e) => handleActionChange(index, e)}
                  variant="outlined"
                  sx={{ width: '100px' }}
                >
                  <MenuItem value="view">Viewer</MenuItem>
                  <MenuItem value="edit">Editor</MenuItem>
                </Select>
                <IconButton onClick={() => handleRemoveFile(index)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Typography variant="h6" fontWeight={800} sx={{ marginRight: '10px' }}>General access</Typography>
      <Box mt={1} display="flex" alignItems="baseline">
        <Select
          value={accessLink.disabled ? 'disabled' : 'enabled'}
          onChange={(e) => handleToggleAccessLink(e)}
          variant="outlined"
          sx={{ width: '250px' }}
        >
          <MenuItem value="disabled">Restricted</MenuItem>
          <MenuItem value="enabled">Anyone with the link</MenuItem>
        </Select>
        {!accessLink.disabled && (
          <Box mt={2} display="flex" alignItems="baseline">
            <Select
              value={accessLink.access}
              onChange={(e) => handleAccessLinkChange(e)}
              variant="outlined"
              sx={{ width: '150px', ml: '10px' }}
            >
              <MenuItem value="view">View</MenuItem>
              <MenuItem value="edit">Edit</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCopyLink}
              sx={{ width: '120px', ml: '10px' }}
            >
              Copy link
            </Button>
          </Box>
        )}
      </Box>
      <Box>
        {errors && (
          <Alert onClose={() => setErrors(null)} severity="error">
            {errors.map((error, i) => (
              <Typography key={i}>{error}</Typography>
            ))}
          </Alert>
        )}
      </Box>
    </>
  )
}

export default StyledPermissionsModal
