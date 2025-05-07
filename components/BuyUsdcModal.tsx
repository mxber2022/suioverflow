// components/BuyUsdcModal.tsx
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform } from 'react-native';
import { X, CreditCard, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import { useState } from 'react';

interface BuyUsdcModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BuyUsdcModal({ visible, onClose }: BuyUsdcModalProps) {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePurchase = () => {
    // Implement purchase logic here
    alert('Purchase functionality coming soon!');
    onClose();
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
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
            <Text style={styles.modalTitle}>Buy USDC</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={Colors.grey[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.amountSection}>
              <Text style={styles.sectionTitle}>Amount</Text>
              <View style={styles.amountInput}>
                <DollarSign size={20} color={Colors.grey[500]} />
                <TextInput
                  style={styles.amountTextInput}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
                <Text style={styles.currencyLabel}>USD</Text>
              </View>
              <Text style={styles.conversionRate}>1 USDC = $1.00</Text>
            </View>

            <View style={styles.paymentSection}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <View style={styles.cardInput}>
                  <CreditCard size={20} color={Colors.grey[500]} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="1234 5678 9012 3456"
                    keyboardType="number-pad"
                    maxLength={19}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="MM/YY"
                    keyboardType="number-pad"
                    maxLength={5}
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: Layouts.spacing.md }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="123"
                    keyboardType="number-pad"
                    maxLength={3}
                    value={cvv}
                    onChangeText={setCvv}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.purchaseButton,
                (!amount || !cardNumber || !expiryDate || !cvv) && styles.purchaseButtonDisabled
              ]}
              onPress={handlePurchase}
              disabled={!amount || !cardNumber || !expiryDate || !cvv}
            >
              <Text style={styles.purchaseButtonText}>
                Buy {amount ? `$${amount}` : '$0.00'} USDC
              </Text>
            </TouchableOpacity>

            <Text style={styles.securityNote}>
              Your card details are encrypted and processed securely. We never store your full card information.
            </Text>
          </View>
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
  form: {
    gap: Layouts.spacing.xl,
  },
  amountSection: {
    gap: Layouts.spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.grey[900],
    marginBottom: Layouts.spacing.sm,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[50],
    borderRadius: Layouts.borderRadius.lg,
    padding: Layouts.spacing.lg,
  },
  amountTextInput: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.grey[900],
    marginLeft: Layouts.spacing.sm,
  },
  currencyLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.grey[500],
  },
  conversionRate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[500],
  },
  paymentSection: {
    gap: Layouts.spacing.lg,
  },
  inputGroup: {
    gap: Layouts.spacing.xs,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey[700],
  },
  cardInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[50],
    borderRadius: Layouts.borderRadius.md,
    paddingHorizontal: Layouts.spacing.md,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.grey[900],
    paddingVertical: Layouts.spacing.md,
    paddingHorizontal: Layouts.spacing.md,
    backgroundColor: Colors.grey[50],
    borderRadius: Layouts.borderRadius.md,
  },
  row: {
    flexDirection: 'row',
    gap: Layouts.spacing.md,
  },
  purchaseButton: {
    backgroundColor: Colors.primary[700],
    paddingVertical: Layouts.spacing.md,
    borderRadius: Layouts.borderRadius.md,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    backgroundColor: Colors.grey[300],
  },
  purchaseButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  securityNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[500],
    textAlign: 'center',
  },
});
