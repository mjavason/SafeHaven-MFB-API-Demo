type AccountNameEnquiry = {
  responseCode: string;
  responseMessage: string;
  sessionId: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  kycLevel: string;
  bvn: string;
};

export type AccountNameEnquiryResponseType = {
  statusCode: boolean;
  message: string;
  data: AccountNameEnquiry;
};
