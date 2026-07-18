import { CreditCard, Send, ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react'

export const metadata = {
  title: 'Wallet — balkan.works',
}

export default function WalletPage() {
  const transactions = [
    { id: 1, type: 'payment', business: 'Elite Electricians', amount: '$120', date: 'Jan 18, 2024', status: 'completed' },
    { id: 2, type: 'refund', business: 'Quick Plumbing', amount: '$45', date: 'Jan 16, 2024', status: 'completed' },
    { id: 3, type: 'payment', business: 'Pro Painting', amount: '$450', date: 'Jan 14, 2024', status: 'pending' },
    { id: 4, type: 'payment', business: 'HVAC Experts', amount: '$200', date: 'Jan 12, 2024', status: 'completed' },
  ]

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage payments and balance</p>
      </div>

      {/* Balance Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border border-primary/50">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm opacity-90">Available Balance</p>
            <h2 className="text-4xl font-bold mt-2">$1,250.50</h2>
          </div>
          <CreditCard className="w-8 h-8 opacity-80" />
        </div>

        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2.5 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 transition text-sm font-semibold flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Funds
          </button>
          <button className="flex-1 px-4 py-2.5 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 transition text-sm font-semibold flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <h3 className="font-semibold">Payment Methods</h3>
        {[
          { type: 'Visa', ending: '4242', default: true },
          { type: 'Mastercard', ending: '5555', default: false },
        ].map((method, i) => (
          <div key={i} className="p-4 rounded-lg border border-border bg-card hover:border-primary transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 rounded bg-primary/20 flex items-center justify-center text-xs font-bold">
                  {method.type.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-medium">{method.type} •••• {method.ending}</p>
                  {method.default && <p className="text-xs text-primary">Default</p>}
                </div>
              </div>
              <button className="text-xs px-2.5 py-1 rounded border border-border hover:border-primary transition">Edit</button>
            </div>
          </div>
        ))}
        <button className="w-full px-4 py-2.5 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition">
          + Add Payment Method
        </button>
      </div>

      {/* Transaction History */}
      <div className="space-y-3">
        <h3 className="font-semibold">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${tx.type === 'payment' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                    {tx.type === 'payment' ? (
                      <ArrowUpRight className={`w-4 h-4 ${tx.type === 'payment' ? 'text-red-600' : 'text-green-600'}`} />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.business}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === 'payment' ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.type === 'payment' ? '-' : '+'}{tx.amount}
                  </p>
                  <p className={`text-xs ${
                    tx.status === 'completed' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
        <h3 className="font-semibold mb-2">Coming Soon: Flexible Payments</h3>
        <p className="text-sm text-muted-foreground">Pay later options, installment plans, and loyalty rewards</p>
      </div>
    </div>
  )
}
