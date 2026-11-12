import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Skeleton from '../components/Skeleton'
import { FileText, Bookmark, Trash2 } from 'lucide-react'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('currentUser'))

  const [applications, setApplications] = useState([])
  const [savedItems, setSavedItems] = useState([])
  const [loading, setLoading] = useState(true)

  function loadDashboard() {
    if (!user) {
      setLoading(true)
      return
    }

    Promise.all([
      fetch('http://localhost:3000/applications?userId=' + user.id)
        .then(function (response) {
          return response.json()
        }),

      fetch('http://localhost:3000/savedOpportunities?userId=' + user.id)
        .then(function (response) {
          return response.json()
        })
    ])
      .then(function (data) {
        setApplications(data[0])
        setSavedItems(data[1])
        setLoading(false)
      })
      .catch(function () {
        setLoading(false)
      })
  }

  useEffect(function () {
    loadDashboard()
  }, [])

  function handleRemoveSaved(id) {
    fetch('http://localhost:3000/savedOpportunities/' + id, {
      method: 'DELETE'
    })
      .then(function () {
        setSavedItems(savedItems.filter(function (item) {
          return item.id !== id
        }))
      })
  }

  if (!user) {
    return (
      <section className="max-w-xl mx-auto text-center py-24 px-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>

        <p className="text-gray-500 mt-4">
          Please log in or create an account to access your dashboard.
        </p>

        <Link
          to="/account"
          className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg mt-6"
        >
          Login / Register
        </Link>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>

      <p className="text-gray-500 mt-2">
        Manage your applications and saved opportunities.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white border rounded-xl p-6">
          <FileText className="text-blue-700" size={30} />
          <p className="text-gray-500 mt-3">My Applications</p>
          <h2 className="text-3xl font-bold">{applications.length}</h2>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <Bookmark className="text-blue-700" size={30} />
          <p className="text-gray-500 mt-3">Saved Opportunities</p>
          <h2 className="text-3xl font-bold">{savedItems.length}</h2>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">My Applications</h2>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            <Skeleton />
            <Skeleton />
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map(function (application) {
              return (
                <div
                  key={application.id}
                  className="bg-white border rounded-xl p-5 flex flex-wrap justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg">{application.title}</h3>
                    <p className="text-gray-500">{application.organization}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Applied: {application.date}
                    </p>
                  </div>

                  <span className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg h-fit">
                    {application.status}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500">You have not applied for any opportunities.</p>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Saved Opportunities</h2>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            <Skeleton />
            <Skeleton />
          </div>
        ) : savedItems.length > 0 ? (
          <div className="space-y-4">
            {savedItems.map(function (item) {
              return (
                <div
                  key={item.id}
                  className="bg-white border rounded-xl p-5 flex justify-between items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-gray-500">{item.organization}</p>

                    <Link
                      to={'/opportunities/' + item.opportunityId}
                      className="text-blue-700 text-sm mt-2 inline-block"
                    >
                      View Opportunity
                    </Link>
                  </div>

                  <button
                    onClick={function () {
                      handleRemoveSaved(item.id)
                    }}
                    className="text-red-600 p-2"
                    title="Remove saved opportunity"
                  >
                    <Trash2 />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500">You have not saved any opportunities.</p>
        )}
      </div>
    </section>
  )
}

export default Dashboard