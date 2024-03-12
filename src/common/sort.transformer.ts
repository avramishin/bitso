import { SortDirection } from './enums/sort-direction.enum';

export function sortTransformer(data: any) {
  const result = {
    property: 'id',
    direction: SortDirection.DESC,
  };

  try {
    const sort = JSON.parse(data.value)[0];
    if (sort.property && sort.direction) {
      result.property = sort.property;
      result.direction = sort.direction;
    }
  } catch (e) {}

  return result;
}
