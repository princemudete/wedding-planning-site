import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

interface WeddingChecklistProps {
  weddingId: string;
  onClose: () => void;
}

export default function WeddingChecklist({ weddingId, onClose }: WeddingChecklistProps) {
  const { user } = useAuth();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  const defaultTasks = [
    'Set wedding date and venue',
    'Book venue',
    'Create guest list',
    'Send invitations',
    'Plan menu and catering',
    'Arrange flowers and decorations',
    'Book photographer',
    'Book videographer',
    'Arrange music/DJ',
    'Plan honeymoon',
    'Get wedding attire',
    'Confirm RSVPs',
    'Finalize seating arrangements',
    'Wedding rehearsal',
    'Final preparations day before',
  ];

  useEffect(() => {
    loadTasks();
  }, [weddingId]);

  const loadTasks = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('wedding_tasks')
      .select('*')
      .eq('wedding_id', weddingId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      setChecklist([]);
    } else if (data && data.length > 0) {
      setChecklist(data.map(t => ({ id: t.id, task: t.task, completed: t.completed })));
    } else {
      await createDefaultTasks();
    }
    setLoading(false);
  };

  const createDefaultTasks = async () => {
    if (!user) return;

    const tasksToInsert = defaultTasks.map(task => ({
      wedding_id: weddingId,
      user_id: user.id,
      task,
      completed: false,
    }));

    const { data, error } = await supabase
      .from('wedding_tasks')
      .insert(tasksToInsert)
      .select();

    if (!error && data) {
      setChecklist(data.map(t => ({ id: t.id, task: t.task, completed: t.completed })));
    }
  };

  const toggleTask = async (id: string) => {
    const task = checklist.find(t => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from('wedding_tasks')
      .update({ completed: !task.completed })
      .eq('id', id);

    if (!error) {
      setChecklist(checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ));
    }
  };

  const addTask = async () => {
    if (!user || !newTask.trim()) return;
    setAddingTask(true);

    const { data, error } = await supabase
      .from('wedding_tasks')
      .insert([{
        wedding_id: weddingId,
        user_id: user.id,
        task: newTask,
        completed: false,
      }])
      .select();

    if (!error && data) {
      setChecklist([...checklist, { id: data[0].id, task: data[0].task, completed: false }]);
      setNewTask('');
    }
    setAddingTask(false);
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('wedding_tasks')
      .delete()
      .eq('id', id);

    if (!error) {
      setChecklist(checklist.filter(item => item.id !== id));
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex items-center justify-center">
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif">Wedding Planning Checklist</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{completedCount} of {checklist.length} completed</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-rose-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-2 overflow-y-auto">
          {checklist.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <button
                onClick={() => toggleTask(item.id)}
                className="flex-shrink-0"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-rose-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </button>
              <span className={`flex-1 text-left ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {item.task}
              </span>
              <button
                onClick={() => deleteTask(item.id)}
                className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none text-sm"
            />
            <button
              onClick={addTask}
              disabled={addingTask || !newTask.trim()}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-colors font-medium"
            >
              Done
            </button>
            {completedCount === checklist.length && checklist.length > 0 && (
              <div className="flex-1 flex items-center justify-center bg-green-50 rounded-lg text-green-600 font-medium text-sm">
                All set!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
