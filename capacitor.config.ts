import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'KeyTock',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      showSpinner: true,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      backgroundColor: "#ffffff",
      splashImmersive: false,
      splashShowOnlyFirstTime: false,
      splashAutoHide: true,
      iosSplash: {
        backgroundColor: "#ffffff",
        resizeMode: "cover",
        url: "splash.png"
      },
      androidSplash: {
        backgroundColor: "#ffffff",
        resizeMode: "cover",
        url: "splash.png"
      }
    }
  }
};

export default config;
