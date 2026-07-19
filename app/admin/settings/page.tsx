import { Settings, Lock, Bell, Users } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Administratorska podešavanja</h1>
        <p className="text-muted-foreground mt-1">Upravljanje konfiguracijom sistema</p>
      </div>

      {/* System Settings */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Konfiguracija sistema
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Najveća veličina otpremanja (MB)</label>
            <input
              type="number"
              defaultValue="50"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stopa provizije (%)</label>
            <input
              type="number"
              defaultValue="5"
              step="0.1"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Automatsko zatvaranje prijava (dani)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Bezbednost
        </h2>
        <div className="space-y-3">
          {[
            'Uključi dvofaktorsku prijavu za administratore',
            'Zahtevaj potvrdu imejl adrese',
            'Uključi ograničavanje API zahteva',
            'Beleži sve administratorske radnje',
          ].map((setting) => (
            <div key={setting} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium">{setting}</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Obaveštenja
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Upozorenje za nove prijave', checked: true },
            { label: 'Dnevni pregled na imejl', checked: true },
            { label: 'Upozorenje za sumnjivu aktivnost', checked: true },
            { label: 'Sistemska upozorenja', checked: true },
          ].map((notif) => (
            <div key={notif.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium">{notif.label}</span>
              <input type="checkbox" defaultChecked={notif.checked} className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Admin Users */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Administratori
        </h2>
        <div className="space-y-3">
          {[
            { name: 'Sistemski administrator', role: 'Glavni administrator', email: 'admin@balkan.works' },
            { name: 'Tim za moderaciju', role: 'Moderator', email: 'moderacija@balkan.works' },
            { name: 'Tim za podršku', role: 'Podrška', email: 'podrska@balkan.works' },
          ].map((user, i) => (
            <div key={i} className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <span className="text-xs bg-primary/20 text-primary px-2.5 py-1 rounded font-semibold">{user.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
          Sačuvaj izmene
        </button>
        <button className="px-6 py-2.5 rounded-lg border border-border bg-card text-sm font-semibold hover:border-primary transition">
          Vrati podrazumevano
        </button>
      </div>
    </div>
  )
}
