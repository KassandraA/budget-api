type MyType = { name: string; description: string };

function isMyType(o: any): o is MyType {
  return 'name' in o && 'description' in o;
}
