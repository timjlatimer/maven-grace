/**
 * Pulse Zone Shared Components — Runner B
 * Reusable, composable UI primitives for all Pulse Zone screens.
 */
import React, { memo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import { PULSE_THEME } from "./theme";

// ─── Back Navigation ────────────────────────────────────────────────────────

interface BackNavProps {
  readonly label: string;
  readonly route: string;
}

export const BackNav = memo(function BackNav({ label, route }: BackNavProps) {
  const [, navigate] = useLocation();
  return (
    <button
      onClick={() => navigate(route)}
      className="flex items-center gap-1 mb-2"
      style={{ color: PULSE_THEME.accent.amber }}
    >
      <ChevronLeft className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
});

// ─── Section Header ─────────────────────────────────────────────────────────

interface SectionHeaderProps {
  readonly title: string;
  readonly color?: string;
}

export const SectionHeader = memo(function SectionHeader({
  title,
  color = PULSE_THEME.accent.amber,
}: SectionHeaderProps) {
  return (
    <h3 className="font-bold text-xs tracking-wider mb-3" style={{ color }}>
      {title}
    </h3>
  );
});

// ─── Screen Container ───────────────────────────────────────────────────────

interface ScreenContainerProps {
  readonly children: React.ReactNode;
  readonly bg?: string;
}

export const ScreenContainer = memo(function ScreenContainer({
  children,
  bg = PULSE_THEME.bg.primary,
}: ScreenContainerProps) {
  return (
    <div className="min-h-screen pb-8" style={{ background: bg }}>
      {children}
    </div>
  );
});

// ─── Screen Header ──────────────────────────────────────────────────────────

interface ScreenHeaderProps {
  readonly backLabel: string;
  readonly backRoute: string;
  readonly title: string;
  readonly subtitle?: string;
}

export const ScreenHeader = memo(function ScreenHeader({
  backLabel,
  backRoute,
  title,
  subtitle,
}: ScreenHeaderProps) {
  return (
    <div className="pt-12 px-4">
      <BackNav label={backLabel} route={backRoute} />
      <h1 className="text-3xl font-bold text-white leading-tight">{title}</h1>
      {subtitle && (
        <p className="text-white/50 text-sm mt-1">{subtitle}</p>
      )}
    </div>
  );
});

// ─── CTA Button ─────────────────────────────────────────────────────────────

interface CTAButtonProps {
  readonly label: string;
  readonly route: string;
  readonly color?: string;
  readonly subtitle?: string;
}

export const CTAButton = memo(function CTAButton({
  label,
  route,
  color = PULSE_THEME.accent.rose,
  subtitle,
}: CTAButtonProps) {
  const [, navigate] = useLocation();
  return (
    <div className="px-4 mt-6">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(route)}
        className="w-full py-4 rounded-2xl text-white font-bold text-lg"
        style={{ background: color }}
      >
        {label}
      </motion.button>
      {subtitle && (
        <p className="text-white/30 text-center text-xs mt-2">{subtitle}</p>
      )}
    </div>
  );
});

// ─── Philosophy Block ───────────────────────────────────────────────────────

interface PhilosophyBlockProps {
  readonly text: string;
}

export const PhilosophyBlock = memo(function PhilosophyBlock({ text }: PhilosophyBlockProps) {
  return (
    <div className="px-4 mt-6">
      <SectionHeader title="THE PHILOSOPHY" />
      <div
        className="rounded-xl p-4"
        style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.warm}` }}
      >
        <p className="text-white/60 text-sm leading-relaxed italic">{text}</p>
      </div>
    </div>
  );
});

// ─── Feature Check Item ─────────────────────────────────────────────────────

interface FeatureCheckProps {
  readonly text: string;
  readonly isAvailable: boolean;
}

export const FeatureCheck = memo(function FeatureCheck({ text, isAvailable }: FeatureCheckProps) {
  return (
    <div
      className="rounded-xl p-3 flex items-start gap-3"
      style={{ background: PULSE_THEME.bg.card, border: `1px solid ${PULSE_THEME.border.subtle}` }}
    >
      <Check
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        style={{ color: isAvailable ? PULSE_THEME.accent.teal : PULSE_THEME.text.muted }}
      />
      <p className="text-white/60 text-sm">{text}</p>
    </div>
  );
});

// ─── Total Bar ──────────────────────────────────────────────────────────────

interface TotalBarProps {
  readonly label: string;
  readonly value: string;
  readonly borderColor?: string;
}

export const TotalBar = memo(function TotalBar({
  label,
  value,
  borderColor = PULSE_THEME.accent.amber,
}: TotalBarProps) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ border: `1px solid ${borderColor}` }}
    >
      <span className="text-white/60 text-sm">{label}: </span>
      <span className="text-white font-bold text-lg">{value}</span>
    </div>
  );
});
