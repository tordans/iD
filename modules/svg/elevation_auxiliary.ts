export function svgElevationAuxiliary(context: iD.Context) {
  const auxiliary = {
    show(loc: [number, number]) {
      const surface = context.surface();
      const container = surface.selectAll<SVGGElement, unknown>('.data-layer.osm .auxiliary');
      const projected = context.projection(loc);
      if (!projected || !isFinite(projected[0]) || !isFinite(projected[1])) {
        auxiliary.clear();
        return;
      }

      const data = [{ id: 'elevation-hover', x: projected[0], y: projected[1] }];
      const circles = container.selectAll('circle.elevation-hover-marker')
        .data(data, (d: { id: string }) => d.id);

      circles.exit().remove();

      circles.enter()
        .append('circle')
        .attr('class', 'elevation-hover-marker')
        .merge(circles)
        .attr('cx', (d: { x: number }) => d.x)
        .attr('cy', (d: { y: number }) => d.y)
        .attr('r', 6);
    },

    clear() {
      context.surface()
        .selectAll('.data-layer.osm .auxiliary circle.elevation-hover-marker')
        .remove();
    }
  };

  return auxiliary;
}
