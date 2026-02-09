import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KPICard } from '../KPICard';
import { Home } from 'lucide-react';

// Mock CountUp to avoid animation issues
vi.mock('react-countup', () => ({
    default: ({ end, prefix, suffix, separator }: any) => (
        <span>{prefix}{end.toLocaleString()}{suffix}</span>
    ),
}));

describe('KPICard', () => {
    it('renders basic info', () => {
        render(
            <KPICard
                title="Total Users"
                value={1234}
                icon={Home}
                trend={{ value: 10, isPositive: true }}
            />
        );

        expect(screen.getByText('Total Users')).toBeDefined();
        // CountUp mock renders this
        expect(screen.getByText(/1,234/)).toBeDefined();
        // Trend
        expect(screen.getByText(/10%/)).toBeDefined();
    });

    it('renders prefix and suffix correctly', () => {
        render(
            <KPICard
                title="Revenue"
                value={5000}
                icon={Home}
                prefix="$"
                suffix=" USD"
            />
        );

        // Find the specific number rendered by CountUp
        const numberElement = screen.getByText('5,000');
        const container = numberElement.closest('.text-display-md'); // Or just parentElement

        expect(container).toBeDefined();
        expect(container?.textContent).toContain('$');
        expect(container?.textContent).toContain('5,000');
        expect(container?.textContent).toContain('USD');
    });

    it('renders negative trend with error color', () => {
        render(
            <KPICard
                title="Churn"
                value={5}
                icon={Home}
                trend={{ value: -2, isPositive: false }}
            />
        );

        const trendEl = screen.getByText(/2%/);
        expect(trendEl.className).toContain('text-error');
    });

    it('renders positive trend with success color', () => {
        render(
            <KPICard
                title="Growth"
                value={5}
                icon={Home}
                trend={{ value: 5, isPositive: true }}
            />
        );

        const trendEl = screen.getByText(/5%/);
        expect(trendEl.className).toContain('text-success');
    });
});
