// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from './home-page';

describe('customer application shell', () => {
  it('renders the SERV HUB introduction', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: 'Every Service. One Platform.' })).toBeTruthy();
  });
});
