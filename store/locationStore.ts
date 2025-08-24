import { create } from 'zustand';
import { supabase } from '~/utils/supabase';

type ParkedLocation = {
  id: string;
  lng: number;
  lat: number;
  created_at: string;
};

type ParkingState = {
  location: ParkedLocation | null;
  history: ParkedLocation[];
  isLoading: boolean;
  error: string | null;
  fetchLocation: () => Promise<void>;
  parkHere: (lat: number, lng: number) => Promise<void>;
  clearLocation: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
};

export const useParkingStore = create<ParkingState>((set, get) => ({
  location: null,
  history: [],
  isLoading: false,
  error: null,

  fetchLocation: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('parked_locations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      set({
        location: data
          ? {
              id: data.id,
              lat: data.latitude,
              lng: data.longitude,
              created_at: data.created_at,
            }
          : null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  parkHere: async (lat, lng) => {
    try {
      set({ isLoading: true, error: null });
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('parked_locations')
        .insert({
          user_id: user.id,
          latitude: lat,
          longitude: lng,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('parking_history').insert({
        user_id: user.id,
        lat,
        lng,
      });

      set({
        location: {
          id: data.id,
          lat: data.latitude,
          lng: data.longitude,
          created_at: data.created_at,
        },
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  clearLocation: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      await supabase.from('parked_locations').delete().eq('user_id', user.id);

      set({ location: null, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchHistory: async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('parking_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ history: data || [] });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteHistoryItem: async (id) => {
    try {
      const { error } = await supabase.from('parking_history').delete().eq('id', id);

      if (error) throw error;

      set((state) => ({
        history: state.history.filter((loc) => loc.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
