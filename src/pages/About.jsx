import { MapPin, Target, Users } from 'lucide-react'

function About() {
  return (
    <section>
      <div className="bg-blue-950 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold">About OpportunityHub</h1>

        <p className="max-w-2xl mx-auto text-gray-300 mt-5">
          A platform designed to connect young people with employment,
          education and professional development opportunities.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold">Our Purpose</h2>

            <p className="text-gray-600 leading-7 mt-5">
              OpportunityHub aims to make it easier for young people in
              Northern Kenya to discover opportunities in one place.
              Users can register, explore listings, apply for opportunities
              and track their applications.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1000"
            alt="Young people working together"
            className="rounded-2xl w-full h-72 object-cover"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white border rounded-xl p-7">
            <Target className="text-blue-700" size={32} />
            <h3 className="font-bold text-xl mt-4">Our Mission</h3>
            <p className="text-gray-600 mt-3">
              Improve access to opportunities for young people.
            </p>
          </div>

          <div className="bg-white border rounded-xl p-7">
            <Users className="text-blue-700" size={32} />
            <h3 className="font-bold text-xl mt-4">Our Community</h3>
            <p className="text-gray-600 mt-3">
              Support students, graduates and job seekers.
            </p>
          </div>

          <div className="bg-white border rounded-xl p-7">
            <MapPin className="text-blue-700" size={32} />
            <h3 className="font-bold text-xl mt-4">Our Focus</h3>
            <p className="text-gray-600 mt-3">
              Garissa, Wajir, Mandera, Isiolo and Marsabit.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About