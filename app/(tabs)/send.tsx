import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { ArrowLeft, QrCode, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { CameraView } from 'expo-camera';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import { Contact } from '@/types/Contact';
import { CONTACTS } from '@/data/contacts';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { genAddressSeed, getZkLoginSignature } from '@mysten/sui/zklogin';

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

type OldKeyPair = {
  publicKey?: number[];
  privateKey?: number[];
};

type NewKeyPair = {
  keypair: {
    publicKey: number[];
    secretKey: number[];
  };
};

function convertKeyPair(oldKeyPair: OldKeyPair): NewKeyPair {
  return {
    keypair: {
      publicKey: oldKeyPair.publicKey,
      secretKey: oldKeyPair.privateKey
    }
  };
}

export default function TransferScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  
  const favoriteContacts = CONTACTS.filter(contact => contact.isFavorite);
  
  const handleTransfer = async () => {
    if (!amount || !address) return;
    try{
      console.log(await getData('zkLoginAddress'));
      const raw = await getData('zklogin_ephemeral_keypair');
      const parsed = JSON.parse(raw); // contains { publicKey: [...], privateKey: [...] }
      const secretKey = new Uint8Array([...parsed.privateKey, ...parsed.publicKey]);
      const mykeypair = new Ed25519Keypair({ publicKey: Uint8Array.from(parsed.publicKey), secretKey });
      console.log("✅ mykeypair: ", mykeypair.getPublicKey().toBase64());

      const client = new SuiClient({ url: getFullnodeUrl("testnet") });
      const tx = new Transaction();
      //@ts-ignore
      tx.setSender(await getData('zkLoginAddress'));
      const [coin] = tx.splitCoins(tx.gas, [
        BigInt(Number(amount) * Number(MIST_PER_SUI)),
      ]);
      console.log("addres: ", address);
      tx.transferObjects([coin], address);
      const {bytes, signature:userSignature} = await tx.sign({
        client,
        signer: mykeypair,
      });

      // const decodedJwt = await getData('zkLoginJwt')
      // const maxEpoch = await getData('zklogin_max_epoch')
      // const addressSeed = genAddressSeed(
      //   BigInt(await getData('zklogin_user_salt')),
      //   'sub',
      //   decodedJwt.sub,
      //   decodedJwt.aud,
      // ).toString();
      
      // const zkLoginSignature = getZkLoginSignature({
      //   inputs: {
      //     ...partialZkLoginSignature,
      //     addressSeed,
      //   },
      //   maxEpoch,
      //   userSignature,
      // });

      // client.executeTransactionBlock({
      //   transactionBlock: bytes,
      //   signature: zkLoginSignature,
      // });

      const result = await client.signAndExecuteTransaction({
        signer: mykeypair,
        transaction: tx,
    });
  
      console.log("result: ", result);
      alert(`Transferring ${amount} USDC`);
    }
    catch(e){
      console.log("eror sending money: ", e);
      alert(`Error transferring USDC`);
    }
  };

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    setShowScanner(false);
    setAddress(data);
  };

  const handleSelectContact = (contact: Contact) => {
    setAddress(contact.walletAddress);
  };
  
  if (showScanner) {
    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{
            barCodeTypes: ['qr'],
            interval: 1000,
          }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.scannerOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowScanner(false)}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.scanFrame} />
            <Text style={styles.scannerText}>Scan QR code to get address</Text>
          </View>
        </CameraView>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', default: 'height' })}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.grey[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer </Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.grey[400]}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>To Address</Text>
          <View style={styles.addressInputContainer}>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter wallet address"
              placeholderTextColor={Colors.grey[400]}
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => setShowScanner(true)}
            >
              <QrCode size={20} color={Colors.primary[700]} />
            </TouchableOpacity>
          </View>
        </View>

        {favoriteContacts.length > 0 && (
          <View style={styles.favoritesContainer}>
            <Text style={styles.favoritesTitle}>Quick Transfer</Text>
            <View style={styles.favoritesList}>
              {favoriteContacts.map(contact => (
                <TouchableOpacity
                  key={contact.id}
                  style={[
                    styles.favoriteItem,
                    address === contact.walletAddress && styles.selectedFavorite
                  ]}
                  onPress={() => handleSelectContact(contact)}
                >
                  <View style={styles.favoriteIcon}>
                    <Star size={16} color={Colors.primary[700]} fill={Colors.primary[700]} />
                  </View>
                  <Text style={styles.favoriteName}>{contact.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.transferButton,
              (!amount || !address) && styles.transferButtonDisabled,
            ]}
            disabled={!amount || !address}
            onPress={handleTransfer}
          >
            <Text style={styles.transferButtonText}>
              Transfer ${amount || '0.00'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layouts.spacing.xl,
    paddingTop: Platform.select({ web: 40, default: 60 }),
    paddingBottom: Layouts.spacing.lg,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Layouts.spacing.xl,
  },
  backButton: {
    padding: Layouts.spacing.sm,
    marginRight: Layouts.spacing.md,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.grey[900],
  },
  amountContainer: {
    marginBottom: Layouts.spacing.xl,
  },
  amountLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey[700],
    marginBottom: Layouts.spacing.sm,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[50],
    borderRadius: Layouts.borderRadius.lg,
    padding: Layouts.spacing.lg,
  },
  currencySymbol: {
    fontFamily: 'Inter-Medium',
    fontSize: 32,
    color: Colors.grey[900],
    marginRight: Layouts.spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: Colors.grey[900],
  },
  addressContainer: {
    marginBottom: Layouts.spacing.xl,
  },
  addressLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey[700],
    marginBottom: Layouts.spacing.sm,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[50],
    borderRadius: Layouts.borderRadius.lg,
    paddingLeft: Layouts.spacing.lg,
  },
  addressInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.grey[900],
    height: 56,
  },
  scanButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
    borderTopRightRadius: Layouts.borderRadius.lg,
    borderBottomRightRadius: Layouts.borderRadius.lg,
  },
  favoritesContainer: {
    marginBottom: Layouts.spacing.xl,
  },
  favoritesTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.grey[900],
    marginBottom: Layouts.spacing.md,
  },
  favoritesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layouts.spacing.md,
  },
  favoriteItem: {
    backgroundColor: Colors.grey[50],
    borderRadius: Layouts.borderRadius.lg,
    padding: Layouts.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layouts.spacing.sm,
  },
  selectedFavorite: {
    backgroundColor: Colors.primary[50],
  },
  favoriteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey[900],
  },
  buttonContainer: {
    marginTop: Layouts.spacing.xl,
  },
  transferButton: {
    backgroundColor: Colors.primary[700],
    height: 56,
    borderRadius: Layouts.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transferButtonDisabled: {
    backgroundColor: Colors.grey[300],
  },
  transferButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'space-between',
    padding: Layouts.spacing.xl,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.select({ web: 20, default: 40 }),
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.primary[500],
    borderRadius: Layouts.borderRadius.md,
    alignSelf: 'center',
  },
  scannerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: Platform.select({ web: 20, default: 40 }),
  },
});