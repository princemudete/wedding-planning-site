import { ArrowRight, Heart, Calendar, Users, DollarSign } from 'lucide-react';
import Gallery from './Gallery';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-400" fill="currentColor" />
            <span className="text-2xl font-serif">Ever After</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#gallery" className="text-gray-600 hover:text-rose-400 transition-colors font-medium">
              Gallery
            </a>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6">
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center py-20">
          <h1 className="text-6xl md:text-7xl font-serif mb-6 leading-tight">
            Your Dream Wedding,
            <br />
            <span className="text-rose-400">Beautifully Planned.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Perfect every detail with our wedding planning experience. Plan every aspect from guest lists to budgets and timelines.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-all flex items-center gap-2 text-lg shadow-lg hover:shadow-xl"
          >
            Start Your Wedding Journey
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              Unlock Your Dream Wedding with Elegant Wedding Planner
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe every couple deserves a beautiful experience. Our platform simplifies every aspect of wedding planning, from creating guest lists and managing budgets to tracking important dates and capturing personalized themes. With our intuitive tools and inspiring inspiration, you can plan your perfect day with ease, joy, and confidence, making every moment truly unforgettable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-serif mb-2">Your Vision</h3>
              <p className="text-gray-600">Decide on your dream wedding theme</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-serif mb-2">Guest List</h3>
              <p className="text-gray-600">Manage your cherished guests effortlessly</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-serif mb-2">Budget Tracker</h3>
              <p className="text-gray-600">Keep everything within magical expenses</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-serif mb-2">Timeline</h3>
              <p className="text-gray-600">Plan every date to perfection</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Crafting Unforgettable Moments
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe every love story deserves a magical beginning. Our platform empowers you to design, organize, and dream. From picking themes and building budgets to curating guest lists and saving beautiful ideas, our tools give you control to create lasting memories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Wedding ceremony"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Wedding reception"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Wedding celebration"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>
      </main>

      <section id="gallery">
        <Gallery />
      </section>

      <footer className="bg-gradient-to-r from-rose-100 via-amber-100 to-emerald-100 py-8 mt-20">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2025 Ever After. Crafted with love.</p>
        </div>
      </footer>
    </div>
  );
}
