import { cloneElement } from 'react'
import { Button, Box, Modal, Typography } from '@mui/material'

interface ModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  inputComponent: React.ReactNode
  buttonNames?: string[]
}

const StyledModal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  onSave,
  inputComponent,
  buttonNames = ['Save Changes', 'Close'],
}) => (
  <Modal open={isOpen} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        borderRadius: 5,
        boxShadow: 24,
      }}
    >
      <Typography
        variant="h5"
        sx={{ textAlign: 'center', borderBottom: '1px solid black' }}
      >
        {title}
      </Typography>
      <Box sx={{ p: 4 }}>
        {cloneElement(inputComponent as React.ReactElement)}
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          {buttonNames.map((buttonName, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={index === 0 ? onSave : onClose}
              sx={{ mr: 2 }}
            >
              {buttonName}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  </Modal>
)

export default StyledModal