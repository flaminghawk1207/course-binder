import { FirebaseFile, FirebaseFolder, PercentageDict } from "~/types";
import { collapsePercentageDict, constructPercentageDictRecursive } from "~/utils";

describe('collapsePercentageDict', () => {
    it('returns correct percentage for empty file', () => {
        const file: FirebaseFile = {
            name: 'file1',
            fullPath: '/path/to/file1',
            empty: true,
            downloadURL: '',
            type: 'file',
        };
        const [uploaded, totalFiles] = collapsePercentageDict(file);
        expect(uploaded).toBe(0);
        expect(totalFiles).toBe(1);
    });

    it('returns correct percentage for non-empty file', () => {
        const file: FirebaseFile = {
            name: 'file1',
            fullPath: '/path/to/file1',
            empty: false,
            downloadURL: '',
            type: 'file',
        };
        const [uploaded, totalFiles] = collapsePercentageDict(file);
        expect(uploaded).toBe(1);
        expect(totalFiles).toBe(1);
    });

    it('returns correct percentage for folder with children', () => {
        const folder: FirebaseFolder = {
            name: 'folder1',
            fullPath: '/path/to/folder1',
            type: 'folder',
            children: [
                {
                    name: 'file1',
                    fullPath: '/path/to/folder1/file1',
                    empty: true,
                    downloadURL: '',
                    type: 'file',
                },
                {
                    name: 'file2',
                    fullPath: '/path/to/folder1/file2',
                    empty: false,
                    downloadURL: '',
                    type: 'file',
                },
            ],
        };
        const [uploaded, totalFiles] = collapsePercentageDict(folder);
        expect(uploaded).toBe(1);
        expect(totalFiles).toBe(2);
    });
});

describe('constructPercentageDictRecursive', () => {
    const file1: FirebaseFile = {
        name: 'file1.txt',
        fullPath: '/path/to/file1.txt',
        empty: false,
        downloadURL: 'https://example.com/file1.txt',
        type: 'file'
    };

    const file2: FirebaseFile = {
        name: 'file2.txt',
        fullPath: '/path/to/file2.txt',
        empty: true,
        downloadURL: 'https://example.com/file2.txt',
        type: 'file'
    };

    const folder1: FirebaseFolder = {
        name: 'folder1',
        fullPath: '/path/to/folder1',
        type: 'folder',
        children: [file1, file2]
    };

    const folder2: FirebaseFolder = {
        name: 'folder2',
        fullPath: '/path/to/folder2',
        type: 'folder',
        children: [folder1]
    };

    it('returns the correct percentage dictionary for a file', () => {
        const file: FirebaseFile = {
            name: 'file.txt',
            fullPath: '/path/to/file.txt',
            empty: false,
            downloadURL: 'https://example.com/file.txt',
            type: 'file'
        };

        const expected: PercentageDict = {
            levelElementName: 'file.txt',
            levelPercentage: 100,
            children: []
        };

        expect(constructPercentageDictRecursive(file, 0)).toEqual(expected);
    });

    it('returns the correct percentage dictionary for a folder at depth 0', () => {
        const expected: PercentageDict = {
            levelElementName: 'folder1',
            levelPercentage: 50,
            children: []
        };

        expect(constructPercentageDictRecursive(folder1, 0)).toEqual(expected);
    });

    it('returns the correct percentage dictionary for a folder at depth 1', () => {
        const expected: PercentageDict = {
            levelElementName: 'folder2',
            levelPercentage: 50,
            children: [
                {
                    levelElementName: 'folder1',
                    levelPercentage: 50,
                    children: []
                }
            ]
        };
        expect(constructPercentageDictRecursive(folder2, 1)).toEqual(expected);
    });
});

