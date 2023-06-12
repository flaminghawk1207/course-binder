import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { task } from '~/types';
import { TaskItem } from '~/Components/taskManager';
import '@testing-library/jest-dom';

describe('TaskItem', () => {
  const mockTask: task = {
    channelCode: 'channel1',
    assignedByEmail: 'email1',
    assignedByName: 'name1',
    assignedToEmail: 'email2',
    assignedToName: 'name2',
    taskName: 'Task 1',
    dueTime: 1626400000,
    taskStatus: 'Pending',
  };

  const mockUpdateTaskLists = jest.fn();

  it('renders the task name correctly', () => {
    const { getByText } = render(
      <TaskItem task={mockTask} updateTaskLists={mockUpdateTaskLists} mentor_view={false} />
    );

    const taskNameElement = getByText('Task 1');
    expect(taskNameElement).toBeInTheDocument();
  });
});
