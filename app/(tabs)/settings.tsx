import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { supabase } from '../../utils/supabase';
import { useAuth } from '~/context/AuthContext';

export default function Profile() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { user }: User | any = useAuth();

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        Alert.alert('Error', 'User is not logged in');
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        Alert.alert('Error', 'Old password is incorrect');
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        Alert.alert('Error', updateError.message);
      } else {
        Alert.alert('Success', 'Password updated successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Something went wrong. Please try again later');
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? This action is irreversible!',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              if (!user) {
                Alert.alert('Error', 'User is not logged in');
                return;
              }

              setLoading(true);

              try {
                const session = await supabase.auth.getSession();
                const accessToken = session?.data?.session?.access_token;

                if (!accessToken) {
                  Alert.alert('Error', 'No access token found. Please log in again.');
                  return;
                }

                const response = await fetch(
                  `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-user`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to delete user');

                Alert.alert('Success', 'Your account has been deleted.');
                await supabase.auth.signOut();
              } catch (error: any) {
                Alert.alert('Something went wrong.');
                console.error('Delete user error:', error);
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Delete user error:', error);
    }
  };

  if (user?.is_anonymous) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-center font-bold text-gray-800">Signed in as Guest.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="border-b-hairline border-gray-400 p-2 text-xl font-bold text-green-600">
        {'Account Settings'.toUpperCase()}
      </Text>
      <View className="flex-1 p-5">
        {/* User Info */}
        <View className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <Text className="text-lg font-semibold text-gray-800">Email: {user.email}</Text>
        </View>

        {/* Change Password Section */}
        <View className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <Text className="mb-2 text-base font-semibold text-gray-700">Old Password</Text>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            placeholder="Enter old password"
            placeholderTextColor="gray"
            className="mb-4 rounded border border-gray-300 bg-white p-3 text-gray-800"
          />

          <Text className="mb-2 text-base font-semibold text-gray-700">New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Enter new password"
            placeholderTextColor="gray"
            className="mb-4 rounded border border-gray-300 bg-white p-3 text-gray-800"
          />

          <Text className="mb-2 text-base font-semibold text-gray-700">Confirm New Password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm new password"
            placeholderTextColor="gray"
            className="mb-4 rounded border border-gray-300 bg-white p-3 text-gray-800"
          />

          <Pressable
            onPress={handlePasswordChange}
            className="items-center rounded-lg bg-green-600 p-4"
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size={'large'} color="#fff" />
            ) : (
              <Text className="font-bold text-white">Change Password</Text>
            )}
          </Pressable>
        </View>

        {/* Delete Account */}
        <Pressable
          onPress={handleDeleteUser}
          className="m-4 items-center rounded-lg bg-red-600 p-4">
          <Text className="font-bold text-white">Delete Account</Text>
        </Pressable>

        {/* Sign Out */}
        <Pressable
          onPress={() => supabase.auth.signOut()}
          className="m-4 items-center rounded-lg bg-gray-800 p-4">
          <Text className="font-bold text-white">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
