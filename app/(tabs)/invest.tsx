import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import { TrendingUp, TrendingDown, Info, ChevronRight } from 'lucide-react-native';

const INVESTMENT_OPPORTUNITIES = [
  {
    id: '1',
    name: 'USDC Lending',
    description: 'Earn interest by lending your USDC',
    apy: 4.39,
    protocol: 'suilend',
    minAmount: 100,
  },
  // {
  //   id: '2',
  //   name: 'Liquidity Pool',
  //   description: 'Provide liquidity and earn trading fees',
  //   apy: 12.8,
  //   risk: 'Medium',
  //   minAmount: 500,
  // },
  // {
  //   id: '3',
  //   name: 'Staking',
  //   description: 'Stake USDC and earn rewards',
  //   apy: 8.2,
  //   risk: 'Low',
  //   minAmount: 250,
  // },
];

const PORTFOLIO_STATS = {
  totalInvested: 2500,
  totalEarned: 187.45,
  activeInvestments: 2,
};

export default function InvestScreen() {
  const [selectedTab, setSelectedTab] = useState<'opportunities' | 'portfolio'>('opportunities');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary[700], Colors.primary[900]]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Invest</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'opportunities' && styles.activeTab]}
            onPress={() => setSelectedTab('opportunities')}
          >
            <Text style={[styles.tabText, selectedTab === 'opportunities' && styles.activeTabText]}>
              Opportunities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'portfolio' && styles.activeTab]}
            onPress={() => setSelectedTab('portfolio')}
          >
            <Text style={[styles.tabText, selectedTab === 'portfolio' && styles.activeTabText]}>
              Portfolio
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === 'opportunities' ? (
          <>
            <Text style={styles.sectionTitle}>Featured Opportunities</Text>
            {INVESTMENT_OPPORTUNITIES.map((opportunity) => (
              <TouchableOpacity key={opportunity.id} style={styles.opportunityCard}>
                <View style={styles.opportunityHeader}>
                  <Text style={styles.opportunityName}>{opportunity.name}</Text>
                  <View style={[
                    styles.riskBadge,
                    { backgroundColor: opportunity.protocol === 'suilend' ? Colors.success.light : Colors.warning.light }
                  ]}>
                    <Text style={[
                      styles.riskText,
                      { color: opportunity.protocol === 'scallop' ? Colors.success.main : Colors.warning.main }
                    ]}>
                      {opportunity.protocol}
                    </Text>
                  </View>
                </View>

                <Text style={styles.opportunityDescription}>{opportunity.description}</Text>

                <View style={styles.opportunityStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>APY</Text>
                    <Text style={styles.statValue}>{opportunity.apy}%</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Min. Amount</Text>
                    <Text style={styles.statValue}>${opportunity.minAmount}</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.grey[400]} />
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <View style={styles.portfolioStats}>
              <View style={styles.portfolioStatCard}>
                <Text style={styles.portfolioStatLabel}>Total Invested</Text>
                <Text style={styles.portfolioStatValue}>
                  ${PORTFOLIO_STATS.totalInvested.toLocaleString()}
                </Text>
              </View>
              <View style={styles.portfolioStatCard}>
                <Text style={styles.portfolioStatLabel}>Total Earned</Text>
                <View style={styles.earnedContainer}>
                  <TrendingUp size={16} color={Colors.success.main} />
                  <Text style={[styles.portfolioStatValue, styles.earnedValue]}>
                    ${PORTFOLIO_STATS.totalEarned.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Info size={20} color={Colors.primary[700]} />
              <Text style={styles.infoText}>
                You have {PORTFOLIO_STATS.activeInvestments} active investments
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Your Investments</Text>
            {/* Add active investments list here */}
          </>
        )}
      </ScrollView>
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
    paddingHorizontal: Layouts.spacing.xl,
    paddingBottom: Layouts.spacing.xl,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
    marginBottom: Layouts.spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layouts.borderRadius.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Layouts.spacing.sm,
    alignItems: 'center',
    borderRadius: Layouts.borderRadius.full,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey[300],
  },
  activeTabText: {
    color: Colors.primary[700],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Layouts.spacing.xl,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.grey[900],
    marginBottom: Layouts.spacing.lg,
  },
  opportunityCard: {
    backgroundColor: 'white',
    borderRadius: Layouts.borderRadius.lg,
    padding: Layouts.spacing.lg,
    marginBottom: Layouts.spacing.lg,
    shadowColor: Colors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layouts.spacing.sm,
  },
  opportunityName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.grey[900],
  },
  riskBadge: {
    paddingHorizontal: Layouts.spacing.sm,
    paddingVertical: 4,
    borderRadius: Layouts.borderRadius.full,
  },
  riskText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  opportunityDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[600],
    marginBottom: Layouts.spacing.lg,
  },
  opportunityStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.grey[500],
    marginBottom: 2,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.grey[900],
  },
  portfolioStats: {
    flexDirection: 'row',
    gap: Layouts.spacing.md,
    marginBottom: Layouts.spacing.lg,
  },
  portfolioStatCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: Layouts.borderRadius.lg,
    padding: Layouts.spacing.lg,
    shadowColor: Colors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  portfolioStatLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[600],
    marginBottom: Layouts.spacing.xs,
  },
  portfolioStatValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.grey[900],
  },
  earnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layouts.spacing.xs,
  },
  earnedValue: {
    color: Colors.success.main,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderRadius: Layouts.borderRadius.lg,
    padding: Layouts.spacing.lg,
    marginBottom: Layouts.spacing.xl,
    gap: Layouts.spacing.sm,
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
    flex: 1,
  },
});