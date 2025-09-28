export type CreateCheckoutPayload = {
  amount: string;
  currency?: string;
  paymentType?: string;
  merchantTransactionId: string;
  givenName: string;
  middleName: string;
  surname: string;
  customerIp?: string; 
  merchantCustomerId: string;
  base0: string;
  baseImp: string;
  iva: string;
  oneClick?: boolean;
  registrations?: string[];
};

// Tipo para suscripciones
export type CreateSubscriptionPayload = {
  email: string;
  givenName: string;
  middleName: string;
  surname: string;
  merchantCustomerId: string;
  planType: 'GYM_MONTHLY' | 'APP_MONTHLY' | 'TEST_MONTHLY';
  merchantTransactionId: string;
  customerIp?: string;
  base0: string;
  baseImp: string;
  iva: string;
};

// Pago único (planes anuales) - función original
export async function createCheckout(payload: CreateCheckoutPayload) {
  const res = await fetch('/api/payments/checkouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// Suscripción (planes mensuales) - nueva función
export async function createSubscriptionCheckout(payload: CreateSubscriptionPayload) {
  const res = await fetch('/api/payments/subscriptions/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// Completar configuración de suscripción - nueva función
export async function completeSubscription(resourcePath: string, customerId: string, planType: string) {
  const res = await fetch('/api/payments/subscriptions/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourcePath, customerId, planType }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}