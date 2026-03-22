import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Package, ArrowLeft, Download, Plus, Filter,
  Truck, CheckCircle2, Clock, PackageCheck, XCircle,
  FileText, Loader2
} from "lucide-react";
import { Link } from "wouter";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200", icon: <Clock className="w-3 h-3" /> },
  packed: { label: "Packed", color: "bg-blue-100 text-blue-800 border-blue-200", icon: <PackageCheck className="w-3 h-3" /> },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800 border-purple-200", icon: <Truck className="w-3 h-3" /> },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="w-3 h-3" /> },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <Badge variant="outline" className={`${config.color} gap-1 text-xs font-medium`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

function NewOrderDialog({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [items, setItems] = useState("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);

  const createMutation = trpc.fulfillment.createManual.useMutation({
    onSuccess: () => {
      toast.success("Manual order created");
      setName(""); setEmail(""); setAddress(""); setPostal(""); setItems(""); setNotes("");
      setOpen(false);
      onSuccess();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Manual Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Create Manual Order
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Member Name *" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Textarea placeholder="Delivery Address *" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
          <Input placeholder="Postal Code" value={postal} onChange={(e) => setPostal(e.target.value)} />
          <Textarea placeholder="Items Requested (optional)" value={items} onChange={(e) => setItems(e.target.value)} rows={2} />
          <Textarea placeholder="Admin Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => createMutation.mutate({
              memberName: name,
              memberEmail: email || undefined,
              deliveryAddress: address,
              postalCode: postal || undefined,
              itemsRequested: items || undefined,
              notes: notes || undefined,
            })}
            disabled={!name.trim() || !address.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrderRow({
  order,
  onRefresh,
}: {
  order: any;
  onRefresh: () => void;
}) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(order.notes ?? "");
  const [editingCourier, setEditingCourier] = useState(false);
  const [courierValue, setCourierValue] = useState(order.courierMethod ?? "");
  const [trackingValue, setTrackingValue] = useState(order.trackingNumber ?? "");

  const updateStatus = trpc.fulfillment.updateStatus.useMutation({
    onSuccess: () => { toast.success("Status updated"); onRefresh(); },
    onError: (err) => toast.error(err.message),
  });
  const updateNotes = trpc.fulfillment.updateNotes.useMutation({
    onSuccess: () => { toast.success("Notes saved"); setEditingNotes(false); onRefresh(); },
    onError: (err) => toast.error(err.message),
  });
  const updateCourier = trpc.fulfillment.updateCourier.useMutation({
    onSuccess: () => { toast.success("Courier info saved"); setEditingCourier(false); onRefresh(); },
    onError: (err) => toast.error(err.message),
  });

  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
              <StatusBadge status={order.status} />
              <span className="text-xs text-muted-foreground">{date}</span>
              {order.requestSource === "admin_manual" && (
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">Manual</Badge>
              )}
            </div>
            <p className="font-semibold text-sm mt-1">{order.memberName || "Unknown"}</p>
            {order.memberEmail && <p className="text-xs text-muted-foreground">{order.memberEmail}</p>}
          </div>
          <Select
            value={order.status}
            onValueChange={(val) => updateStatus.mutate({ orderId: order.id, status: val as any })}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="packed">Packed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Address */}
        <div className="text-xs">
          <span className="font-medium text-muted-foreground">Address: </span>
          <span>{order.deliveryAddress}</span>
          {order.postalCode && <span className="ml-1 text-muted-foreground">({order.postalCode})</span>}
        </div>

        {/* Items */}
        {order.itemsRequested && (
          <div className="text-xs">
            <span className="font-medium text-muted-foreground">Items: </span>
            <span>{order.itemsRequested}</span>
          </div>
        )}

        {/* Notes */}
        <div className="text-xs">
          {editingNotes ? (
            <div className="flex gap-2 items-end">
              <Textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                rows={2}
                className="text-xs flex-1"
                placeholder="Add notes (e.g. Amazon order #123, courier booked)"
              />
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="default" className="h-7 text-xs"
                  onClick={() => updateNotes.mutate({ orderId: order.id, notes: notesValue })}
                  disabled={updateNotes.isPending}
                >Save</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs"
                  onClick={() => { setEditingNotes(false); setNotesValue(order.notes ?? ""); }}
                >Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="font-medium text-muted-foreground">Notes: </span>
              <span className="flex-1">{order.notes || "—"}</span>
              <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setEditingNotes(true)}>
                <FileText className="w-3 h-3 mr-1" /> Edit
              </Button>
            </div>
          )}
        </div>

        {/* Courier */}
        <div className="text-xs">
          {editingCourier ? (
            <div className="flex gap-2 items-end flex-wrap">
              <Input
                value={courierValue}
                onChange={(e) => setCourierValue(e.target.value)}
                className="text-xs flex-1 min-w-[120px]"
                placeholder="Courier / Method"
              />
              <Input
                value={trackingValue}
                onChange={(e) => setTrackingValue(e.target.value)}
                className="text-xs flex-1 min-w-[120px]"
                placeholder="Tracking # (optional)"
              />
              <div className="flex gap-1">
                <Button size="sm" variant="default" className="h-7 text-xs"
                  onClick={() => updateCourier.mutate({ orderId: order.id, courierMethod: courierValue, trackingNumber: trackingValue || undefined })}
                  disabled={updateCourier.isPending}
                >Save</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs"
                  onClick={() => { setEditingCourier(false); setCourierValue(order.courierMethod ?? ""); setTrackingValue(order.trackingNumber ?? ""); }}
                >Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="font-medium text-muted-foreground">Courier: </span>
              <span className="flex-1">
                {order.courierMethod || "—"}
                {order.trackingNumber && <span className="ml-1 text-primary">({order.trackingNumber})</span>}
              </span>
              <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setEditingCourier(true)}>
                <Truck className="w-3 h-3 mr-1" /> Edit
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminFulfillment() {
  const { user, isAuthenticated } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const utils = trpc.useUtils();

  const ordersQuery = trpc.fulfillment.listOrders.useQuery(
    { status: statusFilter === "all" ? undefined : statusFilter },
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  const statsQuery = trpc.fulfillment.orderStats.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const orders = ordersQuery.data ?? [];
  const stats = statsQuery.data ?? { total: 0, pending: 0, packed: 0, shipped: 0, delivered: 0 };

  const handleRefresh = () => {
    utils.fulfillment.listOrders.invalidate();
    utils.fulfillment.orderStats.invalidate();
  };

  // CSV export
  const handleExportCSV = () => {
    if (orders.length === 0) { toast.error("No orders to export"); return; }
    const headers = ["Order #", "Date", "Name", "Email", "Address", "Postal Code", "Items", "Status", "Notes", "Courier", "Tracking", "Source"];
    const rows = orders.map((o: any) => [
      o.id,
      o.createdAt ? new Date(o.createdAt).toISOString().split("T")[0] : "",
      o.memberName ?? "",
      o.memberEmail ?? "",
      `"${(o.deliveryAddress ?? "").replace(/"/g, '""')}"`,
      o.postalCode ?? "",
      `"${(o.itemsRequested ?? "").replace(/"/g, '""')}"`,
      o.status,
      `"${(o.notes ?? "").replace(/"/g, '""')}"`,
      o.courierMethod ?? "",
      o.trackingNumber ?? "",
      o.requestSource ?? "",
    ]);
    const csv = [headers.join(","), ...rows.map((r: any[]) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `essentials-orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  // Auth gate
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="p-6 text-center space-y-4">
            <Package className="w-12 h-12 text-muted-foreground mx-auto" />
            <h2 className="text-lg font-bold">Admin Only</h2>
            <p className="text-sm text-muted-foreground">This page is restricted to Maven team members.</p>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/admin">
              <button className="text-white/70 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <Package className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Essentials Box Fulfillment</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { label: "Total", value: stats.total, color: "text-white" },
              { label: "Pending", value: stats.pending, color: "text-amber-300" },
              { label: "Packed", value: stats.packed, color: "text-blue-300" },
              { label: "Shipped", value: stats.shipped, color: "text-purple-300" },
              { label: "Delivered", value: stats.delivered, color: "text-emerald-300" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-lg p-2">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2 h-9" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <NewOrderDialog onSuccess={handleRefresh} />
        </div>

        {/* Orders list */}
        {ordersQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center space-y-3">
              <Package className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="font-semibold">No orders yet</h3>
              <p className="text-sm text-muted-foreground">
                When members request their Essentials Box, orders will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <OrderRow key={order.id} order={order} onRefresh={handleRefresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
