import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders cricket scenario poll dashboard', () => {
  render(<App />);
  expect(screen.getByText(/Cricket Scenario Poll Dashboard/i)).toBeInTheDocument();
});

test('form inputs render', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/Mumbai vs Chennai/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/V Kohli/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/J Bumrah/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/16.4/i)).toBeInTheDocument();
});
