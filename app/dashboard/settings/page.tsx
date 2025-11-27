'use client';

import { useUser } from '@clerk/nextjs';
import { User, Bell, Shield, LogOut, Database } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setSyncResult(`✓ Synced ${data.synced} posts (${data.chunks} chunks) to RAG system`);
      } else {
        setSyncResult(`✗ ${data.error}`);
      }
    } catch (error) {
      setSyncResult('✗ Failed to sync posts');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#0f0f0f] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#e8e8e8]">Settings</h1>
          <p className="text-sm text-[#8e8e8e] mt-1">Manage your account and preferences</p>
        </div>

        <div className="space-y-4">
          {/* Profile Section */}
          <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-5 w-5 text-[#d4a574]" />
              <h2 className="text-lg font-medium text-[#e8e8e8]">Profile</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#8e8e8e]">Name</label>
                <p className="text-sm text-[#e8e8e8] mt-1">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <label className="text-xs text-[#8e8e8e]">Email</label>
                <p className="text-sm text-[#e8e8e8] mt-1">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <div>
                <label className="text-xs text-[#8e8e8e]">Username</label>
                <p className="text-sm text-[#e8e8e8] mt-1">
                  {user?.username || 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-5 w-5 text-[#d4a574]" />
              <h2 className="text-lg font-medium text-[#e8e8e8]">Notifications</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e8e8e8]">Post replies</p>
                  <p className="text-xs text-[#8e8e8e]">Get notified when someone replies to your posts</p>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e8e8e8]">New followers</p>
                  <p className="text-xs text-[#8e8e8e]">Get notified when someone follows you</p>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-[#d4a574]" />
              <h2 className="text-lg font-medium text-[#e8e8e8]">Privacy & Security</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e8e8e8]">Private account</p>
                  <p className="text-xs text-[#8e8e8e]">Only approved followers can see your posts</p>
                </div>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#e8e8e8]">Show online status</p>
                  <p className="text-xs text-[#8e8e8e]">Let others see when you're active</p>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
            </div>
          </div>

          {/* RAG Sync Section */}
          <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-5 w-5 text-[#d4a574]" />
              <h2 className="text-lg font-medium text-[#e8e8e8]">RAG System</h2>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-[#8e8e8e]">
                Sync community posts to the AI knowledge base. This allows PeerAI to answer questions based on community discussions.
              </p>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="w-full px-4 py-2 bg-[#d4a574] text-[#1a1a1a] rounded-md hover:bg-[#c49564] transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? 'Syncing...' : 'Sync Posts to RAG'}
              </button>
              {syncResult && (
                <p className={`text-xs ${syncResult.startsWith('✓') ? 'text-green-500' : 'text-red-500'}`}>
                  {syncResult}
                </p>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-6">
            <div className="flex items-center space-x-3 mb-4">
              <LogOut className="h-5 w-5 text-[#d4a574]" />
              <h2 className="text-lg font-medium text-[#e8e8e8]">Account</h2>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
