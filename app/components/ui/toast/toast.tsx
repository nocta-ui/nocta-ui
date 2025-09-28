"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icons } from "@/app/components/ui/icons/icons";
import { cn } from "@/lib/utils";

const POSITION_CONFIGS = {
  "top-left": {
    animateIn: { x: -100, y: -20 },
    animateOut: { x: -100, y: -20 },
  },
  "top-center": {
    animateIn: { x: 0, y: -100 },
    animateOut: { x: 0, y: -100 },
  },
  "top-right": {
    animateIn: { x: 100, y: -20 },
    animateOut: { x: 100, y: -20 },
  },
  "bottom-left": {
    animateIn: { x: -100, y: 20 },
    animateOut: { x: -100, y: 100 },
  },
  "bottom-center": {
    animateIn: { x: 0, y: 100 },
    animateOut: { x: 0, y: 100 },
  },
  "bottom-right": {
    animateIn: { x: 100, y: 20 },
    animateOut: { x: 100, y: 100 },
  },
} as const;

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "a[href]",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const ANIMATION_CONFIG = {
  ENTER_DURATION: 2.0,
  EXIT_DURATION: 0.45,
  STACK_DURATION: 0.5,
  STACK_OFFSET: 16,
  EXPANDED_GAP: 12,
  SCALE_FACTOR: 0.04,
  MIN_SCALE: 0.92,
  MAX_VISIBLE_TOASTS: 3,
  Z_INDEX_BASE: 50,
  EASING_DEFAULT: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  EASING_EXIT: "cubic-bezier(0.25, 0.1, 0.25, 1)",
} as const;

type ToastSubscriber = (toasts: ToastData[]) => void;

class ToastState {
  private toasts: ToastData[] = [];
  private subscribers: Set<ToastSubscriber> = new Set();
  private idCounter = 0;

  subscribe(callback: ToastSubscriber): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach((callback) => {
      callback([...this.toasts]);
    });
  }

  private generateId(): string {
    return `toast-${Date.now()}-${++this.idCounter}`;
  }

  add(data: Omit<ToastData, "id">): string {
    const id = this.generateId();
    const newToast: ToastData = { ...data, id };
    this.toasts = [newToast, ...this.toasts];
    this.notify();
    return id;
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notify();
  }

  update(id: string, data: Partial<ToastData>): void {
    this.toasts = this.toasts.map((toast) =>
      toast.id === id ? { ...toast, ...data } : toast,
    );
    this.notify();
  }

  dismissAll(): void {
    this.toasts = this.toasts.map((toast) => ({
      ...toast,
      shouldClose: true,
      duration: 0,
    }));
    this.notify();
  }

  getToasts(): ToastData[] {
    return [...this.toasts];
  }
}

const toastState = new ToastState();

class ToasterInstanceManager {
  private activeInstanceId: string | null = null;
  private instanceCounter = 0;

  registerInstance(): string {
    const instanceId = `toaster-${++this.instanceCounter}`;
    if (!this.activeInstanceId) {
      this.activeInstanceId = instanceId;
    }
    return instanceId;
  }

  unregisterInstance(instanceId: string): void {
    if (this.activeInstanceId === instanceId) {
      this.activeInstanceId = null;
    }
  }

  isActiveInstance(instanceId: string): boolean {
    return this.activeInstanceId === instanceId;
  }
}

const toasterInstanceManager = new ToasterInstanceManager();

const toastContainerVariants = cva(
  "not-prose pointer-events-auto fixed rounded-lg border border-none shadow-2xl backdrop-blur-lg transition-all duration-200 ease-in-out will-change-transform dark:border-solid",
  {
    variants: {
      position: {
        "top-left": "top-4 left-4 w-full max-w-sm",
        "top-center":
          "top-4 left-1/2 w-full max-w-sm -translate-x-1/2 transform",
        "top-right": "top-4 right-4 w-full max-w-sm",
        "bottom-left": "bottom-4 left-4 w-full max-w-sm",
        "bottom-center":
          "bottom-4 left-1/2 w-full max-w-sm -translate-x-1/2 transform",
        "bottom-right": "right-4 bottom-4 w-full max-w-sm",
      },
      variant: {
        default: "overflow-hidden border-border bg-card-muted text-foreground",
        success: "border-border bg-card-muted text-success/90",
        warning: "border-border bg-card-muted text-warning/90",
        destructive: "border-border bg-card-muted text-error/90",
      },
    },
    defaultVariants: {
      position: "bottom-center",
      variant: "default",
    },
  },
);

