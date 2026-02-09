import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../dialog';

describe('Dialog Component', () => {
    // Note: Radix UI relies on Pointer Events which might need polyfills or specific setup in JSDOM,
    // but basic rendering often works. If not, we might need to mock @radix-ui/react-dialog.
    // For now, let's try testing the composition.

    it('renders trigger and opens dialog on click', () => {
        render(
            <Dialog>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                        <DialogDescription>Dialog Description</DialogDescription>
                    </DialogHeader>
                    <div>Dialog Body</div>
                    <DialogFooter>
                        <DialogClose>Close</DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );

        // Check trigger
        const trigger = screen.getByText('Open Dialog');
        expect(trigger).toBeDefined();

        // Content should not be visible initially (Radix unmounts or hides)
        expect(screen.queryByText('Dialog Title')).toBeNull();

        // Open
        fireEvent.click(trigger);

        // Content should be visible
        // Radix UI renders via Portal, so it should appear in document.body
        expect(screen.getByText('Dialog Title')).toBeDefined();
        expect(screen.getByText('Dialog Description')).toBeDefined();
        expect(screen.getByText('Dialog Body')).toBeDefined();
    });
});
