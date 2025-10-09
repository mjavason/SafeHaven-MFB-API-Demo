export type CheckoutPaymentWebhook = {
  type: 'checkout.payment';
  data: {
    channels: string[];
    _id: string;
    client: string;
    merchantName: string;
    oauthClientId: string;
    referenceCode: string;
    customer: {
      firstName: string;
      lastName: string;
      emailAddress: string;
      phoneNumber: string;
    };
    currencyCode: string;
    amount: number;
    feeBearer: string;
    fees: number;
    vat: number;
    stampDuty: number;
    customIconUrl: string;
    redirectUrl: string;
    webhookUrl: string;
    settlementAccount: {
      bankCode: string;
      accountNumber: string;
    };
    settlementStatus: string;
    settlementReference: string;
    channelDetails: {
      type: string;
      providerReference: string;
      bankCode: string;
      accountNumber: string;
      accountName: string;
      expiryDate: string;
    };
    paymentDetails: {
      type: string;
      sessionId: string;
      paymentReference: string;
      senderBankCode: string;
      senderAccountNumber: string;
      senderAccountName: string;
    };
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
};
