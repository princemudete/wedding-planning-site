import { useState, useEffect } from 'react';
import { Heart, Plus, Calendar, MapPin, Users, DollarSign, Edit, Trash2, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Wedding } from '../lib/supabase';
import WeddingForm from './WeddingForm';
import Countdown from './Countdown';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWedding, setEditingWedding] = useState<Wedding | undefined>();

  const loadWeddings = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('user_id', user.id)
      .order('wedding_date', { ascending: true });

    if (!error && data) {
      setWeddings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWeddings();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wedding plan?')) return;

    const { error } = await supabase
      .from('weddings')
      .delete()
      .eq('id', id);

    if (!error) {
      loadWeddings();
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingWedding(undefined);
    loadWeddings();
  };

  const handleEdit = (wedding: Wedding) => {
    setEditingWedding(wedding);
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDefaultImage = (index: number) => {
    const images = [
      'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    ];
    return images[index % images.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-400" fill="currentColor" />
            <span className="text-2xl font-serif">Ever After</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-serif mb-2">Your Planned Weddings</h1>
              <p className="text-gray-600 text-lg">
                Create and manage all your beautiful wedding plans in one place
              </p>
            </div>
            <button
              onClick={() => {
                setEditingWedding(undefined);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>New Wedding</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your weddings...</p>
          </div>
        ) : weddings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Heart className="w-16 h-16 text-rose-200 mx-auto mb-4" />
            <h2 className="text-2xl font-serif mb-2">No Weddings Yet</h2>
            <p className="text-gray-600 mb-6">Start planning your dream wedding today!</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Wedding</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.map((wedding, index) => (
              <div
                key={wedding.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={wedding.image_url || getDefaultImage(index)}
                    alt={wedding.couple_names}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-serif text-white mb-1">{wedding.couple_names}</h3>
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(wedding.wedding_date)}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-rose-600 rounded-full text-xs font-medium">
                      {wedding.status || 'Planning'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <Countdown targetDate={wedding.wedding_date} />
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="text-gray-900">{wedding.venue}</p>
                    </div>
                  </div>

                  {wedding.guest_count > 0 && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="text-gray-900">{wedding.guest_count} people</p>
                      </div>
                    </div>
                  )}

                  {wedding.budget && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="text-gray-900">
                          ${parseFloat(wedding.budget.toString()).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {wedding.theme && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Theme</p>
                      <p className="text-gray-900">{wedding.theme}</p>
                    </div>
                  )}

                  {wedding.notes && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Notes</p>
                      <p className="text-gray-600 text-sm line-clamp-3">{wedding.notes}</p>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={() => handleEdit(wedding)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(wedding.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <WeddingForm
          onClose={() => {
            setShowForm(false);
            setEditingWedding(undefined);
          }}
          onSuccess={handleFormSuccess}
          wedding={editingWedding}
        />
      )}
    </div>
  );
}
