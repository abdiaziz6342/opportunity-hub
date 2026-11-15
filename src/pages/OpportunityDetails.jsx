
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Skeleton from '../components/Skeleton'
import { MapPin, CalendarDays, Bookmark, Send } from 'lucide-react'

function OpportunityDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const [phone, setPhone] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [cvLink, setCvLink] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(function () {
    fetch('http://localhost:3000/opportunities/' + id)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Opportunity not found')
        }

        return response.json()
      })
      .then(function (data) {
        setOpportunity(data)
        setLoading(false)
      })
      .catch(function () {
        setLoading(false)
      })
  }, [id])

  function handleApply() {
    const user = JSON.parse(localStorage.getItem('currentUser'))

    if (!user) {
      navigate('/account')
      return
    }

    fetch(
      'http://localhost:3000/applications?userId=' +
      user.id +
      '&opportunityId=' +
      id
    )
      .then(function (response) {
        return response.json()
      })
      .then(function (applications) {
        if (applications.length > 0) {
          setMessage('You have already applied for this opportunity.')
          return
        }

        setShowApplicationForm(true)
        setMessage('')
      })
      .catch(function () {
        setMessage('Unable to check your application. Try again.')
      })
  }

  function handleSubmitApplication(event) {
    event.preventDefault()

    const user = JSON.parse(localStorage.getItem('currentUser'))

    if (!user) {
      navigate('/account')
      return
    }

    setSubmitting(true)

    fetch('http://localhost:3000/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        opportunityId: id,
        name: user.name,
        email: user.email,
        phone: phone,
        coverLetter: coverLetter,
        cvLink: cvLink,
        title: opportunity.title,
        organization: opportunity.organization,
        status: 'Pending',
        date: new Date().toLocaleDateString()
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Application failed')
        }

        return response.json()
      })
      .then(function () {
        setMessage('Your application has been submitted successfully.')
        setShowApplicationForm(false)
        setPhone('')
        setCoverLetter('')
        setCvLink('')
        setSubmitting(false)
      })
      .catch(function () {
        setMessage('Unable to submit your application. Try again.')
        setSubmitting(false)
      })
  }

  function handleSave() {
    const user = JSON.parse(localStorage.getItem('currentUser'))

    if (!user) {
      navigate('/account')
      return
    }

    fetch(
      'http://localhost:3000/savedOpportunities?userId=' +
      user.id +
      '&opportunityId=' +
      id
    )
      .then(function (response) {
        return response.json()
      })
      .then(function (savedItems) {
        if (savedItems.length > 0) {
          setMessage('This opportunity is already saved.')
          return
        }

        return fetch('http://localhost:3000/savedOpportunities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            opportunityId: id,
            title: opportunity.title,
            organization: opportunity.organization
          })
        })
      })
      .then(function (response) {
        if (!response) {
          return
        }

        if (!response.ok) {
          throw new Error('Unable to save')
        }

        return response.json()
      })
      .then(function (data) {
        if (data) {
          setMessage('Opportunity saved successfully.')
        }
      })
      .catch(function () {
        setMessage('Unable to save this opportunity.')
      })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Skeleton />
      </div>
    )
  }

  if (!opportunity) {
    return <p className="text-center py-20">Opportunity not found.</p>
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <img
        src={opportunity.image}
        alt={opportunity.title}
        className="w-full h-72 object-cover rounded-2xl"
      />

      <div className="bg-white border rounded-2xl p-8 mt-8">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
          {opportunity.type}
        </span>

        <h1 className="text-3xl md:text-4xl font-bold mt-5">
          {opportunity.title}
        </h1>

        <p className="text-gray-600 mt-3">{opportunity.organization}</p>

        <div className="flex flex-wrap gap-6 mt-6 text-gray-500">
          <span className="flex items-center gap-2">
            <MapPin size={18} />
            {opportunity.location}
          </span>

          <span className="flex items-center gap-2">
            <CalendarDays size={18} />
            {opportunity.deadline}
          </span>
        </div>

        <h2 className="text-xl font-bold mt-10">About this opportunity</h2>

        <p className="text-gray-600 leading-7 mt-3">
          {opportunity.description}
        </p>

        {message && (
          <p className="bg-blue-50 text-blue-700 p-4 rounded-lg mt-6">
            {message}
          </p>
        )}

        {showApplicationForm && (
          <form
            onSubmit={handleSubmitApplication}
            className="border rounded-xl p-6 mt-8 space-y-4"
          >
            <h2 className="text-xl font-bold">Your Application</h2>

            <div>
              <label className="block font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={function (event) {
                  setPhone(event.target.value)
                }}
                required
                className="w-full border rounded-lg p-3"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Cover Letter</label>
              <textarea
                value={coverLetter}
                onChange={function (event) {
                  setCoverLetter(event.target.value)
                }}
                required
                rows="5"
                className="w-full border rounded-lg p-3"
                placeholder="Explain why you are suitable for this opportunity"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">CV Link</label>
              <input
                type="url"
                value={cvLink}
                onChange={function (event) {
                  setCvLink(event.target.value)
                }}
                className="w-full border rounded-lg p-3"
                placeholder="Paste a link to your CV (optional)"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>

              <button
                type="button"
                onClick={function () {
                  setShowApplicationForm(false)
                }}
                className="border px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-4 mt-8">
          {!showApplicationForm && (
            <>
              <button
                onClick={handleApply}
                className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                <Send size={18} />
                Apply Now
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 border border-blue-700 text-blue-700 px-6 py-3 rounded-lg"
              >
                <Bookmark size={18} />
                Save Opportunity
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default OpportunityDetails
