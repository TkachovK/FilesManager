import { useCallback, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'

import { useDebounce } from '../../hooks/useDebounce'

interface SearchInputProps {
  onSearch: (query: string) => void
}

const StyledSearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedValue = useDebounce<string>(searchQuery, 1000)

  const debouncedCallback = useCallback(
    (value: string) => {
      onSearch(value)
    },
    [onSearch]
  )

  useEffect(() => {
    debouncedCallback(debouncedValue)
  }, [debouncedValue, debouncedCallback])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  return (
    <TextField
      label="Search"
      variant="outlined"
      fullWidth
      value={searchQuery}
      onChange={handleInputChange}
      size="small"
      sx={{ mt: 1 }}
      InputProps={{ sx: { borderRadius: 12 } }}
    />
  )
}

export default StyledSearchInput
