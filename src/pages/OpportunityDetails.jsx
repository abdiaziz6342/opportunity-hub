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

        return fetch('http://localhost:3000/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            opportunityId: id,
            title: opportunity.title,
            organization: opportunity.organization,
            status: 'Pending',
            date: new Date().toLocaleDateString()
          })
        })
      })
      .then(function (response) {
        if (!response) {
          return
        }

        return response.json()
      })
      .then(function (data) {
        if (data) {
          setMessage('Your application has been submitted successfully.')
        }
      })
      .catch(function () {
        setMessage('Unable to submit your application. Try again.')
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

        <div className="flex flex-wrap gap-4 mt-8">
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
        </div>
      </div>
    </section>
  )
}

export default OpportunityDetails