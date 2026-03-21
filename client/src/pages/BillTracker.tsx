import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PlusCircle, CheckCircle, AlertTriangle, Shield, Trash2, Calendar } from "lucide-react";

const BILL_CATEGORIES = ["rent", "utilities", "phone", "internet", "insurance", "medical", "credit_card", "loan", "childcare", "other"];

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function getDaysUntilDue(dueDay: number) {
  const today = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  let diff = dueDay - today;
  if (diff < 0) diff += daysInMonth;
  return diff;
}

export default function BillTracker() {
  const { profileId } = useGraceSession();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showScript, setShowScript] = useState<number | null>(null);
  const [newBill, setNewBill] = useState({ name: "", amountDollars: "", dueDay: "", category: "other", isAutoPay: false });

  const { data: bills, refetch } = trpc.bills.list.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const addBill = trpc.bills.add.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Bill added!");
      setShowAddForm(false);
      setNewBill({ name: "", amountDollars: "", dueDay: "", category: "other", isAutoPay: false });
    },
  });

  const markPaid = trpc.bills.markPaid.useMutation({
    onSuccess: () => { refetch(); toast.success("Marked as paid! 🎉"); },
  });

  const flagNsf = trpc.bills.flagNsfRisk.useMutation({
    onSuccess: (data) => {
      refetch();
      toast.success("NSF dispute script ready! Estimated $45 saved.");
    },
    onError: () => toast.error("Couldn't generate script. Try again."),
  });

  const deleteBill = trpc.bills.delete.useMutation({
    onSuccess: () => { refetch(); toast.success("Removed."); },
  });

  const handleAddBill = () => {
    if (!profileId || !newBill.name || !newBill.amountDollars || !newBill.dueDay) {
      toast.error("Fill in all fields first.");
      return;
    }
    addBill.mutate({
      profileId,
      name: newBill.name,
      amountCents: Math.round(parseFloat(newBill.amountDollars) * 100),
      dueDay: parseInt(newBill.dueDay),
      category: newBill.category,
      isAutoPay: newBill.isAutoPay,
    });
  };

  const activeBills = bills?.filter(b => b.isActive) || [];
  const unpaidBills = activeBills.filter(b => !b.isPaid);
  const paidBills = activeBills.filter(b => b.isPaid);
  const totalMonthly = activeBills.reduce((sum, b) => sum + b.amountCents, 0);
  const nsfFlagged = activeBills.filter(b => b.nsfRiskFlagged);

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white px-4 pt-12 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-teal-200" />
            <span className="text-teal-200 text-sm font-semibold uppercase tracking-wide">Bill Tracker</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Never Miss a Bill</h1>
          <p className="text-teal-100 text-sm">Track what's due, mark it paid, and fight NSF fees before they hit.</p>
          {activeBills.length > 0 && (
            <div className="mt-3 bg-teal-500/30 rounded-xl p-3">
              <p className="text-teal-100 text-sm">Monthly total: <span className="font-bold text-white">{formatCents(totalMonthly)}</span></p>
              <p className="text-teal-200 text-xs">{unpaidBills.length} unpaid · {paidBills.length} paid this month</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* NSF Fee Fighter banner */}
        {nsfFlagged.length > 0 && (
          <Card className="p-4 bg-amber-50 border-amber-300 border-2">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">NSF Fee Fighter Active</p>
                <p className="text-amber-600 text-sm">{nsfFlagged.length} bill(s) flagged. Dispute scripts ready below.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Unpaid bills */}
        {unpaidBills.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Coming Up
            </h3>
            <div className="space-y-2">
              {unpaidBills.sort((a, b) => a.dueDay - b.dueDay).map(bill => {
                const daysUntil = getDaysUntilDue(bill.dueDay);
                const isUrgent = daysUntil <= 3;
                return (
                  <Card key={bill.id} className={`p-4 border ${isUrgent ? "border-rose-200 bg-rose-50" : "border-gray-200"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{bill.name}</p>
                          {isUrgent && <Badge className="bg-rose-100 text-rose-700 text-xs">Due soon!</Badge>}
                          {bill.isAutoPay && <Badge className="bg-gray-100 text-gray-600 text-xs">Auto-pay</Badge>}
                        </div>
                        <p className="text-gray-500 text-xs">Due day {bill.dueDay} · {daysUntil === 0 ? "TODAY" : `${daysUntil} days`}</p>
                        {bill.nsfRiskFlagged && (
                          <button
                            className="text-amber-600 text-xs font-semibold mt-1 flex items-center gap-1"
                            onClick={() => setShowScript(showScript === bill.id ? null : bill.id)}
                          >
                            <Shield className="w-3 h-3" />
                            {showScript === bill.id ? "Hide" : "Show"} dispute script
                          </button>
                        )}
                        {showScript === bill.id && bill.nsfFeeDisputeScript && (
                          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                            {bill.nsfFeeDisputeScript}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-3">
                        <span className="font-bold text-gray-900">{formatCents(bill.amountCents)}</span>
                        <div className="flex gap-1">
                          {!bill.nsfRiskFlagged && (
                            <button
                              onClick={() => flagNsf.mutate({ id: bill.id, profileId: profileId! })}
                              className="text-amber-400 hover:text-amber-600 p-1"
                              title="Flag NSF risk"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => markPaid.mutate({ id: bill.id })}
                            className="text-gray-300 hover:text-teal-500 p-1"
                            title="Mark paid"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBill.mutate({ id: bill.id })}
                            className="text-gray-200 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Paid bills */}
        {paidBills.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-400 mb-2 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-teal-400" /> Paid This Month
            </h3>
            <div className="space-y-2">
              {paidBills.map(bill => (
                <Card key={bill.id} className="p-3 flex items-center justify-between border border-gray-100 opacity-60">
                  <div>
                    <p className="font-medium text-gray-600 text-sm line-through">{bill.name}</p>
                    <p className="text-gray-400 text-xs">Paid ✓</p>
                  </div>
                  <span className="text-gray-400 text-sm">{formatCents(bill.amountCents)}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {activeBills.length === 0 && !showAddForm && (
          <Card className="p-8 text-center border-dashed border-2 border-gray-200">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium mb-1">No bills tracked yet</p>
            <p className="text-gray-400 text-sm mb-4">Add your bills to see what's coming up and protect yourself from NSF fees.</p>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setShowAddForm(true)}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add Your First Bill
            </Button>
          </Card>
        )}

        {/* Add button */}
        {activeBills.length > 0 && !showAddForm && (
          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setShowAddForm(true)}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add a Bill
          </Button>
        )}

        {/* Add form */}
        {showAddForm && (
          <Card className="p-4 border-2 border-teal-200 bg-teal-50">
            <h4 className="font-semibold text-gray-800 mb-3">Add a Bill</h4>
            <div className="space-y-2">
              <Input placeholder="Bill name (e.g. Hydro, Rogers, Rent)" value={newBill.name} onChange={e => setNewBill(b => ({ ...b, name: e.target.value }))} />
              <Input placeholder="Amount ($)" value={newBill.amountDollars} onChange={e => setNewBill(b => ({ ...b, amountDollars: e.target.value }))} type="number" />
              <Input placeholder="Due day of month (e.g. 15)" value={newBill.dueDay} onChange={e => setNewBill(b => ({ ...b, dueDay: e.target.value }))} type="number" min="1" max="31" />
              <div className="flex gap-2">
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" onClick={handleAddBill} disabled={addBill.isPending}>
                  {addBill.isPending ? "Adding..." : "Add Bill"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {/* NSF Fee Fighter info */}
        <Card className="p-4 bg-amber-50 border-amber-100">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">NSF Fee Fighter</p>
              <p className="text-amber-600 text-xs">Tap the shield icon on any bill to flag NSF risk. Grace will generate a dispute script to call your bank and get the fee waived. Average NSF fee: $45. Average success rate: 70%.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
