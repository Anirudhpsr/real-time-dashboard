import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';

jest.useFakeTimers();

describe('Dashboard Component', () => {
  test('renders the dashboard with default elements', () => {
    render(<Dashboard />);

    // Check if the title is rendered
    expect(screen.getByText('Real-Time Dashboard')).toBeInTheDocument();

    // Check if the "Last updated" text is rendered
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();

    // Check if the "Real-time Data" section is rendered
    expect(screen.getByText('Real-time Data')).toBeInTheDocument();

    // Check if the "Historical Data" section is rendered
    expect(screen.getByText('Historical Data')).toBeInTheDocument();
  });

  test('toggles between WebSocket and Polling', () => {
    render(<Dashboard />);

    // Check initial state (WebSocket active)
    expect(screen.getByText('Using WebSocket')).toBeInTheDocument();

    // Click the toggle button
    fireEvent.click(screen.getByText('Using WebSocket'));

    // Check updated state (Polling active)
    expect(screen.getByText('Using Polling (30s)')).toBeInTheDocument();
  });

  // Ensure act wraps the WebSocket error simulation
  test('displays WebSocket error message when WebSocket fails', async () => {
    render(<Dashboard />);

    await act(async () => {
      const ws = new WebSocket('ws://localhost');
      ws.onerror = jest.fn(); // Prevent recursion
      ws.dispatchEvent(new Event('error'));
    });

    // Use a more flexible matcher for the error message
    const errorMessage = await screen.findByText(/WebSocket connection failed/i);

    expect(errorMessage).toBeInTheDocument();
  });

  test('displays loading state for historical data', () => {
    render(<Dashboard />);

    // Check if the loading message is displayed
    expect(screen.getByText('Loading historical data...')).toBeInTheDocument();
  });

  test('displays historical data after fetching', async () => {
    render(<Dashboard />);

    // Simulate fetching historical data
    act(() => {
      jest.advanceTimersByTime(1000); // Simulate 1 second delay
    });

    // Check if historical data is displayed
    expect(screen.getByText(/Timestamp/)).toBeInTheDocument();
    expect(screen.getByText(/Value/)).toBeInTheDocument();
    expect(screen.getByText(/Status/)).toBeInTheDocument();
  });

  test('displays warning points correctly', () => {
    render(<Dashboard />);

    // Check if the warning points are displayed
    const warningPoints = screen.getByText(/Warning Points/);
    expect(warningPoints).toBeInTheDocument();
  });

  test('toggles dark mode', () => {
    render(<Dashboard />);

    // Check initial state (light mode)
    expect(screen.getByText('🌙')).toBeInTheDocument();

    // Click the toggle button
    fireEvent.click(screen.getByText('🌙'));

    // Check updated state (dark mode)
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });
});