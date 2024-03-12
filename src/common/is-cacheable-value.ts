export function isCacheableValue(value: any) {
  return (
    value !== null &&
    value !== false &&
    value !== undefined &&
    !Number.isNaN(value)
  );
}
