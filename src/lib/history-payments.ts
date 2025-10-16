export interface PaymentHistoryItem {
  id: string;
  customerName: string;
  customerIdentification: string;
  paymentType: 'ONE_TIME' | 'RECURRING' | 'INITIAL';
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  merchantTransactionId: string;
}

export interface PaymentHistoryResponse {
  data: PaymentHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaymentStats {
  totalRevenue: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
}

export interface PaymentDetail {
  id: string;
  customer: {
    id: string;
    merchantCustomerId: string;
    email: string;
    givenName: string;
    middleName: string;
    surname: string;
    identificationDocType: string;
    identificationDocId: string;
    phone: string;
    street1: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  payment: {
    merchantTransactionId: string;
    paymentType: string;
    amount: number;
    currency: string;
    base0: number;
    baseImp: number;
    iva: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  gateway: {
    resultCode: string;
    resultDescription: string | null;
    resourcePath: string | null;
    gatewayResponse: any;
  };
  subscription?: {
    id: string;
    planType: string;
    status: string;
    nextBillingDate: string;
  };
  token?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

export async function getPaymentHistory(
  page: number = 1,
  pageSize: number = 10,
  status?: string,
  paymentType?: string,
  search?: string
): Promise<PaymentHistoryResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (status && status !== 'todos') {
    params.append('status', status.toUpperCase());
  }

  if (paymentType && paymentType !== 'todos') {
    params.append('paymentType', paymentType.toUpperCase());
  }

  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`/api/history-payments?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener el historial de pagos');
  }

  return response.json();
}

export async function getPaymentStats(): Promise<PaymentStats> {
  const response = await fetch('/api/history-payments/stats');
  
  if (!response.ok) {
    throw new Error('Error al obtener las estadísticas');
  }

  return response.json();
}

export async function getPaymentDetail(paymentId: string): Promise<PaymentDetail> {
  const response = await fetch(`/api/history-payments/${paymentId}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener el detalle del pago');
  }

  return response.json();
}

export async function cancelSubscription(subscriptionId: string): Promise<{ message: string }> {
  const response = await fetch(`/api/payments/subscriptions/${subscriptionId}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al cancelar la suscripción');
  }

  return response.json();
}
