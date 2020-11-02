type MyType = { name: string; description: string };

// Validate this value with a custom type guard
function isMyType(o: any): o is MyType {
  return 'name' in o && 'description' in o;
}
