import '@/utils/polyfillCrypto';
import React, { useState, useCallback } from 'react';
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/sui/zklogin';
import { TouchableOpacity, Text, View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';

const USER_SALT_STORAGE_KEY = 'zklogin_user_salt';
const KEYPAIR_STORAGE_KEY = 'zklogin_ephemeral_keypair';
const MAX_EPOCH_STORAGE_KEY = 'zklogin_max_epoch';
const RANDOMNESS_STORAGE_KEY = 'zkLoginRandomness';

const storeData = async (key: string, value: string) => {
  try {
    if (Platform.OS === 'web') {
      window.sessionStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
    throw error;
  }
};

export function ZkLoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const initializeZkLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
      console.log("CLIENT_ID: ", CLIENT_ID);
      if (!CLIENT_ID) throw new Error('Google Client ID is not configured');

      const FULLNODE_URL = 'https://fullnode.devnet.sui.io';
      const suiClient = new SuiClient({ url: FULLNODE_URL });
      const { epoch } = await suiClient.getLatestSuiSystemState();
      
      const maxEpoch = Number(epoch) + 2;
      const ephemeralKeyPair = new Ed25519Keypair();

      const salt = generateRandomness();
      await storeData(USER_SALT_STORAGE_KEY, salt);
      
      const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, salt);
      
      // Store all required data
      await storeData(KEYPAIR_STORAGE_KEY, JSON.stringify({
        publicKey: Array.from(ephemeralKeyPair.keypair.publicKey),
        privateKey: Array.from(ephemeralKeyPair.keypair.secretKey),
      }));
      await storeData(MAX_EPOCH_STORAGE_KEY, maxEpoch.toString());
      await storeData(RANDOMNESS_STORAGE_KEY, salt);

      const REDIRECT_URL = Platform.select({
        web: `${window.location.origin}/callback`,
        default: `com.googleusercontent.apps.1021284785166-tohm6q4hs1df0k837jmpuvf154ob0l2j:/oauth2redirect/google`,
      });

      console.log("REDIRECT_URL: ", REDIRECT_URL);

      //const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URL}&scope=openid email&nonce=${nonce}`;
      const state = Math.random().toString(36).substring(2); // or use uuid
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URL}&scope=openid email profile&access_type=offline&prompt=consent&state=${state}&nonce=${nonce}`;
      
      console.log("authUrl: ", authUrl);
      
      if (Platform.OS === 'web') {
        window.location.href = authUrl;
      } else {
        const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URL);
        if (result.type === 'success') {

          const code = new URL(result.url).searchParams.get('code');
          if (!code) {
            setError('No authorization code returned');
            return;
          }

          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              code,
              client_id: CLIENT_ID,
              redirect_uri: REDIRECT_URL,
              grant_type: 'authorization_code'
            }).toString(),
          });

        const tokenData = await tokenRes.json();
        console.log("tokenData: ", tokenData);
        const jwt = tokenData.id_token;
        console.log("jwt: ", jwt);
        
        if (jwt) {
          await storeData('zklogin_id_token', jwt);  // Use your same storage method
          router.push(`/callback`);
        } else {
            setError('JWT not found in the authentication result');
          }
        } else {
          setError('Authentication failed');
        }
      }
    } catch (err) {
      console.error('Error initializing zkLogin:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={initializeZkLogin}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.grey[100]} />
            <Text style={styles.buttonText}>Initializing...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Continue with Google</Text>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.primary[600],
    paddingVertical: Layouts.spacing.md,
    paddingHorizontal: Layouts.spacing.xl,
    borderRadius: Layouts.borderRadius.full,
    width: '100%',
    alignItems: 'center',
    marginBottom: Layouts.spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: Colors.grey[400],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layouts.spacing.sm,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: 'white',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.error.main,
    textAlign: 'center',
    marginTop: Layouts.spacing.xs,
  },
});