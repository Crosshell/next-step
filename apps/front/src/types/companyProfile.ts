type CompanyProfileData = {
  id: string;
  name: string;
  description: string;
  url: string;
  logoUrl: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type MainInfoData = {
  name: string;
  url: string;
};

type UpdCompanyProfileData = {
  name?: string;
  description?: string;
  url?: string;
  logoUrl?: string;
};

export {
  type CompanyProfileData,
  type MainInfoData,
  type UpdCompanyProfileData,
};
