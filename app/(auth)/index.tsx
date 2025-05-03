import { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Layouts from '@/constants/Layouts';
import Svg, { Path } from 'react-native-svg';
import { ZkLoginButton } from '@/components/ZkLoginButton';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const isLoggedIn = false;
      if (isLoggedIn) {
        router.replace('/(tabs)');
      }

      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(buttonFadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(buttonSlideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, [router])
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary[700], 'rgba(3, 15, 28, 0.98)']}
        style={StyleSheet.absoluteFill}
      />
      
      {Platform.select({
        web: (
          <View style={styles.webDecoration}>
            <View style={[styles.decorationCircle, styles.decorationCircle1]} />
            <View style={[styles.decorationCircle, styles.decorationCircle2]} />
            <View style={[styles.decorationCircle, styles.decorationCircle3]} />
          </View>
        ),
        default: null
      })}
      
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Svg width="80" height="102" viewBox="0 0 300 384" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M240.057 159.914C255.698 179.553 265.052 204.39 265.052 231.407C265.052 258.424 255.414 284.019 239.362 303.768L237.971 305.475L237.608 303.31C237.292 301.477 236.929 299.613 236.502 297.749C228.46 262.421 202.265 232.134 159.148 207.597C130.029 191.071 113.361 171.195 108.985 148.586C106.157 133.972 108.258 119.294 112.318 106.717C116.379 94.1569 122.414 83.6187 127.549 77.2831L144.328 56.7754C147.267 53.1731 152.781 53.1731 155.719 56.7754L240.073 159.914H240.057ZM266.584 139.422L154.155 1.96703C152.007 -0.655678 147.993 -0.655678 145.845 1.96703L33.4316 139.422L33.0683 139.881C12.3868 165.555 0 198.181 0 233.698C0 316.408 67.1635 383.461 150 383.461C232.837 383.461 300 316.408 300 233.698C300 198.181 287.613 165.555 266.932 139.896L266.568 139.438L266.584 139.422ZM60.3381 159.472L70.3866 147.164L70.6868 149.439C70.9237 151.24 71.2239 153.041 71.5715 154.858C78.0809 189.001 101.322 217.456 140.173 239.496C173.952 258.724 193.622 280.828 199.278 305.064C201.648 315.176 202.059 325.129 201.032 333.835L200.969 334.372L200.479 334.609C185.233 342.05 168.09 346.237 149.984 346.237C86.4546 346.237 34.9484 294.826 34.9484 231.391C34.9484 204.153 44.4439 179.142 60.3065 159.44L60.3381 159.472Z"
                fill="#fff"
              />
            </Svg>
          </View>
          <View style={styles.brandContainer}>
            <Text style={styles.bankText}>BANK OF</Text>
            <View style={styles.suiContainer}>
              <Text style={styles.suiText}>SUI</Text>
              <View style={styles.suiUnderline} />
            </View>
          </View>
          <Text style={styles.tagline}>The Future of Digital Banking</Text>
        </View>
      </Animated.View>

      <Animated.View 
        style={[
          styles.actionContainer,
          {
            opacity: buttonFadeAnim,
            transform: [{ translateY: buttonSlideAnim }]
          }
        ]}
      >
        <View style={styles.buttonContainer}>
          <ZkLoginButton />
          
          {/* <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.secondaryButtonText}>Already have an account?</Text>
          </TouchableOpacity> */}
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[700],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layouts.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 102,
    marginBottom: Layouts.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Layouts.spacing.xl,
  },
  bankText: {
    fontFamily: 'Inter-Regular',
    fontSize: 20,
    letterSpacing: 6,
    color: Colors.grey[300],
    marginBottom: Layouts.spacing.sm,
  },
  suiContainer: {
    alignItems: 'center',
  },
  suiText: {
    fontFamily: 'Inter-Bold',
    fontSize: 56,
    letterSpacing: 12,
    color: 'white',
  },
  suiUnderline: {
    width: 40,
    height: 3,
    backgroundColor: Colors.secondary[400],
    borderRadius: 1.5,
    marginTop: Layouts.spacing.sm,
  },
  tagline: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#C0E6FF',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  actionContainer: {
    width: '100%',
    paddingHorizontal: Layouts.spacing.xl,
    paddingBottom: Platform.select({
      web: Layouts.spacing.xxl,
      default: 40
    }),
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  secondaryButton: {
    paddingVertical: Layouts.spacing.sm,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey[300],
  },
  webDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: -1,
  },
  decorationCircle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  decorationCircle1: {
    width: 800,
    height: 800,
    top: -400,
    right: -300,
  },
  decorationCircle2: {
    width: 600,
    height: 600,
    bottom: -300,
    left: -200,
  },
  decorationCircle3: {
    width: 400,
    height: 400,
    top: '40%',
    right: -100,
  },
});