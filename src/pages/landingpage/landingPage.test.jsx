import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './landingPage';
import Banner from '../../components/banner/banner';
import '@testing-library/jest-dom';

// Mock du composant Banner
jest.mock('../../components/banner/banner', () => () => <div>Banner Component</div>);

describe('Home component', () => {
  // Test 1: Vérifie que le composant Banner est rendu
  test('renders the Banner component', () => {
    render(<Home />);

    // Vérifie que le composant Banner est affiché
    expect(screen.getByText('Banner Component')).toBeInTheDocument();
  });
});
