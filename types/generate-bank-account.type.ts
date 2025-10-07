enum AccountType {
  Savings = 'Savings',
  Current = 'Current',
  FixedDeposit = 'FixedDeposit',
}

enum AccountStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Dormant = 'Dormant',
}

enum InterestCompoundingPeriod {
  Daily = 'Daily',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly',
}

enum InterestPostingPeriod {
  Daily = 'Daily',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly',
}

enum InterestCalculationType {
  DailyBalance = 'DailyBalance',
  AverageDailyBalance = 'AverageDailyBalance',
}

enum InterestCalculationDaysInYearType {
  Days365 = '365',
  Days360 = '360',
}

enum LockinPeriodFrequencyType {
  Days = 'Days',
  Months = 'Months',
  Years = 'Years',
}

type NotificationSettings = {
  smsNotification: boolean;
  emailNotification: boolean;
  emailMonthlyStatement: boolean;
  smsMonthlyStatement: boolean;
};

type AccountData = {
  canDebit: boolean;
  canCredit: boolean;
  _id: string;
  client: string;
  accountProduct: string;
  accountNumber: string;
  accountName: string;
  accountType: AccountType;
  currencyCode: string;
  bvn: string;
  accountBalance: number;
  bookBalance: number;
  interestBalance: number;
  withHoldingTaxBalance: number;
  status: AccountStatus;
  isDefault: boolean;
  nominalAnnualInterestRate: number;
  interestCompoundingPeriod: InterestCompoundingPeriod;
  interestPostingPeriod: InterestPostingPeriod;
  interestCalculationType: InterestCalculationType;
  interestCalculationDaysInYearType: InterestCalculationDaysInYearType;
  minRequiredOpeningBalance: number;
  lockinPeriodFrequency: number;
  lockinPeriodFrequencyType: LockinPeriodFrequencyType;
  allowOverdraft: boolean;
  overdraftLimit: number;
  chargeWithHoldingTax: boolean;
  chargeValueAddedTax: boolean;
  chargeStampDuty: boolean;
  notificationSettings: NotificationSettings;
  isSubAccount: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  cbaAccountId: string;
};

export type GenerateBankAccountResultType = {
  statusCode: boolean;
  message: string;
  data: AccountData;
};
