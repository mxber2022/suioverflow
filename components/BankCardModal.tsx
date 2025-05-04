import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, CreditCard, Eye, EyeOff, Copy } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import { useState } from 'react';

interface BankCardModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BankCardModal({ visible, onClose }: BankCardModalProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleCopy = (text: string) => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(text);
    }
    // Show feedback
    alert('Copied to clipboard!');
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
            <Text style={styles.modalTitle}>Virtual Card Details</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={Colors.grey[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            {Platform.OS === 'web' ? (
              <View style={styles.cardBackground} />
            ) : (
              <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
            )}
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>Virtual Card</Text>
                <CreditCard size={24} color={Colors.primary[700]} />
              </View>
              
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>CARD NUMBER</Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailValue}>
                      {showDetails ? '4242 4242 4242 4242' : '•••• •••• •••• 4242'}
                    </Text>
                    <TouchableOpacity 
                      style={styles.copyButton}
                      onPress={() => handleCopy('4242424242424242')}
                    >
                      <Copy size={16} color={Colors.primary[700]} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>EXPIRY</Text>
                    <Text style={styles.detailValue}>12/25</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>CVV</Text>
                    <View style={styles.detailValueContainer}>
                      <Text style={styles.detailValue}>
                        {showDetails ? '123' : '•••'}
                      </Text>
                      <TouchableOpacity 
                        style={styles.copyButton}
                        onPress={() => handleCopy('123')}
                      >
                        <Copy size={16} color={Colors.primary[700]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.showDetailsButton}
                onPress={() => setShowDetails(!showDetails)}
              >
                {showDetails ? (
                  <EyeOff size={20} color={Colors.primary[700]} />
                ) : (
                  <Eye size={20} color={Colors.primary[700]} />
                )}
                <Text style={styles.showDetailsText}>
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.securityNote}>
            Your card details are end-to-end encrypted and stored securely
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
  cardContainer: {
    backgroundColor: Colors.primary[50],
    borderRadius: Layouts.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Layouts.spacing.xl,
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary[50],
  },
  cardContent: {
    padding: Layouts.spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layouts.spacing.xl,
  },
  cardType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.primary[700],
  },
  cardDetails: {
    gap: Layouts.spacing.xl,
  },
  detailRow: {
    gap: Layouts.spacing.xs,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: Layouts.spacing.xl,
  },
  detailItem: {
    flex: 1,
    gap: Layouts.spacing.xs,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.grey[500],
    letterSpacing: 0.5,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layouts.spacing.sm,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.grey[900],
    letterSpacing: 1,
  },
  copyButton: {
    padding: Layouts.spacing.xs,
  },
  showDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layouts.spacing.sm,
    alignSelf: 'center',
    marginTop: Layouts.spacing.xl,
    padding: Layouts.spacing.sm,
  },
  showDetailsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
  },
  securityNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[500],
    textAlign: 'center',
  },
});