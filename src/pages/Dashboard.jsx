
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Skeleton from '../components/Skeleton'
import {
  FileText,
  Bookmark,
  Trash2,
  Pencil,
  Save,
  X
} from 'lucide-react'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('currentUser'))

  const [applications, setApplications] = useState([])
  const [savedItems, setSavedItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [editId, setEditId] = useState(null)
  const [phone, setPhone] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [cvLink, setCvLink] = useState('')

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [deleteApplicationId, setDeleteApplicationId] = useState(null)

  function loadDashboard() {
    if (!user) {
      setLoading(false)
      return
    }

    Promise.all([
      fetch('http://localhost:3000/applications?userId=' + user.id)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Unable to load applications')
          }
          return response.json()
        }),

      fetch('http://localhost:3000/savedOpportunities?userId=' + user.id)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Unable to load saved opportunities')
          }
          return response.json()
        })
    ])
      .then(function (data) {
        setApplications(data[0])
        setSavedItems(data[1])
        setLoading(false)
      })
      .catch(function () {
        setMessage('Unable to load your dashboard.')
        setLoading(false)
      })
  }

  useEffect(function () {
    loadDashboard()
  }, [])

  // Open the application editing form
  function handleEditApplication(application) {
    setEditId(application.id)
    setPhone(application.phone || '')
    setCoverLetter(application.coverLetter || '')
    setCvLink(application.cvLink || '')
    setMessage('')
  }

  // Save updated application details
  function handleUpdateApplication(event) {
    event.preventDefault()

    setSaving(true)
    setMessage('')

    fetch('http://localhost:3000/applications/' + editId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: phone,
        coverLetter: coverLetter,
        cvLink: cvLink
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Update failed')
        }

        return response.json()
      })
      .then(function (updatedApplication) {
        setApplications(applications.map(function (application) {
          if (application.id === updatedApplication.id) {
            return updatedApplication
          }

          return application
        }))

        setEditId(null)
        setPhone('')
        setCoverLetter('')
        setCvLink('')
        setMessage('Application updated successfully.')
        setSaving(false)
      })
      .catch(function () {
        setMessage('Unable to update application. Try again.')
        setSaving(false)
      })
  }

  // Cancel editing
  function handleCancelEdit() {
    setEditId(null)
    setPhone('')
    setCoverLetter('')
    setCvLink('')
  }

  // Delete application
  function handleDeleteApplication() {
    fetch('http://localhost:3000/applications/' + deleteApplicationId, {
      method: 'DELETE'
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Delete failed')
        }

        setApplications(applications.filter(function (application) {
          return application.id !== deleteApplicationId
        }))

        if (editId === deleteApplicationId) {
          handleCancelEdit()
        }

        setDeleteApplicationId(null)
        setMessage('Application deleted successfully.')
      })
      .catch(function () {
        setMessage('Unable to delete application.')
      })
  }

  // Remove saved opportunity
  function handleRemoveSaved(id) {
    fetch('http://localhost:3000/savedOpportunities/' + id, {
      method: 'DELETE'
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Delete failed')
        }

        setSavedItems(savedItems.filter(function (item) {
          return item.id !== id
        }))

        setMessage('Saved opportunity removed successfully.')
      })
      .catch(function () {
        setMessage('Unable to remove saved opportunity.')
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

      <h1 className="text-3xl font-bold">
        Welcome, {user.name}
      </h1>

      <p className="text-gray-500 mt-2">
        Manage your applications and saved opportunities.
      </p>

      {message && (
        <p className="bg-blue-50 text-blue-700 p-4 rounded-lg mt-6">
          {message}
        </p>
      )}

      {/* Dashboard statistics */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">

        <div className="bg-white border rounded-xl p-6">
          <FileText className="text-blue-700" size={30} />
          <p className="text-gray-500 mt-3">My Applications</p>
          <h2 className="text-3xl font-bold">
            {applications.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <Bookmark className="text-blue-700" size={30} />
          <p className="text-gray-500 mt-3">Saved Opportunities</p>
          <h2 className="text-3xl font-bold">
            {savedItems.length}
          </h2>
        </div>

      </div>

      {/* My Applications */}
      <div className="mt-12">

        <h2 className="text-2xl font-bold mb-6">
          My Applications
        </h2>

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
                  className="bg-white border rounded-xl p-5"
                >

                  <div className="flex flex-wrap justify-between gap-4">

                    <div>
                      <h3 className="font-bold text-lg">
                        {application.title}
                      </h3>

                      <p className="text-gray-500">
                        {application.organization}
                      </p>

                      <p className="text-sm text-gray-400 mt-2">
                        Applied: {application.date}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        Phone: {application.phone || 'Not provided'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-start gap-3">

                      <span className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg">
                        {application.status}
                      </span>

                      <button
                        onClick={function () {
                          handleEditApplication(application)
                        }}
                        className="flex items-center gap-2 text-blue-700 border border-blue-700 px-4 py-2 rounded-lg"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={function () {
                          setDeleteApplicationId(application.id)
                        }}
                        className="flex items-center gap-2 text-red-600 border border-red-600 px-4 py-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>
                  </div>

                  {/* Edit application form */}
                  {editId === application.id && (

                    <form
                      onSubmit={handleUpdateApplication}
                      className="border-t mt-6 pt-6 space-y-4"
                    >

                      <h3 className="font-bold text-lg">
                        Update Your Application
                      </h3>

                      <div>
                        <label className="block font-medium mb-2">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          value={phone}
                          onChange={function (event) {
                            setPhone(event.target.value)
                          }}
                          required
                          className="w-full border rounded-lg p-3"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2">
                          Cover Letter
                        </label>

                        <textarea
                          value={coverLetter}
                          onChange={function (event) {
                            setCoverLetter(event.target.value)
                          }}
                          required
                          rows="5"
                          className="w-full border rounded-lg p-3"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-2">
                          CV Link
                        </label>

                        <input
                          type="url"
                          value={cvLink}
                          onChange={function (event) {
                            setCvLink(event.target.value)
                          }}
                          className="w-full border rounded-lg p-3"
                          placeholder="Paste your CV link"
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">

                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center gap-2 bg-blue-700 text-white px-5 py-3 rounded-lg disabled:opacity-50"
                        >
                          <Save size={17} />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 border px-5 py-3 rounded-lg"
                        >
                          <X size={17} />
                          Cancel
                        </button>

                      </div>

                    </form>
                  )}

                </div>
              )
            })}

          </div>

        ) : (
          <p className="text-gray-500">
            You have not applied for any opportunities.
          </p>
        )}

      </div>

      {/* Saved Opportunities */}
      <div className="mt-12">

        <h2 className="text-2xl font-bold mb-6">
          Saved Opportunities
        </h2>

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
                    <h3 className="font-bold">
                      {item.title}
                    </h3>

                    <p className="text-gray-500">
                      {item.organization}
                    </p>

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
          <p className="text-gray-500">
            You have not saved any opportunities.
          </p>
        )}

      </div>

      {/* Delete application confirmation modal */}
      {deleteApplicationId !== null && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl p-6 max-w-md w-full">

            <h2 className="text-xl font-bold">
              Delete Application?
            </h2>

            <p className="text-gray-500 mt-3">
              Are you sure you want to delete this application?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                onClick={handleDeleteApplication}
                className="bg-red-600 text-white px-5 py-2 rounded-lg"
              >
                Yes, Delete
              </button>

              <button
                onClick={function () {
                  setDeleteApplicationId(null)
                }}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  )
}

export default Dashboard
