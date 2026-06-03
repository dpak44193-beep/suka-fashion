import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { markAllNotificationsRead, markNotificationRead } from '../store/slices/catalogSlice';
import { Button } from '../components/common/Button';

export const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((s: RootState) => s.catalog.notifications);

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h1>
          <Button size="sm" variant="outline" onClick={() => dispatch(markAllNotificationsRead())}>Mark all read</Button>
        </div>
        <div className="space-y-3">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => dispatch(markNotificationRead(n.id))}
              className={`w-full text-left bg-white rounded-2xl p-4 border ${n.read ? 'opacity-60' : 'border-[var(--primary)]'}`}
            >
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-gray-600 mt-1">{n.body}</p>
              <p className="text-xs text-gray-400 mt-2">{n.createdAt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

