export const companyDetails = {
  name: import.meta.env.VITE_COMPANY_NAME || "Jagganath Motors",
  gstin: import.meta.env.VITE_COMPANY_GSTIN || "GSTIN not configured",
  address:
    import.meta.env.VITE_COMPANY_ADDRESS ||
    "Company address not configured",
  phone: import.meta.env.VITE_COMPANY_PHONE || "",
  email: import.meta.env.VITE_COMPANY_EMAIL || "",
};
