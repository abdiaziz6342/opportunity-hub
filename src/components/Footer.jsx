import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold">OpportunityHub</h2>

        <p className="text-gray-400 mt-3 max-w-xl">
          Connecting young people in Northern Kenya with opportunities
          for employment, education and professional development.
        </p>

        <div className="flex gap-6 mt-6">
          <Link to="/">Home</Link>
          <Link to="/opportunities">Opportunities</Link>
          <Link to="/about">About</Link>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          © 2026 OpportunityHub. Learning project.
        </p>
      </div>
    </footer>
  )
}

export default Footer