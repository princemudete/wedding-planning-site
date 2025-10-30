import { useEffect, useState } from 'react';
import {  MapPin, Users, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Wedding } from '../lib/supabase';

export default function Gallery() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeddings();
  }, []);

  const loadWeddings = async () => {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (!error && data) {
      setWeddings(data);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (weddings.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Your Planned Weddings</h2>
          <p className="text-lg text-gray-600">Beautiful celebrations crafted with love and care</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {weddings.map((wedding, index) => (
            <div
              key={wedding.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
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
                  <p className="text-white/90 text-sm">{formatDate(wedding.wedding_date)}</p>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{wedding.venue}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {wedding.guest_count > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{wedding.guest_count}</span>
                    </div>
                  )}

                  {wedding.budget && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">
                        ${parseFloat(wedding.budget.toString()).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-medium">
                    {wedding.status || 'Planning'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}