interface Plan {
  id: string;
  price: string;
  name: string;
  description: string;
  title: string;
  subtitle: string;
  period: string;
  isPopular: boolean;
  showCents: boolean;
}

type PlanCategory = 'gym' | 'app' | 'test';

export const plans: Record<PlanCategory, Plan[]> = {
  gym: [
    {
      id: "gym-monthly",
      price: "77.00",
      name: "Animus Flow - Plan Mensual",
      description: "Plan mensual gimnasio",
      title: "Animus Flow",
      subtitle: "Plan mensual recurrente",
      period: "mes",
      isPopular: false,
      showCents: false
    },
    {
      id: "gym-yearly",
      price: "799.00",
      name: "Animus Legacy - Plan Anual",
      description: "Plan anual gimnasio",
      title: "Animus Legacy",
      subtitle: "Plan anual completo",
      period: "año",
      isPopular: true,
      showCents: false
    }
  ],
  app: [
    {
      id: "app-monthly",
      price: "19.99",
      name: "Animus Flow Online - Plan Mensual",
      description: "Plan mensual online",
      title: "Animus Flow Online",
      subtitle: "Plan mensual sin compromiso",
      period: "mes",
      isPopular: false,
      showCents: true
    },
    {
      id: "app-yearly",
      price: "199.00",
      name: "Animus Legacy Online - Plan Anual",
      description: "Plan anual online",
      title: "Animus Legacy Online",
      subtitle: "Plan anual completo",
      period: "año",
      isPopular: true,
      showCents: false
    }
  ],
  test: [
    {
      id: "test-monthly",
      price: "1.00",
      name: "Prueba Suscripción Mensual",
      description: "Prueba de pago recurrente automático",
      title: "Prueba Suscripción",
      subtitle: "Test de pago recurrente automático",
      period: "mes",
      isPopular: false,
      showCents: false
    },
    {
      id: "test-yearly",
      price: "1.00",
      name: "Prueba Pago Único",
      description: "Prueba de pago único tradicional",
      title: "Prueba Pago Único",
      subtitle: "Test de pago único tradicional",
      period: "único",
      isPopular: false,
      showCents: false
    }
  ]
};