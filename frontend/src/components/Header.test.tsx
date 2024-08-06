import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

describe('Header', () => {
  it('renders the header with correct classes', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('navbar', 'bg-base-100');
  });

  it('renders the TAVERNS link', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const link = screen.getByRole('link', { name: /TAVERNS/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass('btn', 'btn-ghost', 'normal-case', 'text-xl');
  });


  it('has a hidden navbar-center div for larger screens', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const navbarCenter = document.querySelector('.navbar-center');
    expect(navbarCenter).toBeInTheDocument();
    expect(navbarCenter).toHaveClass('hidden', 'lg:flex');
  });
});