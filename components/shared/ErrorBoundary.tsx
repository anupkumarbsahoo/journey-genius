"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-64 p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-center gap-4">
            <AlertTriangle className="w-12 h-12 text-destructive" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Something went wrong</h3>
              <p className="text-muted-foreground text-sm">{this.state.error?.message}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
