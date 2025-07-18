// @ts-ignore: TypeScript module declaration for @env is provided in a .d.ts file
import { REVENUECAT_PUBLIC_API_KEY } from '@env';
import Purchases, { PurchasesPackage, CustomerInfo, PurchasesOffering } from 'react-native-purchases';

interface SubscriptionResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}

export class RevenueCatService {
  private static initialized = false;

  static async initialize(userId: string): Promise<void> {
    if (this.initialized) return;

    try {
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      await Purchases.configure({ apiKey: REVENUECAT_PUBLIC_API_KEY });
      await Purchases.logIn(userId);
      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  static async getOfferings(): Promise<PurchasesOffering[]> {
    try {
      const offerings = await Purchases.getOfferings();
      return Object.values(offerings.all);
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  }

  static async purchaseSubscription(packageToPurchase: PurchasesPackage): Promise<SubscriptionResult> {
    try {
      console.log('Attempting to purchase package:', packageToPurchase.identifier);
      
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      console.log('Purchase successful:', customerInfo);
      
      return {
        success: true,
        customerInfo
      };
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      if (error.userCancelled) {
        return {
          success: false,
          error: 'Purchase was cancelled by user'
        };
      }
      
      return {
        success: false,
        error: error.message || 'Purchase failed'
      };
    }
  }

  static async restorePurchases(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  static async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  static async logOut(): Promise<void> {
    try {
      await Purchases.logOut();
      this.initialized = false;
    } catch (error) {
      console.error('Failed to log out from RevenueCat:', error);
    }
  }

  static isActiveSubscriber(customerInfo: CustomerInfo): boolean {
    return (
      typeof customerInfo.entitlements.active !== 'undefined' &&
      Object.keys(customerInfo.entitlements.active).length > 0
    );
  }
}

export default RevenueCatService; 