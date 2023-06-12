import { check_template } from "~/utils";

describe('check_template', () => {
  it('returns false if template is falsy', () => {
    expect(check_template(null)).toBe(false);
    expect(check_template(undefined)).toBe(false);
    expect(check_template(false)).toBe(false);
    expect(check_template(0)).toBe(false);
    expect(check_template('')).toBe(false);
  });

  it('returns false if template is a file without a name or with contents', () => {
    const fileTemplate: any = {
      type: 'file',
    };
    expect(check_template(fileTemplate)).toBe(false);

    fileTemplate.name = 'File1';
    expect(check_template(fileTemplate)).toBe(true);

    fileTemplate.contents = ['content1'];
    expect(check_template(fileTemplate)).toBe(false);
  });

  it('returns false if template is a folder without a name or without contents', () => {
    const folderTemplate: any = {
      type: 'folder',
    };
    expect(check_template(folderTemplate)).toBe(false);

    folderTemplate.name = 'Folder1';
    expect(check_template(folderTemplate)).toBe(false);

    folderTemplate.contents = [{
        type: 'file',
        name: 'File1',
    }];
    expect(check_template(folderTemplate)).toBe(true);
  });

  it('returns false if any sub-template within a folder is invalid', () => {
    const invalidSubTemplate = {
      type: 'invalid',
    };

    const folderTemplate = {
      type: 'folder',
      name: 'Folder1',
      contents: [invalidSubTemplate],
    };

    expect(check_template(folderTemplate)).toBe(false);
  });

  it('returns true if the template is valid', () => {
    const validTemplate = {
      type: 'folder',
      name: 'Folder1',
      contents: [
        {
          type: 'file',
          name: 'File1',
        },
        {
          type: 'folder',
          name: 'Subfolder',
          contents: [
            {
              type: 'file',
              name: 'File2',
            },
          ],
        },
      ],
    };

    expect(check_template(validTemplate)).toBe(true);
  });
});
