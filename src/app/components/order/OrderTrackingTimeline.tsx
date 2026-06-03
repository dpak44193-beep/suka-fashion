import React from 'react';
import { Check, Circle } from 'lucide-react';
import type { Order } from '../../types/catalog';
import { TRACKING_STAGES, isStageComplete } from '../../lib/orderTracking';

interface OrderTrackingTimelineProps {
  order: Order;
  compact?: boolean;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ order, compact }) => {
  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {order.estimatedDelivery && (
        <p className="text-sm text-[var(--primary-dark)] font-medium">
          Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
        </p>
      )}
      <ul className="space-y-0">
        {TRACKING_STAGES.map((stage, index) => {
          const done = isStageComplete(order.trackingStage, stage.id);
          const current = order.trackingStage === stage.id;
          return (
            <li key={stage.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    done ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-gray-200 text-gray-400'
                  } ${current ? 'ring-2 ring-[var(--primary)] ring-offset-2' : ''}`}
                >
                  {done ? <Check className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                </div>
                {index < TRACKING_STAGES.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${done ? 'bg-[var(--primary)]' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="pb-6">
                <p className={`font-semibold text-sm ${done ? 'text-gray-900' : 'text-gray-400'}`}>{stage.label}</p>
                {!compact && (
                  <p className="text-xs text-gray-500 mt-0.5">{stage.description}</p>
                )}
                {stage.id === 'shipment' && order.trackingNumber && done && (
                  <p className="text-xs text-gray-600 mt-1">
                    {order.courier}: {order.trackingNumber}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

