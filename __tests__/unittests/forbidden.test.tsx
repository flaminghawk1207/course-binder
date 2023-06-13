import React from 'react';
import { render, screen } from '@testing-library/react';
import { Forbidden } from '~/Components/forbidden';
import '@testing-library/jest-dom'

describe('Forbidden', () => {
  it('renders the "Forbidden" message correctly', () => {
    render(<Forbidden />);

    const forbiddenHeading = screen.getByText('Forbidden');
    expect(forbiddenHeading).toBeInTheDocument();

    const notAuthorizedMessage = screen.getByText('You are not authorised to view this page');
    expect(notAuthorizedMessage).toBeInTheDocument();
  });

  it('renders the "Go Home" button correctly', () => {
    render(<Forbidden />);

    const goHomeButton = screen.getByText('Go Home');
    expect(goHomeButton).toBeInTheDocument();
    expect(goHomeButton).toHaveAttribute('href', '/');
  });
});
