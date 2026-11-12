"use client";

import { Component, type ReactNode } from "react";

/**
 * Keeps one broken frame from taking the section down with it. If the model
 * throws — no WebGL context, a driver that lies about its capabilities, an
 * extension missing — the drawing is shown instead.
 */
export class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[live-section] 3D unavailable, falling back to the drawing", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
