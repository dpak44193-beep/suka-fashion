import type { Order } from '../types/catalog';
import type { StoreSettings } from '../types/catalog';

function formatAddress(order: Order): string {
  const a = order.shippingAddress;
  if (!a) return '—';
  const parts = [a.line, a.city, a.pin].filter(Boolean);
  return parts.join(', ');
}

export function buildInvoiceHtml(order: Order, settings: StoreSettings): string {
  const rows = order.items
    .map(
      (it) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${it.name}${it.size ? ` · ${it.size}` : ''}${it.color ? ` · ${it.color}` : ''}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${it.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${it.price.toLocaleString('en-IN')}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${(it.price * it.qty).toLocaleString('en-IN')}</td>
        </tr>`,
    )
    .join('');

  const subtotal = order.subtotal ?? order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = order.discount ?? 0;
  const delivery = order.deliveryFee ?? 0;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${order.id}</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #1a1a1a; max-width: 800px; margin: 24px auto; padding: 24px; }
    h1 { color: #5a8f7a; margin: 0 0 8px; }
    .meta { background: #f5f5f0; padding: 16px; border-radius: 12px; margin-bottom: 24px; }
    .meta p { margin: 4px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { text-align: left; padding: 8px; border-bottom: 2px solid #5a8f7a; font-size: 13px; }
    .totals { margin-top: 16px; text-align: right; font-size: 14px; }
    .totals .grand { font-size: 20px; font-weight: bold; color: #5a8f7a; }
  </style>
</head>
<body>
  <h1>${settings.storeName}</h1>
  <p style="color:#666;margin:0 0 24px">Tax Invoice / Bill</p>

  <div class="meta">
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
    <p><strong>Customer:</strong> ${order.customerName}</p>
    <p><strong>Email:</strong> ${order.customerEmail}</p>
    ${order.customerPhone ? `<p><strong>Phone:</strong> ${order.customerPhone}</p>` : ''}
    <p><strong>Shipping address:</strong> ${formatAddress(order)}</p>
    <p><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus === 'paid' ? 'Paid' : 'Pending'})</p>
    ${order.trackingNumber ? `<p><strong>Tracking:</strong> ${order.courier ?? ''} ${order.trackingNumber}</p>` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Rate</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <p>Subtotal: ₹${subtotal.toLocaleString('en-IN')}</p>
    ${discount > 0 ? `<p>Discount: -₹${discount.toLocaleString('en-IN')}</p>` : ''}
    <p>Delivery: ₹${delivery.toLocaleString('en-IN')}</p>
    <p class="grand">Total: ₹${order.total.toLocaleString('en-IN')}</p>
  </div>

  <p style="margin-top:32px;font-size:12px;color:#888">${settings.contactEmail} · ${settings.contactPhone}</p>
  <p style="font-size:11px;color:#aaa">GST @ ${settings.gstRate}% included where applicable.</p>
</body>
</html>`;
}

export function downloadInvoice(order: Order, settings: StoreSettings): void {
  const html = buildInvoiceHtml(order, settings);
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}

