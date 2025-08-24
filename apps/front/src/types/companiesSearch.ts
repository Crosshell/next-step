export type CompanyItemData = {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  createdAt: string;
};

export type CompaniesSearchForm = {
  name?: string;
  page?: number;
};

export type CompanyData = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  url: string;
  logoUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};
