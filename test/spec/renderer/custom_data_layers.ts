import { prefs } from '../../../modules/core/preferences';
import {
    customDataFormat,
    customDataLabel,
    customDataLayers
} from '../../../modules/renderer/custom_data_layers';


describe('customDataLayers', () => {
    beforeEach(() => {
        prefs('custom-data-layers', null);
        prefs('custom-data-layers-next-id', null);
        customDataLayers.reset();
    });

    describe('customDataFormat', () => {
        it('detects GeoJSON files', () => {
            expect(customDataFormat('https://example.com/a.geojson')).toBe('geojson');
            expect(customDataFormat('https://example.com/a.json?token=x')).toBe('geojson');
        });

        it('treats everything else as vector tiles', () => {
            expect(customDataFormat('https://example.com/a.pmtiles')).toBe('vectortile');
            expect(customDataFormat('https://example.com/{z}/{x}/{y}.pbf')).toBe('vectortile');
        });
    });

    describe('customDataLabel', () => {
        it('uses the file name', () => {
            expect(customDataLabel('https://tilda-geo.de/api/uploads/radverkehrsnetz.pmtiles?x=1'))
                .toBe('radverkehrsnetz.pmtiles');
        });

        it('uses host and path for tile templates', () => {
            expect(customDataLabel('https://www.example.com/tiles/{z}/{x}/{y}.pbf'))
                .toBe('example.com/tiles');
        });
    });

    it('adds layers with stable, never reused ids', () => {
        const a = customDataLayers.add('https://example.com/a.geojson');
        const b = customDataLayers.add('https://example.com/b.pmtiles', 'B');
        expect([a.id, b.id]).toEqual(['data-1', 'data-2']);
        expect(b.name).toBe('B');

        customDataLayers.remove(b.id);
        expect(customDataLayers.add('https://example.com/c.pmtiles').id).toBe('data-3');
    });

    it('enables the existing layer when the same url is added again', () => {
        const a = customDataLayers.add('https://example.com/a.geojson');
        customDataLayers.toggle(a.id);
        expect(customDataLayers.enabled()).toHaveLength(0);

        customDataLayers.add(' https://example.com/a.geojson ');
        expect(customDataLayers.all()).toHaveLength(1);
        expect(customDataLayers.enabled()).toHaveLength(1);
    });

    it('persists edits', () => {
        const a = customDataLayers.add('https://example.com/a.geojson');
        customDataLayers.update(a.id, { name: ' New ', color: '#000000' });
        customDataLayers.reset();
        expect(customDataLayers.get(a.id)).toMatchObject({ name: 'New', color: '#000000' });
    });
});
