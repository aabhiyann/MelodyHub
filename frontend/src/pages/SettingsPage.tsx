import Topbar from "@/components/layout/TopBar";
import { UserProfile } from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Smartphone } from "lucide-react";
import { AccessibilitySettings } from "./settings/AccessibilitySettings";
import { useState } from "react";

const SettingsPage = () => {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [privateEnabled, setPrivateEnabled] = useState(false);

    return (
        <div className="h-full bg-transparent rounded-lg overflow-hidden flex flex-col">
            <Topbar />

            <ScrollArea className="flex-1 w-full">
                <div className="p-6 max-w-4xl mx-auto space-y-8 pb-32 md:pb-20">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
                        <p className="text-text-secondary">Manage your account and app preferences</p>
                    </div>

                    {/* App Preferences */}
                    <div className="grid gap-6">
                        {/* Appearance Section Removed - App is Dark Mode only */}


                        {/* Accessibility Settings */}
                        <AccessibilitySettings />

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                                <Bell className="size-5 text-brand-primary" />
                                Notifications
                            </h2>
                            <div className="bg-surface-card border border-white/5 rounded-xl p-4 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-text-primary">Push Notifications</Label>
                                        <p className="text-sm text-text-secondary">Receive alerts about new messages and invites</p>
                                    </div>
                                    <Switch
                                        checked={pushEnabled}
                                        onCheckedChange={setPushEnabled}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-text-primary">Email Updates</Label>
                                        <p className="text-sm text-text-secondary">Get weekly digests of new music</p>
                                    </div>
                                    <Switch
                                        checked={emailEnabled}
                                        onCheckedChange={setEmailEnabled}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                                <Shield className="size-5 text-brand-primary" />
                                Privacy
                            </h2>
                            <div className="bg-surface-card border border-white/5 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-text-primary">Private Profile</Label>
                                        <p className="text-sm text-text-secondary">Only friends can see your listening activity</p>
                                    </div>
                                    <Switch
                                        checked={privateEnabled}
                                        onCheckedChange={setPrivateEnabled}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Clerk Profile Management */}
                    <div className="pt-6">
                        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                            <Smartphone className="size-5 text-brand-primary" />
                            Account
                        </h2>
                        <div className="bg-surface-card border border-white/5 rounded-xl p-6 flex justify-center">
                            <UserProfile
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "bg-transparent shadow-none w-full",
                                        navbar: "hidden",
                                        navbarMobileMenuButton: "hidden",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

export default SettingsPage;
