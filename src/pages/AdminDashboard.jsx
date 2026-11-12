
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

function AdminDashboard() {

  const [opportunities, setOpportunities] = useState([])

  const [title, setTitle] = useState('')
  const [organization, setOrganization] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('Job')
  const [category, setCategory] = useState('')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')

  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // GET OPPORTUNITIES
  function getOpportunities() {
    fetch('http://localhost:3000/opportunities')
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        setOpportunities(data)
        setLoading(false)
      })
      .catch(function () {
        setMessage('Unable to load opportunities.')
        setLoading(false)
      })
  }

  useEffect(function () {
    getOpportunities()
  }, [])

  // CLEAR FORM
  function clearForm() {
    setTitle('')
    setOrganization('')
    setLocation('')
    setType('Job')
    setCategory('')
    setDeadline('')
    setDescription('')
    setImage('')
    setEditId(null)
  }

  // ADD OR UPDATE OPPORTUNITY
  function handleSubmit(event) {
    event.preventDefault()

    setMessage('')

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

    if (editId) {

      // UPDATE OPPORTUNITY
      fetch('http://localhost:3000/opportunities/' + editId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunity)
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Update failed')
          }
          return response.json()
        })
        .then(function () {
          setMessage('Opportunity updated successfully!')
          clearForm()
          getOpportunities()
        })
        .catch(function () {
          setMessage('Unable to update opportunity.')
        })

    } else {

      // ADD OPPORTUNITY
      fetch('http://localhost:3000/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunity)
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Creation failed')
          }
          return response.json()
        })
        .then(function () {
          setMessage('Opportunity added successfully!')
          clearForm()
          getOpportunities()
        })
        .catch(function () {
          setMessage('Unable to add opportunity.')
        })
    }
  }

  // EDIT OPPORTUNITY
  function handleEdit(opportunity) {
    setTitle(opportunity.title)
    setOrganization(opportunity.organization)
    setLocation(opportunity.location)
    setType(opportunity.type)
    setCategory(opportunity.category)
    setDeadline(opportunity.deadline)
    setDescription(opportunity.description)
    setImage(opportunity.image || '')

    setEditId(opportunity.id)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // DELETE OPPORTUNITY
  function handleDelete() {
    fetch('http://localhost:3000/opportunities/' + deleteId, {
      method: 'DELETE'
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Delete failed')
        }

        setMessage('Opportunity deleted successfully!')
        setDeleteId(null)
        getOpportunities()
      })
      .catch(function () {
        setMessage('Unable to delete opportunity.')
        setDeleteId(null)
      })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* PAGE HEADING */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage jobs, internships and scholarships.
        </p>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6">
          {message}
        </div>
      )}

      {/* OPPORTUNITY FORM */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-10">

        <div className="flex items-center gap-2 mb-6">
          {editId ? <Pencil size={22} /> : <Plus size={22} />}

          <h2 className="text-xl font-bold">
            {editId ? 'Edit Opportunity' : 'Add New Opportunity'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 font-medium">
                Opportunity Title
              </label>

              <input
                required
                value={title}
                onChange={function (event) {
                  setTitle(event.target.value)
                }}
                className="w-full border rounded-lg p-3"
                placeholder="Human Resource Intern"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Organization
              </label>

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
              <label className="block mb-2 font-medium">
                Location
              </label>

              <input
                required
                value={location}
                onChange={function (event) {
                  setLocation(event.target.value)
                }}
                className="w-full border rounded-lg p-3"
                placeholder="Garissa"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Opportunity Type
              </label>

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
              <label className="block mb-2 font-medium">
                Category
              </label>

              <input
                required
                value={category}
                onChange={function (event) {
                  setCategory(event.target.value)
                }}
                className="w-full border rounded-lg p-3"
                placeholder="Human Resources"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Application Deadline
              </label>

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

          </div>

          <div>
            <label className="block mb-2 font-medium">
              Image URL
            </label>

            <input
              value={image}
              onChange={function (event) {
                setImage(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              required
              rows="4"
              value={description}
              onChange={function (event) {
                setDescription(event.target.value)
              }}
              className="w-full border rounded-lg p-3"
              placeholder="Describe this opportunity..."
            />
          </div>

          <div className="flex gap-3">

            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
            >
              <Save size={18} />

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

      {/* OPPORTUNITIES LIST */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">
            Published Opportunities ({opportunities.length})
          </h2>
        </div>

        {loading ? (

          <div className="p-8 text-gray-500">
            Loading opportunities...
          </div>

        ) : opportunities.length === 0 ? (

          <div className="p-8 text-center text-gray-500">
            No opportunities available. Add your first opportunity above.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4">Opportunity</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>

                {opportunities.map(function (opportunity) {

                  return (
                    <tr key={opportunity.id} className="border-t">

                      <td className="p-4">
                        <p className="font-semibold">
                          {opportunity.title}
                        </p>

                        <p className="text-sm text-gray-500">
                          {opportunity.organization}
                        </p>
                      </td>

                      <td className="p-4">
                        {opportunity.location}
                      </td>

                      <td className="p-4">
                        {opportunity.type}
                      </td>

                      <td className="p-4">
                        {opportunity.deadline}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">

                          <button
                            onClick={function () {
                              handleEdit(opportunity)
                            }}
                            className="bg-blue-50 text-blue-700 p-2 rounded-lg"
                            title="Edit opportunity"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={function () {
                              setDeleteId(opportunity.id)
                            }}
                            className="bg-red-50 text-red-700 p-2 rounded-lg"
                            title="Delete opportunity"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-bold">
                Delete Opportunity
              </h2>

              <button onClick={function () {
                setDeleteId(null)
              }}>
                <X size={22} />
              </button>

            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this opportunity?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

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
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default AdminDashboard
