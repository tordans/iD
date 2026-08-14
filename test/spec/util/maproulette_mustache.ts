import {
  buildAllProperties,
  replaceMustacheTags,
} from '../../../modules/util/maproulette_mustache';

describe('iD.util.maproulette_mustache', () => {
  describe('buildAllProperties', () => {
    it('collects properties from taskFeatures', () => {
      const props = buildAllProperties({
        taskFeatures: [{
          properties: { violation_description: 'parking on sidewalk' },
        }],
      });
      expect(props.get('violation_description')).toBe('parking on sidewalk');
    });
  });

  describe('replaceMustacheTags', () => {
    it('replaces {{violation_description}} from taskFeatures[0].properties', () => {
      const task = {
        taskFeatures: [{
          properties: { violation_description: 'parking on sidewalk' },
        }],
      };
      expect(replaceMustacheTags(
        'Removed: {{violation_description}}',
        task,
      )).toBe('Removed: parking on sidewalk');
    });

    it('returns an empty string for missing properties in plain mode', () => {
      expect(replaceMustacheTags('Hello {{missing}}', {}))
        .toBe('Hello ');
    });

    it('leaves unmatched tags in instruction htmlEscape mode', () => {
      expect(replaceMustacheTags('Hello {{missing}}', {}, { htmlEscape: true }))
        .toBe('Hello {{missing}}');
    });

    it('escapes < and & when htmlEscape is true', () => {
      const task = {
        taskFeatures: [{ properties: { note: '<bad> & worse' } }],
      };
      expect(replaceMustacheTags('{{note}}', task, { htmlEscape: true }))
        .toBe('&lt;bad&gt; &amp; worse');
    });

    it('does not escape < and & when htmlEscape is false', () => {
      const task = {
        taskFeatures: [{ properties: { note: '<bad> & worse' } }],
      };
      expect(replaceMustacheTags('{{note}}', task, { htmlEscape: false }))
        .toBe('<bad> & worse');
    });

    it('replaces {{osmIdentifier}} from title w123', () => {
      expect(replaceMustacheTags('OSM {{osmIdentifier}}', { title: 'w123' }))
        .toBe('OSM way/123');
    });
  });
});
