import type { Order, TrackingStage } from '../types/catalog';

export const TRACKING_STAGES: { id: TrackingStage; label: string; description: string }[] = [
  { id: 'order_confirmed', label: 'Order confirmed', description: 'Your order has been received' },
  { id: 'shipment', label: 'Shipment', description: 'Packed and handed to courier' },
  { id: 'out_for_delivery', label: 'Out for delivery', description: 'Courier is on the way' },
  { id: 'delivered', label: 'Delivered', description: 'Package delivered successfully' },
];

export function trackingStageIndex(stage: TrackingStage): number {
  return TRACKING_STAGES.findIndex((s) => s.id === stage);
}

export function isStageComplete(current: TrackingStage, stage: TrackingStage): boolean {
  return trackingStageIndex(current) >= trackingStageIndex(stage);
}

/** Online paid: invoice right after payment. COD: after delivery + admin release. */
export function canDownloadInvoice(order: Order): boolean {
  const isCod = order.paymentMethod === 'COD';
  if (!isCod) {
    return order.paymentStatus === 'paid';
  }
  return order.trackingStage === 'delivered' && order.invoiceReleased;
}

export function invoiceUnavailableMessage(order: Order): string {
  if (canDownloadInvoice(order)) return '';
  if (order.paymentMethod === 'COD') {
    if (order.trackingStage !== 'delivered') {
      return 'Invoice will be available after delivery (COD).';
    }
    return 'Waiting for admin to release invoice after delivery.';
  }
  return 'Invoice available after payment is confirmed.';
}

