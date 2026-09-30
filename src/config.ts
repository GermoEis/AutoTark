// AutoTark configuration - central settings for company info and features
export interface AppConfig {
  appName: string;
  appDomain: string;
  contactEmail: string | null;
  features: {
    analytics: boolean;
    cookieConsent: boolean;
  };
}

export const appConfig: AppConfig = {
  appName: 'AutoTark',
  appDomain: 'autovaata.ee',
  contactEmail: null, // Set to actual email when available
  features: {
    analytics: false, // Set to true to enable optional analytics
    cookieConsent: true,
  },
};
