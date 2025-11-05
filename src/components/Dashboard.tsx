import { useState, useEffect } from 'react';
import { Heart, Plus, Calendar, MapPin, Users, DollarSign, Edit, Trash2, LogOut, ChevronDown, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Wedding } from '../lib/supabase';
import WeddingForm from './WeddingForm';
import Countdown from './Countdown';
import WeddingChecklist from './WeddingChecklist';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWedding, setEditingWedding] = useState<Wedding | undefined>();
  const [showProfile, setShowProfile] = useState(false);
  const [expandedWedding, setExpandedWedding] = useState<string | null>(null);
  const [showAllWeddings, setShowAllWeddings] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistWeddingId, setChecklistWeddingId] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'upcoming' | 'completed'>('upcoming');

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

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const upcomingWeddings = weddings.filter(w => w.status !== 'Completed');
  const completedWeddings = weddings.filter(w => w.status === 'Completed');

  const currentWeddings = filterTab === 'upcoming' ? upcomingWeddings : completedWeddings;
  const displayedWeddings = showAllWeddings ? currentWeddings : currentWeddings.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-400" fill="currentColor" />
            <span className="text-2xl font-serif">Ever After</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {getInitials(user?.email || '')}
                </div>
                <span className="text-sm text-gray-700 font-medium hidden sm:inline">{user?.email}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Logged in as</p>
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setShowProfile(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
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

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => {
                setFilterTab('upcoming');
                setShowAllWeddings(false);
                setExpandedWedding(null);
              }}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                filterTab === 'upcoming'
                  ? 'bg-rose-400 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming ({upcomingWeddings.length})
            </button>
            <button
              onClick={() => {
                setFilterTab('completed');
                setShowAllWeddings(false);
                setExpandedWedding(null);
              }}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                filterTab === 'completed'
                  ? 'bg-green-400 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({completedWeddings.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your weddings...</p>
          </div>
        ) : currentWeddings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Heart className="w-16 h-16 text-rose-200 mx-auto mb-4" />
            <h2 className="text-2xl font-serif mb-2">
              {filterTab === 'upcoming' ? 'No Upcoming Weddings' : 'No Completed Weddings'}
            </h2>
            <p className="text-gray-600 mb-6">
              {filterTab === 'upcoming'
                ? 'Start planning your dream wedding today!'
                : 'Your completed weddings will appear here'}
            </p>
            {filterTab === 'upcoming' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Wedding</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedWeddings.map((wedding, index) => {
                const isExpanded = expandedWedding === wedding.id;
                return (
                  <div
                    key={wedding.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden ${isExpanded ? 'lg:col-span-2' : ''}`}
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={wedding.image_url || getDefaultImage(index)}
                        alt={wedding.couple_names}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-3 right-3">
                        <h3 className="text-lg font-serif text-white mb-0.5">{wedding.couple_names}</h3>
                        <div className="flex items-center gap-2 text-white/90">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">{formatDate(wedding.wedding_date)}</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-3">
                        <span className="inline-block px-2 py-0.5 bg-white/90 backdrop-blur-sm text-rose-600 rounded-full text-xs font-medium">
                          {wedding.status || 'Planning'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Venue</p>
                          <p className="text-sm text-gray-900 font-medium">{wedding.venue}</p>
                        </div>
                      </div>

                      {isExpanded && (
                        <>
                          {wedding.guest_count > 0 && (
                            <div className="flex items-start gap-2">
                              <Users className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">Guests</p>
                                <p className="text-sm text-gray-900">{wedding.guest_count} people</p>
                              </div>
                            </div>
                          )}

                          {wedding.budget && (
                            <div className="flex items-start gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">Budget</p>
                                <p className="text-sm text-gray-900">
                                  ${parseFloat(wedding.budget.toString()).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}

                          {wedding.theme && (
                            <div className="pt-1 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-0.5">Theme</p>
                              <p className="text-sm text-gray-900">{wedding.theme}</p>
                            </div>
                          )}

                          {wedding.notes && (
                            <div className="pt-1 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-0.5">Notes</p>
                              <p className="text-xs text-gray-600">{wedding.notes}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className={`px-3 py-2 border-t border-gray-100 flex gap-2 ${isExpanded ? 'flex-row-reverse' : ''}`}>
                      {isExpanded ? (
                        <>
                          <button
                            onClick={() => setExpandedWedding(null)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                          >
                            Show Less
                          </button>
                          <button
                            onClick={() => {
                              setChecklistWeddingId(wedding.id);
                              setShowChecklist(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Tasks
                          </button>
                          <button
                            onClick={() => handleEdit(wedding)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors text-sm"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(wedding.id)}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setExpandedWedding(wedding.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-colors text-sm font-medium"
                          >
                            View More
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(wedding)}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {currentWeddings.length > 3 && !showAllWeddings && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAllWeddings(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors shadow-lg hover:shadow-xl font-medium"
                >
                  View More Weddings
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {showAllWeddings && currentWeddings.length > 3 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    setShowAllWeddings(false);
                    setExpandedWedding(null);
                  }}
                  className="px-8 py-3 border-2 border-rose-400 text-rose-400 rounded-full hover:bg-rose-50 transition-colors font-medium"
                >
                  Show Less
                </button>
              </div>
            )}
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

      {showChecklist && (
        <WeddingChecklist
          weddingId={checklistWeddingId}
          onClose={() => setShowChecklist(false)}
        />
      )}
    </div>
  );
}
