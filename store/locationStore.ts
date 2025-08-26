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
  getLocationStatus: () => { hasCurrentLocation: boolean; historyCount: number };
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

      console.log('User authenticated:', user.id);

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

      console.log('Inserting into parked_locations:', {
        user_id: user.id,
        latitude: lat,
        longitude: lng,
      });
      const { data: locationData, error: locationError } = await supabase
        .from('parked_locations')
        .insert({
          user_id: user.id,
          latitude: lat,
          longitude: lng,
        })
        .select()
        .single();

      if (locationError) {
        console.error('Error inserting into parked_locations:', locationError);
        set({ location: null, error: locationError.message, isLoading: false });
        throw locationError;
      }

      console.log('Successfully inserted into parked_locations:', locationData);

      console.log('Inserting into parking_history:', {
        user_id: user.id,
        latitude: lat,
        longitude: lng,
      });
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
        console.error('ERROR inserting into parking_history:', historyError);
        console.error('Full error details:', JSON.stringify(historyError, null, 2));

        set((state) => ({
          location: {
            id: locationData.id,
            lat: locationData.latitude,
            lng: locationData.longitude,
            created_at: locationData.created_at,
          },
          error: `Parked successfully, but failed to save to history: ${historyError.message}`,
          isLoading: false,
        }));
        return;
      }

      console.log('Successfully inserted into parking_history:', historyData);

      set((state) => ({
        location: {
          id: locationData.id,
          lat: locationData.latitude,
          lng: locationData.longitude,
          created_at: locationData.created_at,
        },
        history: historyData
          ? [
              {
                id: historyData.id,
                lat: historyData.latitude,
                lng: historyData.longitude,
                created_at: historyData.created_at,
              },
              ...state.history,
            ]
          : state.history,
        isLoading: false,
        error: null,
      }));

      console.log('Successfully parked and added to history');
    } catch (err: any) {
      console.error('Full parkHere error:', err);
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
      console.log('Current parking location cleared, but history preserved');
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

  getLocationStatus: () => {
    const state = get();
    return {
      hasCurrentLocation: !!state.location,
      historyCount: state.history.length,
    };
  },
}));
