import type { CustomerOrder, Order, OrderStatus, TrackingStage } from '../types/catalog';

export function statusFromTrackingStage(stage: TrackingStage): OrderStatus {
  switch (stage) {
    case 'order_confirmed':
      return 'Processing';
    case 'shipment':
    case 'out_for_delivery':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    default:
      return 'Processing';
  }
}

export function normalizeOrder(
  partial: Partial<Order> & Pick<Order, 'id' | 'customerName' | 'customerEmail' | 'items' | 'total' | 'paymentMethod' | 'createdAt'>,
): Order {
  const isCod = partial.paymentMethod === 'COD';
  const paymentStatus = partial.paymentStatus ?? (isCod ? 'pending' : 'paid');
  const trackingStage = partial.trackingStage ?? 'order_confirmed';
  return {
    ...partial,
    customerId: partial.customerId ?? `cust-${partial.customerEmail}`,
    discount: partial.discount ?? 0,
    deliveryFee: partial.deliveryFee ?? 0,
    status: partial.status ?? statusFromTrackingStage(trackingStage),
    paymentStatus,
    trackingStage,
    invoiceReleased:
      partial.invoiceReleased ??
      (!isCod && paymentStatus === 'paid'),
  };
}

export function migrateLegacyOrder(raw: Partial<Order> & CustomerOrder): Order {
  let trackingStage: TrackingStage = raw.trackingStage ?? 'order_confirmed';
  if (!raw.trackingStage) {
    if (raw.status === 'Delivered') trackingStage = 'delivered';
    else if (raw.status === 'Shipped') trackingStage = 'shipment';
  }
  const isCod = raw.paymentMethod === 'COD';
  return normalizeOrder({
    ...raw,
    trackingStage,
    paymentStatus: raw.paymentStatus ?? (isCod ? 'pending' : 'paid'),
    invoiceReleased:
      raw.invoiceReleased ??
      ((trackingStage === 'delivered' && isCod) || (!isCod && (raw.paymentStatus ?? 'paid') === 'paid')),
  });
}

