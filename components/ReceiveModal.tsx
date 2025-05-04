import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Copy, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';

interface ReceiveModalProps {
  visible: boolean;
  onClose: () => void;
  walletAddress: string;
}

export default function ReceiveModal({ visible, onClose, walletAddress }: ReceiveModalProps) {
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleCopyAddress = () => {
    // In a real app, you would use Clipboard API here
    alert('Address copied to clipboard!');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Receive USDC</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={Colors.grey[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <QRCode
              value={walletAddress}
              size={200}
              backgroundColor="white"
              color={Colors.primary[700]}
            />
          </View>

          <Text style={styles.instruction}>
            Scan this QR code or copy the address below to receive USDC
          </Text>

          <TouchableOpacity
            style={styles.addressContainer}
            onPress={handleCopyAddress}
          >
            <Text style={styles.address}>{formatWalletAddress(walletAddress)}</Text>
            <Copy size={20} color={Colors.primary[700]} />
          </TouchableOpacity>

          <Text style={styles.warning}>
            Only send USDC to this address. Sending other assets may result in permanent loss.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layouts.spacing.xl,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: Layouts.borderRadius.xl,
    padding: Layouts.spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layouts.spacing.xl,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.grey[900],
  },
  closeButton: {
    padding: Layouts.spacing.xs,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: Layouts.spacing.xl,
    borderRadius: Layouts.borderRadius.lg,
    marginBottom: Layouts.spacing.xl,
    shadowColor: Colors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instruction: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.grey[700],
    textAlign: 'center',
    marginBottom: Layouts.spacing.lg,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grey[50],
    padding: Layouts.spacing.md,
    borderRadius: Layouts.borderRadius.md,
    marginBottom: Layouts.spacing.lg,
  },
  address: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.grey[900],
    marginRight: Layouts.spacing.sm,
  },
  warning: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.error.main,
    textAlign: 'center',
  },
});