import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-primary');
    });

    it('renders with different variants', () => {
        const { rerender } = render(<Button variant="destructive">Delete</Button>);
        let button = screen.getByRole('button', { name: /delete/i });
        expect(button).toHaveClass('bg-destructive');

        rerender(<Button variant="outline">Outline</Button>);
        button = screen.getByRole('button', { name: /outline/i });
        expect(button).toHaveClass('border-input');
    });

    it('renders with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        let button = screen.getByRole('button', { name: /small/i });
        expect(button).toHaveClass('h-8');

        rerender(<Button size="lg">Large</Button>);
        button = screen.getByRole('button', { name: /large/i });
        expect(button).toHaveClass('h-10');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: /disabled/i });
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:opacity-50');
    });

    it('renders as a child component when asChild is true', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        const link = screen.getByRole('link', { name: /link button/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/test');
        expect(link).toHaveClass('bg-primary'); // Should still have button styles
    });
});
