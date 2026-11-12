import { Link } from 'react-router-dom'
import { MapPin, CalendarDays, BriefcaseBusiness } from 'lucide-react'

function OpportunityCard({ opportunity }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition">
      <img
        src={opportunity.image}
        alt={opportunity.title}
        className="w-full h-44 object-cover"
      />

      <div className="p-5">
        <span className="text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
          {opportunity.type}
        </span>

        <h3 className="text-xl font-bold mt-4">
          {opportunity.title}
        </h3>

        <p className="text-gray-600 mt-2">
          {opportunity.organization}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
          <span className="flex items-center gap-1">
            <MapPin size={16} />
            {opportunity.location}
          </span>

          <span className="flex items-center gap-1">
            <BriefcaseBusiness size={16} />
            {opportunity.category}
          </span>
        </div>

        <p className="flex items-center gap-2 text-sm text-gray-500 mt-4">
          <CalendarDays size={16} />
          Deadline: {opportunity.deadline}
        </p>

        <Link
          to={`/opportunities/${opportunity.id}`}
          className="block text-center bg-blue-700 text-white py-3 rounded-lg mt-5 hover:bg-blue-800"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default OpportunityCard