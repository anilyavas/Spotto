import { create } from 'zustand';
import { supabase } from '~/utils/supabase';

interface SharedSpot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

interface SharedSpotsStore {
  spots: SharedSpot[];
  fetchSpots: () => Promise<void>;
  addSpot: (spot: Omit<SharedSpot, 'id' | 'created_at'>) => Promise<void>;
  updateSpot: (id: string, fields: Partial<SharedSpot>) => Promise<void>;
  deleteSpot: (id: string) => Promise<void>;
}

export const useSharedSpotsStore = create<SharedSpotsStore>((set, get) => ({
  spots: [],

  fetchSpots: async () => {
    const { data, error } = await supabase
      .from('shared_spots')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      set({ spots: data });
    } else {
      console.log('Error fetching shared spots: ', error?.message);
    }
  },

  addSpot: async (spot) => {
    const { error } = await supabase.from('shared_spots').insert([spot]);
    if (error) console.log('Error adding shared spot: ', error.message);
    else await get().fetchSpots();
  },

  updateSpot: async (id, fields) => {
    const { error } = await supabase.from('shared_spots').update(fields).eq('id', id);
    if (error) console.log('Error updating shared spot: ', error.message);
    else await get().fetchSpots();
  },

  deleteSpot: async (id) => {
    const { error } = await supabase.from('shared_spots').delete().eq('id', id);
    if (error) console.log('Error deleting shared spot: ', error.message);
    else await get().fetchSpots();
  },
}));
