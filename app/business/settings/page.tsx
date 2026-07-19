'use client'

import { Bell, Lock, Users, FileText, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Podešavanja</h1>
        <p className="text-muted-foreground mt-1">Upravljajte profilom firme i podešavanjima</p>
      </div>

      {/* Profile Settings */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Poslovni profil
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Naziv firme</label>
            <input
              type="text"
              defaultValue="Elite Električari"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Kategorija</label>
            <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
              <option>Električarske usluge</option>
              <option>Vodoinstalaterske usluge</option>
              <option>Klima i ventilacija</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Opis</label>
            <textarea
              defaultValue="Profesionalne električarske usluge za stambene i poslovne objekte."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
            Sačuvaj izmene
          </button>
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
            { label: 'Obaveštenja o novim upitima', desc: 'Dobij obaveštenje kada stigne novi upit' },
            { label: 'Obaveštenja o porukama', desc: 'Dobij obaveštenje za svaku novu poruku' },
            { label: 'Obaveštenja o recenzijama', desc: 'Dobij obaveštenje kada te neko oceni' },
            { label: 'Izveštaji o rezultatima', desc: 'Nedeljni pregled učinka firme' },
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
          Bezbednost
        </h2>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition text-left">
            <span className="text-sm font-medium">Promeni lozinku</span>
            <span className="text-muted-foreground">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition text-left">
            <span className="text-sm font-medium">Dvofaktorska prijava</span>
            <span className="text-xs bg-amber-500/20 text-amber-600 px-2.5 py-1 rounded">Isključena</span>
          </button>
        </div>
      </div>

      {/* Billing & Plans */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Naplata
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div>
              <p className="text-sm font-medium">Trenutni paket</p>
              <p className="text-xs text-muted-foreground">Premium — 29 € mesečno</p>
            </div>
            <button className="text-sm text-primary hover:underline">Unapredi paket</button>
          </div>
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition text-left">
            <span className="text-sm font-medium">Istorija naplate</span>
            <span className="text-muted-foreground">→</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl border border-destructive/50 bg-destructive/5">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-destructive">
          <Trash2 className="w-5 h-5" />
          Osetljive radnje
        </h2>
        <button className="px-6 py-2.5 rounded-lg border border-destructive text-destructive text-sm font-semibold hover:bg-destructive/10 transition">
          Obriši nalog
        </button>
      </div>
    </div>
  )
}
