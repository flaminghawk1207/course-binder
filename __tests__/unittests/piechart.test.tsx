import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DisplayPieChart } from '~/Components/analyticsView';
import { PercentageDict } from '~/types';
import '@testing-library/jest-dom'

describe('DisplayPieChart', () => {
  const child: PercentageDict = {
    levelElementName: 'Test Level',
    levelPercentage: 60,
    children: [],
  };

  it('renders the pie chart with the provided title', () => {
    render(<DisplayPieChart child={child} updateLevelPointer={jest.fn()} />);
    const chartTitle = screen.getByText(child.levelElementName);
    expect(chartTitle).toBeInTheDocument();
  });

  it('renders the pie chart with the correct data', () => {
    render(<DisplayPieChart child={child} updateLevelPointer={jest.fn()} />);

    const uploadedData = screen.getByText(`Uploaded: ${child.levelPercentage}`);
    expect(uploadedData).toBeInTheDocument();

    const pendingPercentage = 100 - child.levelPercentage;
    const pendingData = screen.getByText(`Pending: ${pendingPercentage}`);
    expect(pendingData).toBeInTheDocument();
  });
});
