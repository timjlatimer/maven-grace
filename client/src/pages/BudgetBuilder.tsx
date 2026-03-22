import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle, Trash2, TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";

const EXPENSE_CATEGORIES = ["rent", "utilities", "groceries", "transport", "phone", "childcare", "medical", "clothing", "entertainment", "other"];
const INCOME_CATEGORIES = ["employment", "government_benefit", "child_support", "side_income", "other"];

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function BudgetBuilder() {
  const { profileId } = useGraceSession();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPaycheckForm, setShowPaycheckForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: "expense" as "income" | "expense",
    category: "other",
    description: "",
    amountDollars: "",
    frequency: "monthly" as "one_time" | "weekly" | "biweekly" | "monthly",
  });
  const [paycheckForm, setPaycheckForm] = useState({
    amountDollars: "",
    frequency: "biweekly" as "weekly" | "biweekly" | "semimonthly" | "monthly",
    employer: "",
  });

  const { data: budgetData, refetch } = trpc.budget.getEntries.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const addEntry = trpc.budget.addEntry.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Added to your budget!");
      setShowAddForm(false);
      setNewEntry({ type: "expense", category: "other", description: "", amountDollars: "", frequency: "monthly" });
    },
    onError: () => toast.error("Couldn't add that. Try again?"),
  });

  const deleteEntry = trpc.budget.deleteEntry.useMutation({
    onSuccess: () => { refetch(); toast.success("Removed."); },
  });

  const setPaycheck = trpc.budget.setPaycheck.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Paycheck updated!");
      setShowPaycheckForm(false);
    },
  });

  const handleAddEntry = () => {
    if (!profileId || !newEntry.description || !newEntry.amountDollars) {
      toast.error("Fill in description and amount first.");
      return;
    }
    addEntry.mutate({
      profileId,
      type: newEntry.type,
      category: newEntry.category,
      description: newEntry.description,
      amountCents: Math.round(parseFloat(newEntry.amountDollars) * 100),
      frequency: newEntry.frequency,
    });
  };

  const handleSetPaycheck = () => {
    if (!profileId || !paycheckForm.amountDollars) return;
    setPaycheck.mutate({
      profileId,
      amountCents: Math.round(parseFloat(paycheckForm.amountDollars) * 100),
      frequency: paycheckForm.frequency,
      employer: paycheckForm.employer || undefined,
    });
  };

  const entries = budgetData?.entries || [];
  const income = budgetData?.income || 0;
  const expenses = budgetData?.expenses || 0;
  const balance = income - expenses;
  const paycheck = budgetData?.paycheck;

  const incomeEntries = entries.filter(e => e.type === "income");
  const expenseEntries = entries.filter(e => e.type === "expense");

  const balanceColor = balance >= 0 ? "text-teal-600" : "text-rose-500";
  const balanceBg = balance >= 0 ? "bg-teal-50 border-teal-200" : "bg-rose-50 border-rose-200";

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-cream pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white px-4 pt-12 pb-8">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-teal-200" />
            <span className="text-teal-200 text-sm font-semibold uppercase tracking-wide">Budget Builder</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Your Money Picture</h1>
          <p className="text-teal-100 text-sm">See exactly where your money goes — no judgment, just clarity.</p>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Balance Summary */}
        <Card className={`p-5 border-2 ${balanceBg}`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Income</span>
              </div>
              <div className="text-xl font-bold text-teal-700">{formatCents(income)}</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-rose-500 mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Expenses</span>
              </div>
              <div className="text-xl font-bold text-rose-600">{formatCents(expenses)}</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Left Over</span>
              </div>
              <div className={`text-xl font-bold ${balanceColor}`}>{formatCents(balance)}</div>
            </div>
          </div>
          {balance < 0 && (
            <p className="text-rose-600 text-xs text-center mt-3 font-medium">
              ⚠️ Expenses exceed income by {formatCents(Math.abs(balance))} — Grace can help you find where to cut.
            </p>
          )}
          {balance >= 0 && income > 0 && (
            <p className="text-teal-600 text-xs text-center mt-3 font-medium">
              ✓ You have {formatCents(balance)} left over each month. That's your breathing room.
            </p>
          )}
        </Card>

        {/* Paycheck */}
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Your Paycheck</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPaycheckForm(!showPaycheckForm)} className="text-teal-600 text-xs">
              {paycheck ? "Edit" : "Add"}
            </Button>
          </div>
          {paycheck ? (
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{formatCents(paycheck.amountCents)}</span>
              {" "}{paycheck.frequency === "biweekly" ? "every 2 weeks" : paycheck.frequency}
              {paycheck.employer && <span className="text-gray-400"> · {paycheck.employer}</span>}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Add your paycheck to see your full picture.</p>
          )}
          {showPaycheckForm && (
            <div className="mt-3 space-y-2 border-t pt-3">
              <Input
                placeholder="Take-home amount (e.g. 1200)"
                value={paycheckForm.amountDollars}
                onChange={e => setPaycheckForm(p => ({ ...p, amountDollars: e.target.value }))}
                type="number"
              />
              <Select value={paycheckForm.frequency} onValueChange={v => setPaycheckForm(p => ({ ...p, frequency: v as typeof paycheckForm.frequency }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                  <SelectItem value="semimonthly">Twice a month</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Employer (optional)" value={paycheckForm.employer} onChange={e => setPaycheckForm(p => ({ ...p, employer: e.target.value }))} />
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSetPaycheck}>Save Paycheck</Button>
            </div>
          )}
        </Card>

        {/* Income entries */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" /> Income
            </h3>
            <Button variant="ghost" size="sm" className="text-teal-600 text-xs" onClick={() => { setNewEntry(e => ({ ...e, type: "income" })); setShowAddForm(true); }}>
              <PlusCircle className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>
          {incomeEntries.length === 0 ? (
            <Card className="p-4 text-center text-gray-400 text-sm border-dashed">No income added yet</Card>
          ) : (
            <div className="space-y-2">
              {incomeEntries.map(entry => (
                <Card key={entry.id} className="p-3 flex items-center justify-between border border-teal-100">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{entry.description}</p>
                    <p className="text-gray-400 text-xs capitalize">{entry.category} · {entry.frequency}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-teal-600">{formatCents(entry.amountCents)}</span>
                    <button onClick={() => deleteEntry.mutate({ id: entry.id })} className="text-gray-300 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Expense entries */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" /> Expenses
            </h3>
            <Button variant="ghost" size="sm" className="text-rose-500 text-xs" onClick={() => { setNewEntry(e => ({ ...e, type: "expense" })); setShowAddForm(true); }}>
              <PlusCircle className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>
          {expenseEntries.length === 0 ? (
            <Card className="p-4 text-center text-gray-400 text-sm border-dashed">No expenses added yet</Card>
          ) : (
            <div className="space-y-2">
              {expenseEntries.map(entry => (
                <Card key={entry.id} className="p-3 flex items-center justify-between border border-rose-100">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{entry.description}</p>
                    <p className="text-gray-400 text-xs capitalize">{entry.category} · {entry.frequency}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-rose-500">{formatCents(entry.amountCents)}</span>
                    <button onClick={() => deleteEntry.mutate({ id: entry.id })} className="text-gray-300 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add entry form */}
        {showAddForm && (
          <Card className="p-4 border-2 border-teal-200 bg-teal-50">
            <h4 className="font-semibold text-gray-800 mb-3">Add {newEntry.type === "income" ? "Income" : "Expense"}</h4>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={newEntry.type === "expense" ? "default" : "outline"}
                  className={newEntry.type === "expense" ? "bg-rose-500 hover:bg-rose-600 text-white" : ""}
                  onClick={() => setNewEntry(e => ({ ...e, type: "expense" }))}
                >Expense</Button>
                <Button
                  size="sm"
                  variant={newEntry.type === "income" ? "default" : "outline"}
                  className={newEntry.type === "income" ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}
                  onClick={() => setNewEntry(e => ({ ...e, type: "income" }))}
                >Income</Button>
              </div>
              <Input
                placeholder="What is it? (e.g. Netflix, Rent, Child tax benefit)"
                value={newEntry.description}
                onChange={e => setNewEntry(n => ({ ...n, description: e.target.value }))}
              />
              <Input
                placeholder="Amount in dollars (e.g. 45.99)"
                value={newEntry.amountDollars}
                onChange={e => setNewEntry(n => ({ ...n, amountDollars: e.target.value }))}
                type="number"
              />
              <Select value={newEntry.frequency} onValueChange={v => setNewEntry(n => ({ ...n, frequency: v as typeof newEntry.frequency }))}>
                <SelectTrigger><SelectValue placeholder="How often?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                  <SelectItem value="one_time">One time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newEntry.category} onValueChange={v => setNewEntry(n => ({ ...n, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {(newEntry.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" onClick={handleAddEntry} disabled={addEntry.isPending}>
                  {addEntry.isPending ? "Adding..." : "Add"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
