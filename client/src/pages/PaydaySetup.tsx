import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Calendar, DollarSign, Clock } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function PaydaySetup() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [frequency, setFrequency] = useState<string>("");
  const [dayOfWeek, setDayOfWeek] = useState<string>("");
  const [dayOfMonth1, setDayOfMonth1] = useState("");
  const [dayOfMonth2, setDayOfMonth2] = useState("");
  const [lastPayday, setLastPayday] = useState("");

  const { data: pattern } = trpc.payday.get.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const setupMut = trpc.payday.setup.useMutation({
    onSuccess: (data) => {
      toast.success(`Payday pattern saved! Next payday: ${data.nextPayday ? new Date(data.nextPayday).toLocaleDateString() : "calculating..."}`);
    },
  });

  const detectMut = trpc.payday.detectFromBudget.useMutation({
    onSuccess: (data) => {
      if (data.detected) {
        toast.success(`Detected ${data.frequency} income pattern from your budget (${data.confidence}% confidence)`);
      } else {
        toast.info(data.message);
      }
    },
  });

  const handleSave = () => {
    if (!profileId || !frequency) return;
    setupMut.mutate({
      profileId,
      frequency: frequency as any,
      dayOfWeek: dayOfWeek ? Number(dayOfWeek) : undefined,
      dayOfMonth1: dayOfMonth1 ? Number(dayOfMonth1) : undefined,
      dayOfMonth2: dayOfMonth2 ? Number(dayOfMonth2) : undefined,
      lastPayday: lastPayday || undefined,
    });
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-lg py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium mb-2">
            <DollarSign className="w-3 h-3" /> Penny the Collector
          </div>
          <h1 className="text-2xl font-bold">Payday Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tell us when you get paid so Penny can align your Milk Money repayments to your real paydays.
          </p>
        </div>

        {/* Current Pattern */}
        {pattern && (
          <Card className="mb-4 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold capitalize">{pattern.frequency} pay</div>
                  <div className="text-sm text-muted-foreground">
                    Next payday: {pattern.nextPayday ? new Date(pattern.nextPayday).toLocaleDateString() : "Not calculated"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confidence: {pattern.confidence}% ({pattern.source})
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auto-detect */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-4 h-4" /> Auto-Detect from Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              If you've added income entries to your Budget Builder, Penny can detect your pay pattern automatically.
            </p>
            <Button onClick={() => profileId && detectMut.mutate({ profileId })} disabled={detectMut.isPending} variant="outline" className="w-full">
              {detectMut.isPending ? "Analyzing..." : "Detect My Payday Pattern"}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Manual Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">How often do you get paid?</label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Every week</SelectItem>
                  <SelectItem value="biweekly">Every two weeks</SelectItem>
                  <SelectItem value="semimonthly">Twice a month (e.g., 1st & 15th)</SelectItem>
                  <SelectItem value="monthly">Once a month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(frequency === "weekly" || frequency === "biweekly") && (
              <div>
                <label className="text-sm font-medium">What day of the week?</label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((d, i) => (
                      <SelectItem key={i} value={i.toString()}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(frequency === "semimonthly" || frequency === "monthly") && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Day of month (first payday)</label>
                <Input type="number" min="1" max="31" value={dayOfMonth1} onChange={(e) => setDayOfMonth1(e.target.value)} placeholder="e.g., 1" />
                {frequency === "semimonthly" && (
                  <>
                    <label className="text-sm font-medium">Day of month (second payday)</label>
                    <Input type="number" min="1" max="31" value={dayOfMonth2} onChange={(e) => setDayOfMonth2(e.target.value)} placeholder="e.g., 15" />
                  </>
                )}
              </div>
            )}

            {frequency && (
              <div>
                <label className="text-sm font-medium">When was your last payday?</label>
                <Input type="date" value={lastPayday} onChange={(e) => setLastPayday(e.target.value)} className="mt-1" />
              </div>
            )}

            <Button onClick={handleSave} disabled={!frequency || setupMut.isPending} className="w-full bg-green-600 hover:bg-green-700">
              {setupMut.isPending ? "Saving..." : "Save Payday Pattern"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
