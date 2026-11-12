import { useEffect, useState } from 'react'
import OpportunityCard from '../components/OpportunityCard'
import Skeleton from '../components/Skeleton'
import { Search } from 'lucide-react'

function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [location, setLocation] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(function () {
    fetch('http://localhost:3000/opportunities')
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        setOpportunities(data)
        setLoading(false)
      })
      .catch(function () {
        setLoading(false)
      })
  }, [])

  const filteredOpportunities = opportunities.filter(function (opportunity) {
    const matchesSearch = opportunity.title.toLowerCase().includes(search.toLowerCase())

    const matchesType = type === 'All' || opportunity.type === type

    const matchesLocation = location === 'All' || opportunity.location === location

    return matchesSearch && matchesType && matchesLocation
  })

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold">Explore Opportunities</h1>

      <p className="text-gray-500 mt-3">
        Find opportunities that match your interests and career goals.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />

          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={function (event) {
              setSearch(event.target.value)
            }}
            className="w-full border rounded-lg py-3 pl-10 pr-4"
          />
        </div>

        <select
          value={type}
          onChange={function (event) {
            setType(event.target.value)
          }}
          className="border rounded-lg p-3"
        >
          <option value="All">All Types</option>
          <option value="Job">Jobs</option>
          <option value="Internship">Internships</option>
          <option value="Scholarship">Scholarships</option>
          <option value="Training">Training</option>
        </select>

        <select
          value={location}
          onChange={function (event) {
            setLocation(event.target.value)
          }}
          className="border rounded-lg p-3"
        >
          <option value="All">All Locations</option>
          <option value="Garissa">Garissa</option>
          <option value="Wajir">Wajir</option>
          <option value="Mandera">Mandera</option>
          <option value="Isiolo">Isiolo</option>
          <option value="Marsabit">Marsabit</option>
        </select>
      </div>

      <p className="text-gray-600 mt-8 mb-5">
        {loading ? 'Loading opportunities...' : `${filteredOpportunities.length} opportunities found`}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : filteredOpportunities.length > 0 ? (
          filteredOpportunities.map(function (opportunity) {
            return (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
              />
            )
          })
        ) : (
          <p className="text-gray-500">No matching opportunities found.</p>
        )}
      </div>
    </section>
  )
}

export default Opportunities