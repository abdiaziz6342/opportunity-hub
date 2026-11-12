import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, LogOut } from 'lucide-react'

function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  function getUser() {
    const savedUser = localStorage.getItem('currentUser')

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setUser(null)
    }
  }

  useEffect(function () {
    getUser()

    window.addEventListener('userChanged', getUser)

    return function () {
      window.removeEventListener('userChanged', getUser)
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('currentUser')
    setUser(null)
    window.dispatchEvent(new Event('userChanged'))
    navigate('/')
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-700">
          <BriefcaseBusiness />
          OpportunityHub
        </Link>

        <div className="flex flex-wrap items-center gap-5 text-gray-700">
          <Link to="/">Home</Link>
          <Link to="/opportunities">Opportunities</Link>
          <Link to="/about">About</Link>

          {user && (
            <Link to="/dashboard">My Dashboard</Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-semibold">{user.name}</span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/account"
              className="bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar