import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Wedding } from '../lib/supabase';

interface WeddingFormProps {
  onClose: () => void;
  onSuccess: () => void;
  wedding?: Wedding;
}

export default function WeddingForm({ onClose, onSuccess, wedding }: WeddingFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    couple_names: wedding?.couple_names || '',
    wedding_date: wedding?.wedding_date || '',
    venue: wedding?.venue || '',
    guest_count: wedding?.guest_count || 0,
    budget: wedding?.budget || '',
    theme: wedding?.theme || '',
    notes: wedding?.notes || '',
    image_url: wedding?.image_url || '',
    status: wedding?.status || 'Planning',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const weddingData = {
        user_id: user.id,
        couple_names: formData.couple_names,
        wedding_date: formData.wedding_date,
        venue: formData.venue,
        guest_count: parseInt(formData.guest_count.toString()) || 0,
        budget: formData.budget ? parseFloat(formData.budget.toString()) : null,
        theme: formData.theme || null,
        notes: formData.notes || null,
        image_url: formData.image_url || null,
        status: formData.status || 'Planning',
        updated_at: new Date().toISOString(),
      };

      if (wedding) {
        const { error } = await supabase
          .from('weddings')
          .update(weddingData)
          .eq('id', wedding.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('weddings')
          .insert([weddingData]);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save wedding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-3xl font-serif">
            {wedding ? 'Edit Wedding Details' : 'Plan Your Dream Wedding'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couple Names
            </label>
            <input
              type="text"
              required
              value={formData.couple_names}
              onChange={(e) => setFormData({ ...formData, couple_names: e.target.value })}
              placeholder="e.g., John & Jane"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wedding Date
            </label>
            <input
              type="date"
              required
              value={formData.wedding_date}
              onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Location
            </label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g., Grand Ballroom, Downtown"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.guest_count}
                onChange={(e) => setFormData({ ...formData, guest_count: e.target.value as any })}
                placeholder="e.g., 150"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value as any })}
                placeholder="e.g., 25000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wedding Theme (optional)
              </label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                placeholder="e.g., Rustic Garden, Modern Elegance"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/wedding-image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Add a beautiful image URL for your wedding</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special details or requirements..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : wedding ? 'Update Wedding' : 'Save Wedding'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
