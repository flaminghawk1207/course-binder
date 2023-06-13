import { FolderComponent } from "~/Components/CourseView";
import { FirebaseFolder } from "~/types";
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

describe('FolderComponent', () => {
  const folder: FirebaseFolder = {
    name: 'folder1',
    fullPath: '/folder1',
    type: 'folder',
    children: [],
  };

  it('renders the folder name correctly', () => {
    const { getByText } = render(
      <FolderComponent folder={folder} moveIntoFolder={jest.fn()} />
    );

    const folderNameElement = getByText('folder1');
    expect(folderNameElement).toBeInTheDocument();
  });

  it('calls the moveIntoFolder function with the folder name when clicked', () => {
    const moveIntoFolderMock = jest.fn();
    const { getByText } = render(
      <FolderComponent folder={folder} moveIntoFolder={moveIntoFolderMock} />
    );

    const folderElement = getByText('folder1');
    fireEvent.click(folderElement);

    expect(moveIntoFolderMock).toHaveBeenCalledWith('folder1');
  });
});