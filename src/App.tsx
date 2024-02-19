import AuthProvider from './providers/auth'
import FolderProvider from './providers/folder'
import Routes from './routes'

function App() {
  return (
    <AuthProvider>
      <FolderProvider>
        <Routes />
      </FolderProvider>
    </AuthProvider>
  )
}

export default App
