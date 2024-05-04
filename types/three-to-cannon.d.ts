
declare module 'three-to-cannon' {

  type IShapeType = 'hull'
  const ShapeType: Record<string, IShapeType> = {
    HULL: 'hull',
  } as const;

  function threeToCannon( mesh, { type: IShapeType })
}