import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.biplabsarkar.timetracker',
  appName: 'Time Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
