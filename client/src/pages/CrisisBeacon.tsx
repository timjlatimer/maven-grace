import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, AlertTriangle, Heart, Phone, Shield, MessageCircle } from "lucide-react";

const CRISIS_TYPES = [
  { value: "financial", label: "Financial Emergency", icon: "💰" },
  { value: "housing", label: "Housing / Eviction Risk", icon: "🏠" },
  { value: "food", label: "Food Insecurity", icon: "🍎" },
  { value: "health", label: "Health Crisis", icon: "🏥" },
  { value: "safety", label: "Safety Concern", icon: "🛡️" },
  { value: "emotional", label: "I'm Not Okay", icon: "💔" },
  { value: "other", label: "Something Else", icon: "📋" },
] as const;

export default function CrisisBeacon() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [crisisType, setCrisisType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [beaconSent, setBeaconSent] = useState(false);

  const activateMut = trpc.crisisBeacon.activate.useMutation({
    onSuccess: () => {
      setBeaconSent(true);
      toast.success("Vera and Big Mama are here. You're not alone.");
    },
  });

  const handleActivate = () => {
    if (!profileId || !crisisType) return;
    activateMut.mutate({ profileId });
  };

  if (beaconSent) {
    return (
      <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="container max-w-lg py-6 text-center">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-purple-600 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold mb-3">We're Here</h1>
          
          <Card className="mb-4 text-left border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">V</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Vera the Real One</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Hey. I heard things got heavy. I'm not going to pretend I know exactly what you're going through, 
                    but I've been in some dark rooms and I know how to sit in them. I'm not going anywhere."
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">BM</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Big Mama</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Vera told me you've been having a time. Sit down, baby. We've seen worse and we've come through. 
                    Let's figure this out together."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button onClick={() => navigate("/grace")} className="w-full bg-purple-600 hover:bg-purple-700">
              <MessageCircle className="w-4 h-4 mr-2" /> Talk to Grace
            </Button>
            <Button variant="outline" onClick={() => navigate("/credits")} className="w-full">
              <Heart className="w-4 h-4 mr-2" /> Community Resources
            </Button>
            <div className="text-xs text-muted-foreground mt-4">
              <Phone className="w-3 h-3 inline mr-1" />
              If you're in immediate danger, call 911 or your local emergency services.
              <br />
              Crisis Text Line: Text HOME to 741741
            </div>
          </div>

          <button onClick={() => { setBeaconSent(false); setCrisisType(""); setDescription(""); }} className="text-xs text-muted-foreground mt-6 underline">
            Back to beacon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-lg py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-medium mb-2">
            <Shield className="w-3 h-3" /> When Life Gets Too Real
          </div>
          <h1 className="text-2xl font-bold">I'm Not Okay Beacon</h1>
          <p className="text-sm text-muted-foreground mt-1">
            This is a safe space. Vera the Real One and Big Mama are standing by.
            <br />No judgment. No lectures. Just real support.
          </p>
        </div>

        <Card className="mb-4 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                <strong>This is never removed.</strong> No matter what happens with your subscription, 
                your payments, or anything else — this beacon is always here. Always. 
                That's a promise from Maven.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What's Going On?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={crisisType} onValueChange={setCrisisType}>
              <SelectTrigger>
                <SelectValue placeholder="What kind of help do you need?" />
              </SelectTrigger>
              <SelectContent>
                {CRISIS_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <span>{t.icon} {t.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Tell us as much or as little as you want. Vera doesn't flinch."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            <Button
              onClick={handleActivate}
              disabled={!crisisType || activateMut.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {activateMut.isPending ? "Activating..." : "Send Beacon — I Need Help"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Your beacon activates Vera, Big Mama, Steady the Crisis Coach, and Harbour the Community Guide.
              <br />If you've given permission, Harbour may reach out to your community on your behalf.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
