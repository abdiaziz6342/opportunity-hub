import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import OpportunityCard from '../components/OpportunityCard'
import Skeleton from '../components/Skeleton'
import { Search, Users, GraduationCap, BriefcaseBusiness } from 'lucide-react'

function Home() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function () {
    fetch('http://localhost:3000/opportunities')
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        setOpportunities(data.slice(0, 3))
        setLoading(false)
      })
      .catch(function () {
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <section className="bg-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-300 font-semibold mb-4">
              OPPORTUNITIES FOR YOUR FUTURE
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover opportunities. Build your future.
            </h1>

            <p className="text-gray-300 mt-6 text-lg">
              Find jobs, internships, scholarships and training
              opportunities across Northern Kenya.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/opportunities"
                className="bg-blue-600 px-6 py-3 rounded-lg font-semibold"
              >
                Explore Opportunities
              </Link>

              <Link
                to="/account"
                className="border border-white px-6 py-3 rounded-lg"
              >
                Create Account
              </Link>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000"
            alt="Students working together"
            className="rounded-2xl w-full h-80 object-cover"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border">
            <BriefcaseBusiness className="text-blue-700" size={30} />
            <h3 className="font-bold text-xl mt-4">Jobs</h3>
            <p className="text-gray-600 mt-2">Discover employment opportunities.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <GraduationCap className="text-blue-700" size={30} />
            <h3 className="font-bold text-xl mt-4">Scholarships</h3>
            <p className="text-gray-600 mt-2">Find opportunities to continue learning.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <Users className="text-blue-700" size={30} />
            <h3 className="font-bold text-xl mt-4">Internships</h3>
            <p className="text-gray-600 mt-2">Gain experience and develop your skills.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Latest Opportunities</h2>
            <p className="text-gray-500 mt-2">Explore recently added listings.</p>
          </div>

          <Link to="/opportunities" className="text-blue-700 font-semibold">
            View All
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : opportunities.length > 0 ? (
            opportunities.map(function (opportunity) {
              return (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              )
            })
          ) : (
            <p>No opportunities available yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home