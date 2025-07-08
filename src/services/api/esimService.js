// Mock eSIM Service for development without real API
export const esimService = {
  // Mock packages
  getMockPackages: () => {
    return {
      success: true,
      data: [
        {
          id: "1",
          country: "Türkiye",
          countryCode: "TR",
          countryFlag: "🇹🇷",
          name: "Türkiye 30 Gün",
          dataAmount: 5120, // MB
          duration: 30, // gün
          price: 29.99,
          currency: "USD",
          coverage: "Türkiye Geneli",
          speed: "4G/5G",
          hotspotAllowed: true,
          smsIncluded: false,
          provider: "Turkcell",
        },
        {
          id: "2",
          country: "Almanya",
          countryCode: "DE",
          countryFlag: "🇩🇪",
          name: "Almanya 15 Gün",
          dataAmount: 3072, // MB
          duration: 15,
          price: 19.99,
          currency: "USD",
          coverage: "Almanya Geneli",
          speed: "4G/5G",
          hotspotAllowed: true,
          smsIncluded: false,
          provider: "Deutsche Telekom",
        },
        {
          id: "3",
          country: "Amerika",
          countryCode: "US",
          countryFlag: "🇺🇸",
          name: "Amerika 30 Gün",
          dataAmount: 10240, // MB
          duration: 30,
          price: 49.99,
          currency: "USD",
          coverage: "ABD Geneli",
          speed: "4G/5G",
          hotspotAllowed: true,
          smsIncluded: true,
          provider: "Verizon",
        },
        {
          id: "4",
          country: "İngiltere",
          countryCode: "GB",
          countryFlag: "🇬🇧",
          name: "İngiltere 15 Gün",
          dataAmount: 2048,
          duration: 15,
          price: 24.99,
          currency: "USD",
          coverage: "İngiltere Geneli",
          speed: "4G/5G",
          hotspotAllowed: true,
          smsIncluded: false,
          provider: "EE",
        },
        {
          id: "5",
          country: "Fransa",
          countryCode: "FR",
          countryFlag: "🇫🇷",
          name: "Fransa 30 Gün",
          dataAmount: 6144,
          duration: 30,
          price: 34.99,
          currency: "USD",
          coverage: "Fransa Geneli",
          speed: "4G/5G",
          hotspotAllowed: true,
          smsIncluded: false,
          provider: "Orange",
        }
      ],
    };
  },

  // Mock eSIMs
  getMockESIMs: () => {
    return {
      success: true,
      data: [
        {
          iccid: "89014103211118510720",
          country: "Türkiye",
          countryFlag: "🇹🇷",
          packageName: "Türkiye 30 Gün",
          provider: "Turkcell",
          status: "active",
          dataLimit: 5120,
          dataUsed: 2048,
          expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
        {
          iccid: "89014103211118510721",
          country: "Almanya",
          countryFlag: "🇩🇪",
          packageName: "Almanya 15 Gün",
          provider: "Deutsche Telekom",
          status: "expired",
          dataLimit: 3072,
          dataUsed: 3000,
          expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          purchaseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        },
      ],
    };
  },

  // Mock API calls
  getPackages: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return esimService.getMockPackages();
  },

  getPackageDetails: async (packageId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const packages = esimService.getMockPackages().data;
    const packageDetails = packages.find(p => p.id === packageId);
    
    if (packageDetails) {
      return { success: true, data: packageDetails };
    } else {
      return { success: false, error: "Paket bulunamadı" };
    }
  },

  getESIMs: async (status = null) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    let esims = esimService.getMockESIMs().data;
    
    if (status) {
      esims = esims.filter(esim => esim.status === status);
    }
    
    return { success: true, data: esims };
  },

  createOrder: async (packageId) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const packages = esimService.getMockPackages().data;
    const packageDetails = packages.find(p => p.id === packageId);
    
    if (!packageDetails) {
      return { success: false, error: "Paket bulunamadı" };
    }

    const mockESIM = {
      iccid: "89014103211118510" + Math.floor(Math.random() * 1000),
      orderId: "order_" + Date.now(),
      status: "active",
      qrCode: "LPA:1$smdp.example.com$activation_code_123",
      smdpAddress: "smdp.example.com",
      activationCode: "activation_code_123",
      packageId,
      country: packageDetails.country,
      countryFlag: packageDetails.countryFlag,
      packageName: packageDetails.name,
      provider: packageDetails.provider,
      dataLimit: packageDetails.dataAmount,
      dataUsed: 0,
      expiryDate: new Date(Date.now() + packageDetails.duration * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(),
    };

    return { success: true, data: mockESIM };
  }
};

// Compatibility exports
export const getMockPackages = esimService.getMockPackages;
export const getMockESIMs = esimService.getMockESIMs;