const toastContentVariants = cva("relative overflow-hidden rounded-lg", {
  variants: {
    variant: {
      default: "",
      success: "",
      warning: "",
      destructive: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastData extends VariantProps<typeof toastContainerVariants> {
  id: string;
  title?: string;
  description?: string;
  className?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  shouldClose?: boolean;
}

export const toast = (data: Omit<ToastData, "id"> | string): string => {
  if (typeof data === "string") {
    return toastState.add({ description: data });
  }
  return toastState.add(data);
};

toast.success = (data: Omit<ToastData, "id" | "variant"> | string): string => {
  if (typeof data === "string") {
    return toastState.add({ description: data, variant: "success" });
  }
  return toastState.add({ ...data, variant: "success" });
};

toast.warning = (data: Omit<ToastData, "id" | "variant"> | string): string => {
  if (typeof data === "string") {
    return toastState.add({ description: data, variant: "warning" });
  }
  return toastState.add({ ...data, variant: "warning" });
};

toast.error = (data: Omit<ToastData, "id" | "variant"> | string): string => {
  if (typeof data === "string") {
    return toastState.add({ description: data, variant: "destructive" });
  }
  return toastState.add({ ...data, variant: "destructive" });
};

toast.dismiss = (id: string): void => {
  toastState.update(id, { shouldClose: true });
};

toast.dismissAll = (): void => {
  toastState.dismissAll();
};

interface ToastItemProps {
  toast: ToastData & { index: number; total: number };
  onRemove: (id: string) => void;
  isGroupHovered?: boolean;
  expandedOffset?: number;
  onHeightChange?: (id: string, height: number) => void;
  onGroupHoverEnter?: () => void;
}

const ToastItem: React.FC<ToastItemProps> = React.memo(
  ({
    toast,
    onRemove,
    isGroupHovered = false,
    expandedOffset = 0,
    onHeightChange,
    onGroupHoverEnter,
  }) => {
    const toastRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timerStartRef = useRef<number | null>(null);
    const remainingRef = useRef<number>(Number.NaN);
    const enterAnimationRef = useRef<number | null>(null);
    const isExiting = useRef(false);
    const hasAnimatedIn = useRef(false);
    const [isItemHovered, setIsItemHovered] = useState(false);
    const [animationState, setAnimationState] = useState<
      "entering" | "entered" | "exiting" | "stacking"
    >("entering");

    const {
      id,
      title,
      description,
      variant = "default",
      duration = 5000,
      action,
      index,
      shouldClose,
      position = "bottom-center",
      className = "",
      onClose,
    } = toast;

    const titleId = title ? `${id}-title` : undefined;
    const descriptionId = description ? `${id}-desc` : undefined;
    const liveRole = variant === "destructive" ? "alert" : "status";
    const livePoliteness = variant === "destructive" ? "assertive" : "polite";

    const config = POSITION_CONFIGS[position as keyof typeof POSITION_CONFIGS];

    useLayoutEffect(() => {
      if (!toastRef.current) return;
      const el = toastRef.current;
      const notify = () => {
        if (!onHeightChange) return;
        onHeightChange(id, el.offsetHeight);
      };
      notify();
      const ro = new ResizeObserver(() => notify());
      ro.observe(el);
      return () => ro.disconnect();
    }, [id, onHeightChange]);

    const getFocusableElements = useCallback(() => {
      if (!toastRef.current) return [];
      return Array.from(
        toastRef.current.querySelectorAll(FOCUSABLE_SELECTORS),
      ) as HTMLElement[];
    }, []);

    const handleTransitionEnd = useCallback(
      (e: React.TransitionEvent) => {
        if (e.target !== toastRef.current) return;
        if (e.propertyName !== "opacity") return;

        if (animationState === "exiting") {
          onClose?.();
          onRemove(id);
        }
      },
      [animationState, id, onRemove, onClose],
    );

    const handleClose = useCallback(() => {
      if (!toastRef.current || isExiting.current) return;

      isExiting.current = true;

      if (enterAnimationRef.current) {
        cancelAnimationFrame(enterAnimationRef.current);
        enterAnimationRef.current = null;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setAnimationState("exiting");
    }, []);

    useEffect(() => {
      if (shouldClose) {
        handleClose();
      }
    }, [shouldClose, handleClose]);

    useLayoutEffect(() => {
      if (!toastRef.current || isExiting.current) return;

      const element = toastRef.current;
      const isLatest = index === 0;

      const setFocusToToast = () => {
        if (!isLatest) return;
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          element.focus();
        }
      };

      if (!hasAnimatedIn.current && isLatest) {
        hasAnimatedIn.current = true;
        setAnimationState("entering");

        enterAnimationRef.current = requestAnimationFrame(() => {
          enterAnimationRef.current = requestAnimationFrame(() => {
            setAnimationState("entered");
            if (action) {
              setTimeout(
                setFocusToToast,
                ANIMATION_CONFIG.ENTER_DURATION * 1000,
              );
            }
          });
        });
      } else if (hasAnimatedIn.current) {
        if (animationState !== "stacking" || index > 0) {
          setAnimationState("stacking");
        }

        if (index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS) {
          setTimeout(
            () => onRemove(id),
            ANIMATION_CONFIG.STACK_DURATION * 1000,
          );
        }
      } else {
        setAnimationState("stacking");

        if (index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS) {
          setTimeout(
            () => onRemove(id),
            ANIMATION_CONFIG.STACK_DURATION * 1000,
          );
        }
      }
    }, [index, id, onRemove, getFocusableElements, animationState, action]);

    useEffect(() => {
      if (shouldClose || !hasAnimatedIn.current) return;
      if (duration <= 0) return;

      if (remainingRef.current == null || Number.isNaN(remainingRef.current)) {
        remainingRef.current = duration;
      }

      const isPaused = isGroupHovered || isItemHovered;
      if (isPaused) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (timerStartRef.current !== null) {
          const elapsed = Date.now() - timerStartRef.current;
          remainingRef.current = Math.max(0, remainingRef.current - elapsed);
          timerStartRef.current = null;
        }
        return;
      }

      if (!timeoutRef.current) {
        const ms = Math.max(0, remainingRef.current ?? duration);
        if (ms === 0) {
          handleClose();
          return;
        }
        timerStartRef.current = Date.now();
        timeoutRef.current = setTimeout(() => {
          handleClose();
        }, ms);
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          if (timerStartRef.current !== null) {
            const elapsed = Date.now() - timerStartRef.current;
            remainingRef.current = Math.max(0, remainingRef.current - elapsed);
          }
          timeoutRef.current = null;
          timerStartRef.current = null;
        }
      };
    }, [duration, shouldClose, handleClose, isGroupHovered, isItemHovered]);

    useEffect(() => {
      remainingRef.current = duration;
    }, [duration]);

    useEffect(() => {
      return () => {
        if (enterAnimationRef.current) {
          cancelAnimationFrame(enterAnimationRef.current);
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const isTopPosition = position?.startsWith("top-");
    const offset = isTopPosition
      ? index * ANIMATION_CONFIG.STACK_OFFSET
      : -(index * ANIMATION_CONFIG.STACK_OFFSET);
    const scale = Math.max(
      ANIMATION_CONFIG.MIN_SCALE,
      1 - index * ANIMATION_CONFIG.SCALE_FACTOR,
    );
    const zIndex = ANIMATION_CONFIG.Z_INDEX_BASE - index;
    const isLatest = index === 0;

    const transformStyle = useMemo(() => {
      if (isGroupHovered && animationState !== "exiting") {
        const expandedTranslate = isTopPosition
          ? `${expandedOffset}`
          : `${-expandedOffset}`;
        return {
          transform: `translate(0px, ${expandedTranslate}px) scale(1)`,
          opacity: 1,
        };
      }

      switch (animationState) {
        case "entering":
          return {
            transform: `translate(${config.animateIn.x}px, ${config.animateIn.y}px)`,
            opacity: 0,
          };
        case "entered":
          return {
            transform: `translate(0px, ${offset}px)`,
            opacity: 1,
          };
        case "exiting":
          return {
            transform: `translate(${config.animateOut.x}px, ${config.animateOut.y}px)`,
            opacity: 0,
          };
        default:
          return {
            transform: `translate(0px, ${offset}px) scale(${isLatest ? 1 : scale})`,
            opacity: index >= ANIMATION_CONFIG.MAX_VISIBLE_TOASTS ? 0 : 1,
          };
      }
    }, [
      animationState,
      config.animateIn.x,
      config.animateIn.y,
      config.animateOut.x,
      config.animateOut.y,
      offset,
      isLatest,
      scale,
      index,
      isGroupHovered,
      expandedOffset,
      isTopPosition,
    ]);

    const transitionDuration = useMemo(() => {
      switch (animationState) {
        case "entering":
        case "entered":
          return `${ANIMATION_CONFIG.ENTER_DURATION}s`;
        case "exiting":
          return `${ANIMATION_CONFIG.EXIT_DURATION}s`;
        default:
          return `${ANIMATION_CONFIG.STACK_DURATION}s`;
      }
    }, [animationState]);

    const transitionTimingFunction = useMemo(() => {
      return animationState === "exiting"
        ? ANIMATION_CONFIG.EASING_EXIT
        : ANIMATION_CONFIG.EASING_DEFAULT;
    }, [animationState]);

    return (
      <div
        ref={toastRef}
        className={cn(toastContainerVariants({ position, variant }), className)}
        style={{
          transformOrigin: position?.startsWith("top-")
            ? "center top"
            : "center bottom",
          zIndex,
          transition: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
          ...transformStyle,
        }}
        role={liveRole}
        aria-live={livePoliteness}
        aria-atomic="true"
        aria-describedby={descriptionId}
        tabIndex={-1}
        onTransitionEnd={handleTransitionEnd}
        data-toast-id={id}
      >
        <div
          role="alert"
          onMouseEnter={() => {
            setIsItemHovered(true);
            onGroupHoverEnter?.();
          }}
          onMouseLeave={() => setIsItemHovered(false)}
          onFocusCapture={() => setIsItemHovered(true)}
          onBlurCapture={(e) => {
            const current = toastRef.current;
            const next = e.relatedTarget as Node | null;
            if (!current || !next || !current.contains(next)) {
              setIsItemHovered(false);
            }
          }}
        >
          <div className={cn(toastContentVariants({ variant }))}>
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "absolute top-2 right-2 cursor-pointer rounded-md p-1 text-foreground/45 transition-colors duration-200 ease-in-out hover:text-foreground/70 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none",
              )}
              aria-label="Close toast"
            >
              <Icons.X aria-hidden="true" className="h-4 w-4" />
            </button>

            <div className="p-4 pr-8">
              {title && (
                <div
                  id={titleId}
                  className="mb-1 text-sm leading-tight font-semibold"
                >
                  {title}
                </div>
              )}
              {description && (
                <div
                  id={descriptionId}
                  className="text-sm leading-relaxed text-foreground/70 opacity-80"
                >
                  {description}
                </div>
              )}
              {action && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      action.onClick();
                      handleClose();
                    }}
                    className="inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-linear-to-b from-gradient-1 to-gradient-2 inset-shadow-[0_1px_rgb(255_255_255/0.15)] hover:contrast-110 text-foreground shadow-md transition-all duration-200 focus-visible:ring-ring/50"
                  >
                    {action.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.toast.id === nextProps.toast.id &&
      prevProps.toast.index === nextProps.toast.index &&
      prevProps.toast.shouldClose === nextProps.toast.shouldClose &&
      prevProps.toast.total === nextProps.toast.total &&
      prevProps.isGroupHovered === nextProps.isGroupHovered &&
      prevProps.expandedOffset === nextProps.expandedOffset
    );
  },
);

ToastItem.displayName = "ToastItem";

const ToastManager: React.FC<{
  toasts: ToastData[];
  onRemove: (id: string) => void;
  expandedGap?: number;
}> = React.memo(
  ({ toasts, onRemove, expandedGap = ANIMATION_CONFIG.EXPANDED_GAP }) => {
    const [heights, setHeights] = useState<Record<string, number>>({});
    const [hovered, setHovered] = useState<Record<ToastPosition, boolean>>({
      "top-left": false,
      "top-center": false,
      "top-right": false,
      "bottom-left": false,
      "bottom-center": false,
      "bottom-right": false,
    });

    const toastsByPosition = useMemo(() => {
      const grouped = toasts.reduce(
        (acc, toast) => {
          const pos = toast.position || "bottom-center";
          if (!acc[pos]) acc[pos] = [];
          acc[pos].push(toast);
          return acc;
        },
        {} as Record<ToastPosition, ToastData[]>,
      );

      Object.keys(grouped).forEach((position) => {
        const positionKey = position as ToastPosition;
        grouped[positionKey] = grouped[positionKey].map((toast, index) => ({
          ...toast,
          index,
          total: grouped[positionKey].length,
        })) as (ToastData & { index: number; total: number })[];
      });

      return grouped as Record<
        ToastPosition,
        (ToastData & { index: number; total: number })[]
      >;
    }, [toasts]);

    useEffect(() => {
      setHovered((prev) => {
        let changed = false;
        const next = { ...prev };
        const positions = Object.keys(prev) as ToastPosition[];
        for (const pos of positions) {
          const hasToast = (toastsByPosition[pos]?.length ?? 0) > 0;
          if (!hasToast && next[pos]) {
            next[pos] = false;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, [toastsByPosition]);

    const positionEntries = useMemo(
      () => Object.entries(toastsByPosition),
      [toastsByPosition],
    );

    const expandedOffsetsByPosition = useMemo(() => {
      const result: Record<ToastPosition, number[]> = {
        "top-left": [],
        "top-center": [],
        "top-right": [],
        "bottom-left": [],
        "bottom-center": [],
        "bottom-right": [],
      };
      for (const [pos, group] of positionEntries as [
        ToastPosition,
        (ToastData & { index: number; total: number })[],
      ][]) {
        const offsets: number[] = [];
        let acc = 0;
        for (let i = 0; i < group.length; i++) {
          if (i === 0) {
            offsets.push(0);
            continue;
          }
          const prev = group[i - 1];
          const prevHeight = heights[prev.id] ?? 0;
          acc += prevHeight + expandedGap;
          offsets.push(acc);
        }
        result[pos] = offsets;
      }
      return result;
    }, [positionEntries, heights, expandedGap]);

    useEffect(() => {
      if (positionEntries.length === 0) return;

      const handler = (e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        const next: Record<ToastPosition, boolean> = { ...hovered } as Record<
          ToastPosition,
          boolean
        >;
        for (const [pos, group] of positionEntries as [
          ToastPosition,
          (ToastData & { index: number; total: number })[],
        ][]) {
          let top = Number.POSITIVE_INFINITY;
          let left = Number.POSITIVE_INFINITY;
          let right = Number.NEGATIVE_INFINITY;
          let bottom = Number.NEGATIVE_INFINITY;
          let any = false;
          for (const t of group) {
            const el = document.querySelector(
              `[data-toast-id="${t.id}"]`,
            ) as HTMLElement | null;
            if (!el) continue;
            const r = el.getBoundingClientRect();
            top = Math.min(top, r.top);
            left = Math.min(left, r.left);
            right = Math.max(right, r.right);
            bottom = Math.max(bottom, r.bottom);
            any = true;
          }

          if (!any) {
            next[pos] = false;
            continue;
          }

          const inside = x >= left && x <= right && y >= top && y <= bottom;
          next[pos] = inside;
        }
        const changed = Object.keys(next as Record<string, boolean>).some(
          (k) =>
            (next as Record<string, boolean>)[k] !==
            (hovered as Record<string, boolean>)[k],
        );
        if (changed) setHovered(next);
      };

      document.addEventListener("mousemove", handler);
      return () => document.removeEventListener("mousemove", handler);
    }, [hovered, positionEntries]);

    useEffect(() => {
      if (positionEntries.length === 0) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        for (const [, group] of positionEntries) {
          const latest = group?.[0];
          if (!latest) continue;

          const container = document.querySelector(
            `[data-toast-id="${latest.id}"]`,
          ) as HTMLElement | null;
          if (!container) continue;

          if (e.key === "Escape") {
            const active = document.activeElement as HTMLElement | null;
            if (active && container.contains(active)) {
              const closeBtn = container.querySelector(
                '[aria-label="Close toast"]',
              ) as HTMLButtonElement | null;
              if (closeBtn) {
                e.preventDefault();
                closeBtn.click();
              }
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [positionEntries]);

    if (toasts.length === 0) return null;

    return (
      <div className="pointer-events-none fixed inset-0 z-50">
        {positionEntries.map(([position, positionToasts]) => {
          const pos = position as ToastPosition;
          const expandedOffsets = expandedOffsetsByPosition[pos];
          const isHovered = hovered[pos];
          return (
            <React.Fragment key={position}>
              {positionToasts.map((toast, idx) => (
                <ToastItem
                  key={toast.id}
                  toast={toast}
                  onRemove={onRemove}
                  isGroupHovered={isHovered}
                  expandedOffset={expandedOffsets?.[idx] ?? 0}
                  onHeightChange={(id, h) =>
                    setHeights((prev) =>
                      prev[id] === h ? prev : { ...prev, [id]: h },
                    )
                  }
                  onGroupHoverEnter={() =>
                    setHovered((prev) => ({ ...prev, [pos]: true }))
                  }
                />
              ))}
            </React.Fragment>
          );
        })}
      </div>
    );
  },
);

ToastManager.displayName = "ToastManager";

export const Toaster: React.FC<{ expandedGap?: number }> = ({
  expandedGap,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [instanceId] = useState(() =>
    toasterInstanceManager.registerInstance(),
  );

  useEffect(() => {
    const unsubscribe = toastState.subscribe(setToasts);
    return () => {
      unsubscribe();
      toasterInstanceManager.unregisterInstance(instanceId);
    };
  }, [instanceId]);

  const handleRemove = useCallback((id: string) => {
    toastState.remove(id);
  }, []);

  if (!toasterInstanceManager.isActiveInstance(instanceId)) {
    return null;
  }

  return (
    <ToastManager
      toasts={toasts}
      onRemove={handleRemove}
      expandedGap={expandedGap}
    />
  );
};
