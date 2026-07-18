'use client'

import { Settings, Bell, Lock, Users, FileText, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your business profile and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Business Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Business Name</label>
            <input
              type="text"
              defaultValue="Elite Electricians"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
              <option>Electrical Services</option>
              <option>Plumbing</option>
              <option>HVAC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              defaultValue="Professional electrical services for residential and commercial properties."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>
        <div className="space-y-3">
          {[
            { label: 'New Lead Alerts', desc: 'Get notified when you receive a new lead' },
            { label: 'Message Notifications', desc: 'Receive alerts for new messages' },
            { label: 'Review Notifications', desc: 'Get notified when someone reviews you' },
            { label: 'Performance Reports', desc: 'Weekly performance summaries' },
          ].map((notif) => (
            <div key={notif.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="text-sm font-medium">{notif.label}</p>
                <p className="text-xs text-muted-foreground">{notif.desc}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Security
        </h2>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition text-left">
            <span className="text-sm font-medium">Change Password</span>
            <span className="text-muted-foreground">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition text-left">
            <span className="text-sm font-medium">Two-Factor Authentication</span>
            <span className="text-xs bg-amber-500/20 text-amber-600 px-2.5 py-1 rounded">Disabled</span>
          </button>
        </div>
      </div>

      {/* Billing & Plans */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Billing
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div>
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-xs text-muted-foreground">Premium - $29/month</p>
            </div>
            <button className="text-sm text-primary hover:underline">Upgrade</button>
          </div>
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition text-left">
            <span className="text-sm font-medium">Billing History</span>
            <span className="text-muted-foreground">→</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl border border-destructive/50 bg-destructive/5">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-destructive">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h2>
        <button className="px-6 py-2.5 rounded-lg border border-destructive text-destructive text-sm font-semibold hover:bg-destructive/10 transition">
          Delete Account
        </button>
      </div>
    </div>
  )
}
