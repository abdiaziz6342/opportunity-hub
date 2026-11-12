import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Mail } from 'lucide-react'

function Account() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

   
if (isLogin) {
  fetch('http://localhost:3000/users?email=' + encodeURIComponent(email.trim()))
    .then(function (response) {
      return response.json()
    })
    .then(function (users) {

      if (users.length === 0) {
        setMessage('Email not found. Please register first.')
        setLoading(false)
        return
      }

      const user = users[0]

      if (user.password !== password) {
        setMessage('Incorrect password.')
        setLoading(false)
        return
      }

      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
      }))

      window.dispatchEvent(new Event('userChanged'))

      navigate('/dashboard')
    })
    .catch(function () {
      setMessage('Unable to connect to the server.')
      setLoading(false)
    })
}

  }

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-center">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h1>

        <p className="text-gray-500 text-center mt-2">
          {isLogin ? 'Log in to access your opportunities.' : 'Register to apply and save opportunities.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {!isLogin && (
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <div className="flex items-center border rounded-lg px-3">
                <User size={18} className="text-gray-400" />
                <input
                  required
                  type="text"
                  value={name}
                  onChange={function (event) {
                    setName(event.target.value)
                  }}
                  className="w-full p-3 outline-none"
                  placeholder="Your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">Email Address</label>
            <div className="flex items-center border rounded-lg px-3">
              <Mail size={18} className="text-gray-400" />
              <input
                required
                type="email"
                value={email}
                onChange={function (event) {
                  setEmail(event.target.value)
                }}
                className="w-full p-3 outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock size={18} className="text-gray-400" />
              <input
                required
                minLength="6"
                type="password"
                value={password}
                onChange={function (event) {
                  setPassword(event.target.value)
                }}
                className="w-full p-3 outline-none"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          {message && (
            <p className="text-red-600 text-sm">{message}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}

          <button
            onClick={function () {
              setIsLogin(!isLogin)
              setMessage('')
            }}
            className="text-blue-700 font-semibold ml-2"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </section>
  )
}

export default Account