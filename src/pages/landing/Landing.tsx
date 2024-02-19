import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '../../providers/auth'

const Landing = () => {
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      setToken(token)
      navigate('/', { replace: true })
    }
  }, [navigate, token, setToken])

  return <></>
}

export default Landing
