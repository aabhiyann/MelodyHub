import { useState, useEffect } from 'react';
import { User } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedUser: User) => void;
}

export const EditProfileModal = ({ user, isOpen, onClose, onUpdate }: EditProfileModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        isPrivate: user.isPrivate || false,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                fullName: user.fullName || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                isPrivate: user.isPrivate || false,
            });
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axiosInstance.put('/users/profile', formData);
            if (response.data.success) {
                onUpdate(response.data.data);
                toast.success('Profile updated successfully');
                onClose();
            }
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[#101019] border-[#1F2933] text-[#F9FAFB]">
                <DialogHeader>
                    <DialogTitle className="text-[#F9FAFB]">Edit Profile</DialogTitle>
                    <DialogDescription className="text-[#9CA3AF]">
                        Make changes to your public profile here.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#9CA3AF]">Name</Label>
                        <Input
                            id="name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="bg-[#1F2933] border-[#1F2933] text-[#F9FAFB] placeholder:text-[#6B7280] focus-visible:ring-[#22C55E]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[#9CA3AF]">Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="bg-[#1F2933] border-[#1F2933] text-[#F9FAFB] placeholder:text-[#6B7280] focus-visible:ring-[#22C55E] resize-none"
                            placeholder="Tell a bit about yourself..."
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-[#9CA3AF]">Location</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="bg-[#1F2933] border-[#1F2933] text-[#F9FAFB] placeholder:text-[#6B7280] focus-visible:ring-[#22C55E]"
                            placeholder="City, Country"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website" className="text-[#9CA3AF]">Website</Label>
                        <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="bg-[#1F2933] border-[#1F2933] text-[#F9FAFB] placeholder:text-[#6B7280] focus-visible:ring-[#22C55E]"
                            placeholder="https://..."
                        />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                            <Label htmlFor="private-mode" className="text-[#9CA3AF]">Private Account</Label>
                            <p className="text-xs text-[#6B7280]">Only approved followers can see your activity</p>
                        </div>
                        <Switch
                            id="private-mode"
                            checked={formData.isPrivate}
                            onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="border-[#1F2933] text-[#9CA3AF] hover:bg-[#1F2933] hover:text-[#F9FAFB]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            isLoading={isLoading}
                            className="bg-[#22C55E] text-[#020617] hover:bg-[#16A34A]"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
