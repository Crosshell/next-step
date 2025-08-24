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
