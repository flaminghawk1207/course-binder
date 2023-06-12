import { getCurrDirObject } from "~/Components/CourseView";
import { FirebaseFolder } from "~/types";
import '@testing-library/jest-dom'

describe('getCurrDirObject', () => {
  const completeDir: FirebaseFolder = {
    name: 'root',
    fullPath: '/',
    type: 'folder',
    children: [
      {
        name: 'folder1',
        fullPath: '/folder1',
        type: 'folder',
        children: [
          {
            name: 'file1',
            fullPath: '/folder1/file1',
            type: 'file',
            empty: false,
            downloadURL: 'https://example.com/file1',
          },
        ],
      },
    ],
  };

  it('returns null if completeDir is falsy', () => {
    expect(getCurrDirObject({} as FirebaseFolder, ['folder1', 'file1'])).toBeNull();
  });

  it('returns null if path is empty', () => {
    expect(getCurrDirObject(completeDir, [])).toBe(completeDir);
  });

  it('returns the current directory object when found', () => {
    const result = getCurrDirObject(completeDir, ['folder1']);
    expect(result).toEqual({
      name: 'folder1',
      fullPath: '/folder1',
      type: 'folder',
      children: [
        {
          name: 'file1',
          fullPath: '/folder1/file1',
          type: 'file',
          empty: false,
          downloadURL: 'https://example.com/file1',
        },
      ],
    });
  });

  it('returns the file object when the path includes both folder and file', () => {
    const result = getCurrDirObject(completeDir, ['folder1', 'file1']);
    expect(result).toEqual({
      name: 'file1',
      fullPath: '/folder1/file1',
      type: 'file',
      empty: false,
      downloadURL: 'https://example.com/file1',
    });
  });
});
