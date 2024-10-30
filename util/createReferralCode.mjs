export function createReferralCode(userName) {
    return 'HARMAIG-'+userName+"-"+ Math.random().toString(36).substring(2, 4).toUpperCase();
  }
  