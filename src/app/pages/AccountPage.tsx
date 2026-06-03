import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getRoleLabel } from '../lib/auth';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

export const AccountPage: React.FC = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const [profile, setProfile] = useState({ name: user?.name ?? '', phone: '+91 98765 43210' });
  const [referral] = useState('SUKA-REF-2026');

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>My Account</h1>

        <section className="bg-white rounded-2xl p-6 border mb-6 space-y-3">
          <h2 className="font-bold">Profile</h2>
          <input className="w-full border rounded-xl px-3 py-2" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <input className="w-full border rounded-xl px-3 py-2" value={user?.email ?? ''} disabled />
          <input className="w-full border rounded-xl px-3 py-2" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <span className="inline-block text-xs px-2 py-1 rounded bg-[var(--primary-light)]">{user?.role ? getRoleLabel(user.role) : ''}</span>
          <Button size="sm" onClick={() => toast.success('Profile updated')}>Save profile</Button>
        </section>

        <section className="bg-white rounded-2xl p-6 border mb-6">
          <h2 className="font-bold mb-2">Address book</h2>
          <p className="text-sm text-gray-600 mb-2">Home — 12 MG Road, Bangalore 560001</p>
          <Button size="sm" variant="outline" onClick={() => toast.info('Add address modal — demo')}>Add address</Button>
        </section>

        <section className="bg-white rounded-2xl p-6 border mb-6">
          <h2 className="font-bold mb-2">Loyalty & referral</h2>
          <p className="text-2xl font-bold text-[var(--accent)]">240 coins</p>
          <p className="text-sm text-gray-600 mt-2">Referral code: <code className="bg-gray-100 px-2 py-1 rounded">{referral}</code></p>
        </section>

        <section className="bg-white rounded-2xl p-6 border mb-6 space-y-2">
          <h2 className="font-bold">Notifications</h2>
          {['Order updates', 'Price drops', 'Flash sales'].map((n) => (
            <label key={n} className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked /> {n}
            </label>
          ))}
        </section>

        <Button variant="outline" onClick={() => toast.error('Delete account — confirm in production')}>Delete account</Button>
      </div>
    </div>
  );
};

