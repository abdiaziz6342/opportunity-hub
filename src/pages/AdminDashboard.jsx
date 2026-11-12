import { useEffect, useState } from 'react'
import Skeleton from '../components/Skeleton'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

function AdminDashboard() {
  const [opportunities, setOpportunities] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [organization, setOrganization] = useState('')
  const [location, setLocation] = useState('Garissa')
  const [type, setType] = useState('Job')
  const [category, setCategory] = useState('')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')

  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  function loadData() {
    Promise.all([
      fetch('http://localhost:3000/opportunities').then(function (response) {
        return response.json()
      }),

      fetch('http://localhost:3000/applications').then(function (response) {
        return response.json()
      })
    ])
      .then(function (data) {
        setOpportunities(data[0])
        setApplications(data[1])
        setLoading(false)
      })
      .catch(function () {
        setLoading(false)
      })
  }

  useEffect(function () {
    loadData()
  }, [])

  function clearForm() {
    setTitle('')
    setOrganization('')
    setLocation('Garissa')
    setType('Job')
    setCategory('')
    setDeadline('')
    setDescription('')
    setImage('')
    setEditId(null)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const opportunity = {
      title: title,
      organization: organization,
      location: location,
      type: type,
      category: category,
      deadline: deadline,
      description: description,
      image: image
    }

    let url = 'http://localhost:3000/opportunities'
    let method = 'POST'

    if (editId) {
      url = 'http://localhost:3000/opportunities/' + editId
      method = 'PUT'
    }

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(opportunity)
    })
      .then(function (response) {
        return response.json()
      })
      .then(function () {
        clearForm()
        loadData()
      })
  }

  function handleEdit(opportunity) {
    setEditId(opportunity.id)
    setTitle(opportunity.title)
    setOrganization(opportunity.organization)
    setLocation(opportunity.location)
    setType(opportunity.type)
    setCategory(opportunity.category)
    setDeadline(opportunity.deadline)
    setDescription(opportunity.description)
    setImage(opportunity.image)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  function handleDelete() {
    fetch('http://localhost:3000/opportunities/' + deleteId, {
      method: 'DELETE'
    })
      .then(function () {
        setOpportunities(opportunities.filter(function (item) {
          return item.id !== deleteId
        }))

        setDeleteId(null)
      })
  }

  function handleStatusChange(id, status) {
    fetch('http://localhost:3000/applications/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: status
      })
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (updatedApplication) {
        setApplications(applications.map(function (application) {
          if (application.id === id) {
            return updatedApplication
          }

          return application
        }))
      })
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <p className="text-gray-500 mt-2">
        Manage opportunity listings and applications.
      </p>

      <div className="grid sm:grid-cols-2 gap-5 mt-8">
        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500">Total Opportunities</p>
          <h2 className="text-3xl font-bold mt-2">{opportunities.length}</h2>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500">Total Applications</p>
          <h2 className="text-3xl font-bold mt-2">{applications.length}</h2>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 mt-10">
        <h2 className="text-2xl font-bold mb-6">
          {editId ? 'Edit Opportunity' : 'Add New Opportunity'}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input
              required
              value={title}
              onChange={function (event) {
                setTitle(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
              placeholder="Opportunity title"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Organization</label>
            <input
              required
              value={organization}
              onChange={function (event) {
                setOrganization(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
              placeholder="Organization name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Location</label>
            <select
              value={location}
              onChange={function (event) {
                setLocation(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
            >
              <option>Garissa</option>
              <option>Wajir</option>
              <option>Mandera</option>
              <option>Isiolo</option>
              <option>Marsabit</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Type</label>
            <select
              value={type}
              onChange={function (event) {
                setType(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
            >
              <option>Job</option>
              <option>Internship</option>
              <option>Scholarship</option>
              <option>Training</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <input
              required
              value={category}
              onChange={function (event) {
                setCategory(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
              placeholder="e.g. Human Resources"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Deadline</label>
            <input
              required
              type="date"
              value={deadline}
              onChange={function (event) {
                setDeadline(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Image URL</label>
            <input
              required
              type="url"
              value={image}
              onChange={function (event) {
                setImage(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              required
              rows="4"
              value={description}
              onChange={function (event) {
                setDescription(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
              placeholder="Describe the opportunity..."
            ></textarea>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg">
              {editId ? <Save size={18} /> : <Plus size={18} />}
              {editId ? 'Update Opportunity' : 'Add Opportunity'}
            </button>

            {editId && (
              <button
                type="button"
                onClick={clearForm}
                className="border px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Manage Opportunities</h2>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            <Skeleton />
            <Skeleton />
          </div>
        ) : opportunities.length > 0 ? (
          <div className="space-y-4">
            {opportunities.map(function (opportunity) {
              return (
                <div
                  key={opportunity.id}
                  className="bg-white border rounded-xl p-5 flex flex-wrap justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg">{opportunity.title}</h3>
                    <p className="text-gray-500">{opportunity.organization}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {opportunity.location} | {opportunity.type}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={function () {
                        handleEdit(opportunity)
                      }}
                      className="text-blue-700 p-2"
                      title="Edit opportunity"
                    >
                      <Pencil />
                    </button>

                    <button
                      onClick={function () {
                        setDeleteId(opportunity.id)
                      }}
                      className="text-red-600 p-2"
                      title="Delete opportunity"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p>No opportunities have been added.</p>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Manage Applications</h2>

        {loading ? (
          <Skeleton />
        ) : applications.length > 0 ? (
          <div className="bg-white border rounded-xl overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Opportunity</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {applications.map(function (application) {
                  return (
                    <tr key={application.id} className="border-t">
                      <td className="p-4">{application.userId}</td>
                      <td className="p-4">{application.title}</td>
                      <td className="p-4">
                        <select
                          value={application.status}
                          onChange={function (event) {
                            handleStatusChange(application.id, event.target.value)
                          }}
                          className="border rounded-lg p-2"
                        >
                          <option>Pending</option>
                          <option>Reviewed</option>
                          <option>Shortlisted</option>
                          <option>Rejected</option>
                          <option>Accepted</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No applications have been submitted.</p>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-xl p-7 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Delete Opportunity?</h2>

              <button onClick={function () {
                setDeleteId(null)
              }}>
                <X />
              </button>
            </div>

            <p className="text-gray-600 mt-4">
              Are you sure you want to delete this opportunity? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-7">
              <button
                onClick={function () {
                  setDeleteId(null)
                }}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminDashboard