// navigation/types.ts
export type RootStackParamList = {
    Auth: { screen?: keyof AuthStackParamList } | undefined;
    Register: undefined;
    Main: undefined;
  };
  
  export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
  };
  
  export type MainStackParamList = {
    Dashboard: undefined;
    OfferDetails: { offerId: string };
    Profile: undefined;
    Campaigns: undefined;
    CampaignDetails: { campaignId: string };
  };
  
  export type RegisterStackParamList = {
    Step1: undefined;
    Step2: undefined;
    Step3: undefined;
    Step4: undefined;
  };