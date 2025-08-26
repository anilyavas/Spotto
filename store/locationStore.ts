import { create } from 'zustand';
import { supabase } from '~/utils/supabase';

export type ParkedLocation = {
  id: string;
  lng: number;
  lat: number;
  created_at: string;
};

export type ParkingState = {
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

      const optimisticLocation: ParkedLocation = {
        id: 'temp-' + Date.now(),
        lat,
        lng,
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        location: optimisticLocation,
        isLoading: false,
      }));

      const { data, error } = await supabase
        .from('parked_locations')
        .insert({
          user_id: user.id,
          latitude: lat,
          longitude: lng,
        })
        .select()
        .single();

      if (error) {
        set({ location: null, error: error.message, isLoading: false });
        throw error;
      }

      const { data: historyData, error: historyError } = await supabase
        .from('parking_history')
        .insert({
          user_id: user.id,
          latitude: lat,
          longitude: lng,
        })
        .select()
        .single();

      if (historyError) {
        console.warn('Failed to add to history:', historyError);
      }

      set((state) => ({
        location: {
          id: data.id,
          lat: data.latitude,
          lng: data.longitude,
          created_at: data.created_at,
        },
        history: historyData ? [historyData, ...state.history] : state.history,
        isLoading: false,
        error: null,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false, location: null });
    }
  },

  clearLocation: async () => {
    try {
      const currentLocation = get().location;
      set({ location: null, isLoading: true, error: null });

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('parked_locations').delete().eq('user_id', user.id);

      if (error) {
        set({ location: currentLocation, error: error.message, isLoading: false });
        throw error;
      }

      set({ location: null, isLoading: false, error: null });
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
