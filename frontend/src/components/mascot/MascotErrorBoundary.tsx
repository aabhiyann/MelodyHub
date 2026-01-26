import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class MascotErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleHome = () => {
        window.location.href = "/";
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="relative w-48 h-48 mb-8"
                    >
                        {/* Error Glow */}
                        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />

                        {/* Shaking Melody */}
                        <motion.img
                            src="/mascot/melody-404.png"
                            alt="Sad Melody"
                            className="w-full h-full object-contain relative z-10"
                            animate={{ x: [-5, 5, -5, 5, 0] }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-white mb-4">
                        Oops! Melody bumped into a wall.
                    </h1>

                    <p className="text-text-secondary max-w-md mb-8">
                        Something unexpected happened. Melody is looking into it, but in the meantime, try refreshing the page.
                    </p>

                    <div className="flex gap-4">
                        <Button
                            onClick={this.handleReload}
                            className="bg-brand-primary hover:bg-brand-primary/90 text-white flex items-center gap-2"
                        >
                            <RefreshCw className="size-4" />
                            Refresh Page
                        </Button>

                        <Button
                            variant="outline"
                            onClick={this.handleHome}
                            className="border-white/10 hover:bg-white/5 text-white flex items-center gap-2"
                        >
                            <Home className="size-4" />
                            Go Home
                        </Button>
                    </div>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mt-12 p-4 bg-black/50 rounded-lg text-left max-w-2xl w-full overflow-auto max-h-48 border border-white/10">
                            <code className="text-red-400 font-mono text-sm">
                                {this.state.error.toString()}
                            </code>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
