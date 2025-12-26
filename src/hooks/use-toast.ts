"use client";

import * as React from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastState = {
  toasts: Toast[];
};

const listeners: Array<(state: ToastState) => void> = [];
let state: ToastState = { toasts: [] };
let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function emit() {
  listeners.forEach((l) => l(state));
}

export function toast(toast: Omit<Toast, "id">) {
  const id = genId();
  state = { toasts: [{ id, ...toast }] };
  emit();

  setTimeout(() => {
    state = { toasts: [] };
    emit();
  }, 3000);
}

export function useToast() {
  const [local, setLocal] = React.useState(state);

  React.useEffect(() => {
    listeners.push(setLocal);
    return () => {
      const i = listeners.indexOf(setLocal);
      if (i > -1) listeners.splice(i, 1);
    };
  }, []);

  return { ...local, toast };
}
