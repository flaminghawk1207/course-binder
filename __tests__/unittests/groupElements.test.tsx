import { groupElements } from "~/utils";

describe('groupElements', () => {
  const list = [
    { id: 1, category: 'A', value: 'Item 1' },
    { id: 2, category: 'B', value: 'Item 2' },
    { id: 3, category: 'A', value: 'Item 3' },
    { id: 4, category: 'C', value: 'Item 4' },
    { id: 5, category: 'B', value: 'Item 5' }
  ];

  it('groups elements based on a key getter function', () => {
    const keyGetter = (item: any) => item.category;

    const expected = [
      [
        { id: 1, category: 'A', value: 'Item 1' },
        { id: 3, category: 'A', value: 'Item 3' }
      ],
      [
        { id: 2, category: 'B', value: 'Item 2' },
        { id: 5, category: 'B', value: 'Item 5' }
      ],
      [{ id: 4, category: 'C', value: 'Item 4' }]
    ];

    expect(groupElements(list, keyGetter)).toEqual(expected);
  });

  it('returns an empty array for an empty input list', () => {
    const emptyList: any[] = [];
    const keyGetter = (item: any) => item.category;

    expect(groupElements(emptyList, keyGetter)).toEqual([]);
  });

  it('returns a single group when all elements have the same key', () => {
    const sameKeyList = [
      { id: 1, category: 'A', value: 'Item 1' },
      { id: 2, category: 'A', value: 'Item 2' },
      { id: 3, category: 'A', value: 'Item 3' }
    ];
    const keyGetter = (item: any) => item.category;

    const expected = [
      [
        { id: 1, category: 'A', value: 'Item 1' },
        { id: 2, category: 'A', value: 'Item 2' },
        { id: 3, category: 'A', value: 'Item 3' }
      ]
    ];

    expect(groupElements(sameKeyList, keyGetter)).toEqual(expected);
  });
});
