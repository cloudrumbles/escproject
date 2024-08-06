import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from './Layout';

// Mock the Header and Footer components
vi.mock('./Header', () => ({
  default: () => <header data-testid="mock-header">Mock Header</header>
}));

vi.mock('./Footer', () => ({
  default: () => <footer data-testid="mock-footer">Mock Footer</footer>
}));

describe('Layout', () => {
  it('renders Header component', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders Footer component', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<Layout><div data-testid="child-content">Child Component</div></Layout>);
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders children content between Header and Footer', () => {
    render(<Layout><div data-testid="child-content">Child Component</div></Layout>);
    const layout = screen.getByTestId('mock-header').parentElement;
    expect(layout?.children[0]).toHaveAttribute('data-testid', 'mock-header');
    expect(layout?.children[1]).toBeInstanceOf(HTMLElement);
    expect(layout?.children[1].tagName).toBe('MAIN');
    expect(layout?.children[2]).toHaveAttribute('data-testid', 'mock-footer');
  });

  it('applies correct CSS class to the container', () => {
    render(<Layout>Test Content</Layout>);
    const container = screen.getByTestId('mock-header').parentElement;
    expect(container).toHaveClass('app-container');
  });
});