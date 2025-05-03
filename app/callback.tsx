import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { getExtendedEphemeralPublicKey, jwtToAddress, generateNonce } from '@mysten/sui/zklogin';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_SALT_STORAGE_KEY = 'zklogin_user_salt';
const KEYPAIR_STORAGE_KEY = 'zklogin_ephemeral_keypair';
const MAX_EPOCH_STORAGE_KEY = 'zklogin_max_epoch';
const RANDOMNESS_STORAGE_KEY = 'zkLoginRandomness';

const getData = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return window.sessionStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

const storeData = async (key: string, value: string) => {
  try {
    if (Platform.OS === 'web') {
      window.sessionStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
  }
};

export default function ZkLoginCallback() {
  const [status, setStatus] = useState('Processing login...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the token from the URL hash
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace('#', '?'));
        const id_token = params.get('id_token');
        
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        let jwt = fragment.get('id_token');
        
        if (!id_token) {
          //throw new Error('No JWT found in callback URL');

          const storedJwt = await AsyncStorage.getItem('zklogin_id_token');
          console.log("storedJwt: ", storedJwt);
          jwt = storedJwt;
        }

        // Get stored data
        const storedKeyPair = await getData(KEYPAIR_STORAGE_KEY);
        const randomness = await getData(RANDOMNESS_STORAGE_KEY);
        const maxEpoch = await getData(MAX_EPOCH_STORAGE_KEY);
        const salt = await getData(USER_SALT_STORAGE_KEY);

        if (!storedKeyPair || !randomness || !maxEpoch || !salt) {
          throw new Error('Missing login session data');
        }

        // Parse stored key pair data
        const keyPairData = JSON.parse(storedKeyPair);
        
        // Create keypair from stored private key
        const privateKeyBytes = new Uint8Array(keyPairData.privateKey);
        const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(privateKeyBytes);

        // Get extended ephemeral public key
        const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
          ephemeralKeyPair.getPublicKey()
        );

        setStatus('Generating address...');

        // Get zkLogin address using stored salt
        
        const zkLoginAddress = jwtToAddress(jwt, salt);
        console.log("hehe jwt: ", jwt);
        setStatus('Generating zero-knowledge proof...');
        
        // Get ZK proof
        // const proofResponse = await fetch('https://prover-dev.mystenlabs.com/v1', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     jwt,
        //     extendedEphemeralPublicKey: extendedEphemeralPublicKey.toString(),
        //     maxEpoch: parseInt(maxEpoch),
        //     jwtRandomness: randomness,
        //     salt,
        //     keyClaimName: 'sub',
        //   }),
        // });


        // if (!proofResponse.ok) {
        //   const errorData = await proofResponse.json();
        //   console.error("Proof generation failed:", errorData);
        
        //   throw new Error(
        //     `Failed to generate proof: ${JSON.stringify(errorData)}`
        //   );
        // }

        // const proofData = await proofResponse.json();


        //ENKOKI IMPLEMENTATION

         // Call Enoki API
         const enokiResponse = await fetch("https://api.enoki.mystenlabs.com/v1/zklogin", {
          headers: {
            'zklogin-jwt': jwt,
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_ENOKI_API_KEY}`
          }
        });

        console.log("enokiResponse: ", enokiResponse);
        if (!enokiResponse.ok) {
          const errorData = await enokiResponse.json();
          throw new Error(`Enoki API error: ${errorData.error || enokiResponse.statusText}`);
        }

        const enokiData = await enokiResponse.json();

        console.log("enokiData: ", enokiData);

        //END 

        // Store the login data
         await storeData('zkLoginJwt', jwt);
        // await storeData('zkLoginProof', JSON.stringify(proofData));
       // await storeData('zkLoginAddress', zkLoginAddress);
        await storeData('zkLoginAddress', enokiData.data.address);
        setStatus('Login successful! Redirecting...');
        setTimeout(() => router.replace('/(tabs)'), 1500);
      } catch (error) {
        console.error('Error processing zkLogin callback:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setStatus('Login failed');
      }
    };

    processCallback();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {error ? (
          <>
            <Text style={styles.statusText}>{status}</Text>
            <Text style={styles.errorText}>{error}</Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color={Colors.primary[700]} />
            <Text style={styles.statusText}>{status}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layouts.spacing.xl,
  },
  content: {
    backgroundColor: 'white',
    padding: Layouts.spacing.xl,
    borderRadius: Layouts.borderRadius.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    gap: Layouts.spacing.lg,
    shadowColor: Colors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.grey[700],
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.error.main,
    textAlign: 'center',
  },
});
