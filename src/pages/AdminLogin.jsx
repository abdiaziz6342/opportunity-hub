
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    fetch('http://localhost:3000/admins?email=' + encodeURIComponent(email.trim()))
      .then(function (response) {
        return response.json()
      })
      .then(function (admins) {
        if (admins.length === 0 || admins[0].password !== password) {
          setMessage('Incorrect email or password')
          setLoading(false)
          return
        }

        const admin = {
          id: admins[0].id,
          name: admins[0].name,
          email: admins[0].email
        }

        localStorage.setItem('currentAdmin', JSON.stringify(admin))

        window.dispatchEvent(new Event('adminChanged'))

        navigate('/admin')
      })
      .catch(function () {
        setMessage('Something went wrong. Please try again.')
        setLoading(false)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Admin Login
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Sign in to manage opportunities
        </p>

        <label className="block mb-2 font-medium">Email</label>
        <div className="flex items-center border rounded-lg px-3 mb-4">
          <Mail size={18} className="text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={function (event) {
              setEmail(event.target.value)
            }}
            placeholder="Enter admin email"
            className="w-full p-3 outline-none"
            required
          />
        </div>

        <label className="block mb-2 font-medium">Password</label>
        <div className="flex items-center border rounded-lg px-3 mb-4">
          <Lock size={18} className="text-gray-500" />
          <input
            type="password"
            value={password}
            onChange={function (event) {
              setPassword(event.target.value)
            }}
            placeholder="Enter password"
            className="w-full p-3 outline-none"
            required
          />
        </div>

        {message && (
          <p className="text-red-600 text-sm mb-4">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
