import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import { ChevronRight, User, Shield, LogOut, Copy, Star, Plus, X, Search, Bell, Wallet, Users } from 'lucide-react-native';
import { Contact } from '@/types/Contact';
import { CONTACTS } from '@/data/contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function ProfileScreen() {
  const router = useRouter();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showContactsSheet, setShowContactsSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [newContact, setNewContact] = useState({ name: '', walletAddress: '' });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAddress = async () => {
      const address = await getData('zkLoginAddress');
      setWalletAddress(address);
    };
    loadAddress();
  }, []);

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteContacts = filteredContacts.filter(contact => contact.isFavorite);
  const otherContacts = filteredContacts.filter(contact => !contact.isFavorite);
  
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const copyToClipboard = (text: string) => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(text);
    }
    alert('Address copied to clipboard!');
  };

  const toggleFavorite = (contactId: string) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    ));
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.walletAddress) return;

    const newId = (contacts.length + 1).toString();
    setContacts([...contacts, {
      id: newId,
      name: newContact.name,
      walletAddress: newContact.walletAddress,
      isFavorite: false,
    }]);

    setNewContact({ name: '', walletAddress: '' });
    setShowContactModal(false);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.grey[900]} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={32} color={Colors.grey[400]} />
            </View>
          </View>
          
          <Text style={styles.username}>MX</Text>
          
          {walletAddress && (
            <TouchableOpacity 
              style={styles.walletContainer}
              onPress={() => copyToClipboard(walletAddress)}
            >
              <Wallet size={16} color={Colors.primary[700]} />
              <Text style={styles.walletAddress}>
                {formatWalletAddress(walletAddress)}
              </Text>
              <Copy size={16} color={Colors.primary[700]} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowContactsSheet(true)}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: Colors.primary[50] }]}>
                <Users size={20} color={Colors.primary[700]} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Contacts</Text>
                <Text style={styles.menuSubtitle}>
                  {contacts.length} contacts, {favoriteContacts.length} favorites
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.grey[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: Colors.primary[50] }]}>
                <User size={20} color={Colors.primary[700]} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Account Settings</Text>
                <Text style={styles.menuSubtitle}>Profile, preferences</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.grey[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: Colors.success.light }]}>
                <Shield size={20} color={Colors.success.main} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Security</Text>
                <Text style={styles.menuSubtitle}>PIN, biometrics</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.grey[400]} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/(auth)')}
        >
          <LogOut size={20} color={Colors.error.main} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* Contacts Bottom Sheet */}
      <Modal
        visible={showContactsSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowContactsSheet(false)}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Contacts</Text>
              <View style={styles.sheetActions}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    setShowContactsSheet(false);
                    setShowContactModal(true);
                  }}
                >
                  <Plus size={20} color={Colors.primary[700]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowContactsSheet(false)}
                >
                  <X size={24} color={Colors.grey[500]} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color={Colors.grey[500]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search contacts"
                placeholderTextColor={Colors.grey[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView style={styles.contactsList}>
              {favoriteContacts.length > 0 && (
                <View style={styles.contactsSection}>
                  <Text style={styles.sectionTitle}>Favorites</Text>
                  {favoriteContacts.map(contact => (
                    <View key={contact.id} style={styles.contactItem}>
                      <View style={styles.contactInfo}>
                        <View style={styles.contactAvatar}>
                          <User size={20} color={Colors.grey[400]} />
                        </View>
                        <View>
                          <Text style={styles.contactName}>{contact.name}</Text>
                          <Text style={styles.contactAddress}>
                            {formatWalletAddress(contact.walletAddress)}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => toggleFavorite(contact.id)}
                        style={styles.favoriteButton}
                      >
                        <Star
                          size={20}
                          color={Colors.primary[700]}
                          fill={Colors.primary[700]}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {otherContacts.length > 0 && (
                <View style={styles.contactsSection}>
                  <Text style={styles.sectionTitle}>All Contacts</Text>
                  {otherContacts.map(contact => (
                    <View key={contact.id} style={styles.contactItem}>
                      <View style={styles.contactInfo}>
                        <View style={styles.contactAvatar}>
                          <User size={20} color={Colors.grey[400]} />
                        </View>
                        <View>
                          <Text style={styles.contactName}>{contact.name}</Text>
                          <Text style={styles.contactAddress}>
                            {formatWalletAddress(contact.walletAddress)}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => toggleFavorite(contact.id)}
                        style={styles.favoriteButton}
                      >
                        <Star
                          size={20}
                          color={Colors.grey[400]}
                          fill="none"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        visible={showContactModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Contact</Text>
              <TouchableOpacity
                onPress={() => setShowContactModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={Colors.grey[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter contact name"
                  placeholderTextColor={Colors.grey[400]}
                  value={newContact.name}
                  onChangeText={name => setNewContact({ ...newContact, name })}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Wallet Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter wallet address"
                  placeholderTextColor={Colors.grey[400]}
                  value={newContact.walletAddress}
                  onChangeText={walletAddress => setNewContact({ ...newContact, walletAddress })}
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.addContactButton,
                  (!newContact.name || !newContact.walletAddress) && styles.addContactButtonDisabled
                ]}
                onPress={handleAddContact}
                disabled={!newContact.name || !newContact.walletAddress}
              >
                <Text style={styles.addContactButtonText}>Add Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    paddingTop: Platform.select({ web: 40, default: 60 }),
    paddingBottom: Layouts.spacing.lg,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layouts.spacing.xl,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.grey[900],
  },
  notificationButton: {
    padding: Layouts.spacing.sm,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error.main,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Layouts.spacing.xl,
    backgroundColor: 'white',
  },
  avatarContainer: {
    marginBottom: Layouts.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.grey[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.grey[900],
    marginBottom: Layouts.spacing.sm,
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
    paddingVertical: Layouts.spacing.xs,
    paddingHorizontal: Layouts.spacing.md,
    borderRadius: Layouts.borderRadius.full,
    gap: Layouts.spacing.sm,
  },
  walletAddress: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey[700],
  },
  menuSection: {
    backgroundColor: 'white',
    marginTop: Layouts.spacing.md,
    padding: Layouts.spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layouts.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layouts.spacing.md,
  },
  menuTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.grey[900],
  },
  menuSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[500],
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Layouts.spacing.xl,
    marginTop: Layouts.spacing.xl,
    paddingVertical: Layouts.spacing.lg,
    backgroundColor: Colors.error.light,
    borderRadius: Layouts.borderRadius.lg,
  },
  logoutIcon: {
    marginRight: Layouts.spacing.sm,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.error.main,
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[500],
    textAlign: 'center',
    marginTop: Layouts.spacing.xl,
    marginBottom: 100,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layouts.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  sheetTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.grey[900],
  },
  sheetActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layouts.spacing.md,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: Layouts.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
    margin: Layouts.spacing.xl,
    borderRadius: Layouts.borderRadius.lg,
    paddingHorizontal: Layouts.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.grey[900],
    paddingVertical: Layouts.spacing.md,
    marginLeft: Layouts.spacing.sm,
  },
  contactsList: {
    paddingHorizontal: Layouts.spacing.xl,
  },
  contactsSection: {
    marginBottom: Layouts.spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.grey[700],
    marginBottom: Layouts.spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layouts.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grey[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layouts.spacing.md,
  },
  contactName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.grey[900],
    marginBottom: 2,
  },
  contactAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[500],
  },
  favoriteButton: {
    padding: Layouts.spacing.sm,
  },
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
  modalCloseButton: {
    padding: Layouts.spacing.xs,
  },
  modalForm: {
    gap: Layouts.spacing.lg,
  },
  formField: {
    gap: Layouts.spacing.xs,
  },
  fieldLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey[700],
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.grey[900],
    borderWidth: 1,
    borderColor: Colors.grey[200],
    borderRadius: Layouts.borderRadius.md,
    paddingHorizontal: Layouts.spacing.md,
    paddingVertical: Layouts.spacing.md,
  },
  addContactButton: {
    backgroundColor: Colors.primary[700],
    paddingVertical: Layouts.spacing.md,
    borderRadius: Layouts.borderRadius.md,
    alignItems: 'center',
    marginTop: Layouts.spacing.md,
  },
  addContactButtonDisabled: {
    backgroundColor: Colors.grey[300],
  },
  addContactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});