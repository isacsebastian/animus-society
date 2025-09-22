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

export async function createCheckout(payload: CreateCheckoutPayload) {
  const res = await fetch('/api/payments/checkouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}