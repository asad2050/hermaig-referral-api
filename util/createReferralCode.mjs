// export function createReferralCode(userName) {
//     return 'HARMAIG-'+userName+"-"+ Math.random().toString(36).substring(2, 4).toUpperCase();
//   }
export function createReferralCode(userName) {
  // Replace spaces with hyphens and preserve underscores; remove other non-alphanumeric characters
  const sanitizedUserName = userName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
  
  return 'HARMAIG-' + sanitizedUserName + '-' + Math.random().toString(36).substring(2, 4).toUpperCase();
}