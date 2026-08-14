function escapeHTML(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildAllProperties(obj: any): Map<string, any> {
  const all = new Map<string, any>();
  if (!obj) return all;
  if (Array.isArray(obj.taskFeatures)) {
    obj.taskFeatures
      .map(function(f: any) { return (f && f.properties) || {}; })
      .forEach(function(props: any) {
        Object.keys(props).forEach(function(key) {
          all.set(key, props[key]);
        });
      });
  }
  if (obj.properties) {
    Object.keys(obj.properties).forEach(function(key) {
      all.set(key, obj.properties[key]);
    });
  }
  const geom = obj.geometries || obj.geojson || obj.geometry;
  if (geom) {
    if (geom.properties) {
      Object.keys(geom.properties).forEach(function(key) {
        all.set(key, geom.properties[key]);
      });
    }
    if (Array.isArray(geom.features) && geom.features.length) {
      const featProps =
        geom.features[0] && geom.features[0].properties;
      if (featProps) {
        Object.keys(featProps).forEach(function(key) {
          all.set(key, featProps[key]);
        });
      }
    }
  }
  Object.keys(obj).forEach(function(key) {
    if (!all.has(key)) all.set(key, obj[key]);
  });
  return all;
}

export type ReplaceMustacheTagsOptions = {
  htmlEscape?: boolean;
};

/** Build a task-like object from a cached MapRoulette QAItem for mustache tags. */
export function mustacheContextFromCachedTask(qaItem: any): Record<string, unknown> {
  if (!qaItem) return {};
  const task = (qaItem.task && typeof qaItem.task === 'object') ? qaItem.task : {};
  const title = (typeof task.title === 'string' && task.title)
    || (typeof qaItem.title === 'string' && qaItem.title)
    || '';
  return Object.assign({}, task, {
    title,
    taskFeatures: Array.isArray(task.taskFeatures)
      ? task.taskFeatures
      : (Array.isArray(qaItem.taskFeatures) ? qaItem.taskFeatures : undefined),
    geometries: task.geometries || qaItem.geometries,
    geojson: task.geojson || qaItem.geojson,
    geometry: task.geometry || qaItem.geometry,
    properties: task.properties || qaItem.properties,
  });
}

export function replaceMustacheTags(
  text: string,
  task: any,
  options: ReplaceMustacheTagsOptions = {},
): string {
  if (!text) return '';
  const htmlEscape = options.htmlEscape === true;
  const tagRegex = /\{\{([\w:]+)\}\}/g;
  const allProps = buildAllProperties(task);

  return text.replace(tagRegex, function(match, propertyName) {
    if (propertyName === 'osmIdentifier' && task && task.title) {
      const osmId = String(task.title).split('@')[0];
      const longForm = osmId.replace(/^([wnr])(\d+)$/, function(_match, prefix: string, num: string) {
        const type = { w: 'way', n: 'node', r: 'relation' }[prefix];
        return type ? `${type}/${num}` : osmId;
      });
      if (!/^(way|node|relation)\/\d+$/.test(longForm)) {
        return htmlEscape ? escapeHTML(osmId) : osmId;
      }
      return longForm;
    }
    if (allProps.has(propertyName)) {
      const val = allProps.get(propertyName);
      if (val === undefined || val === null) return '';
      return htmlEscape ? escapeHTML(val) : String(val);
    }
    return htmlEscape ? match : '';
  });
}
