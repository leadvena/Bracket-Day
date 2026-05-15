import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function TitleUpdater() {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname
    let title = 'BracketDay | Universal Tournament Manager'

    if (path === '/login') title = 'Sign In | BracketDay'
    if (path === '/dashboard') title = 'Admin Dashboard | BracketDay'
    if (path === '/create') title = 'Create Tournament | BracketDay'
    if (path.startsWith('/manage/')) title = 'Manage Bracket | BracketDay'
    if (path.startsWith('/bracket/')) title = 'Live Bracket | BracketDay'

    document.title = title
  }, [location])

  return null
}
