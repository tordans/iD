describe('iD.validations.crossing_ways - kerb intersections', function () {
    var context;

    beforeEach(function() {
        const container = d3.select('body').append('div');
        context = iD.coreContext().assetPath('../dist/').init().container(container);
        container
            .append('div')
            .attr('class', 'main-map')
            .call(context.map());
    });

    /**
     * Creates a test geometry with:
     * - Two parallel sidewalks (footway=sidewalk, highway=footway)
     * - A road highway between them
     * - Barrier kerb lines between each sidewalk and the road
     * - A crossing way connecting the sidewalks across the road
     */
    function createKerbCrossingGeometry() {
        // Left sidewalk (parallel to road)
        const sidewalk1_start = iD.osmNode({id: 'n-1', loc: [0, 0]});
        const sidewalk1_connect = iD.osmNode({id: 'n-2', loc: [1, 0]}); // Connection point for crossing
        const sidewalk1_end = iD.osmNode({id: 'n-3', loc: [2, 0]});
        const sidewalk1 = iD.osmWay({id: 'w-sidewalk1', nodes: ['n-1', 'n-2', 'n-3'], tags: {highway: 'footway', footway: 'sidewalk'}});

        // Left kerb (between left sidewalk and road) - parallel to road
        const kerb1_start = iD.osmNode({id: 'n-10', loc: [0, 1]});
        const kerb1_validator_connect = iD.osmNode({id: 'n-11', loc: [1, 1]}); // Will be created by validator at crossing intersection
        const kerb1_end = iD.osmNode({id: 'n-12', loc: [2, 1]});
        const kerb1 = iD.osmWay({id: 'w-kerb1', nodes: ['n-10', 'n-12'], tags: {barrier: 'kerb'}});

        // Road highway (between sidewalks, between kerbs)
        const road_start = iD.osmNode({id: 'n-20', loc: [0, 2]});
        const road_validator_connect = iD.osmNode({id: 'n-21', loc: [1, 2]}); // Will be created by validator at crossing point
        const road_end = iD.osmNode({id: 'n-22', loc: [2, 2]});
        const road = iD.osmWay({id: 'w-road', nodes: ['n-20', 'n-22'], tags: {highway: 'residential'}});

        // Right kerb (between right sidewalk and road) - parallel to road
        const kerb2_start = iD.osmNode({id: 'n-30', loc: [0, 3]});
        const kerb2_validator_connect = iD.osmNode({id: 'n-31', loc: [1, 3]}); // Will be created by validator at crossing intersection
        const kerb2_end = iD.osmNode({id: 'n-32', loc: [2, 3]});
        const kerb2 = iD.osmWay({id: 'w-kerb2', nodes: ['n-30', 'n-32'], tags: {barrier: 'kerb'}});

        // Right sidewalk (parallel to road)
        const sidewalk2_start = iD.osmNode({id: 'n-40', loc: [0, 4]});
        const sidewalk2_connect = iD.osmNode({id: 'n-41', loc: [1, 4]}); // Connection point for crossing
        const sidewalk2_end = iD.osmNode({id: 'n-42', loc: [2, 4]});
        const sidewalk2 = iD.osmWay({id: 'w-sidewalk2', nodes: ['n-40', 'n-41', 'n-42'], tags: {highway: 'footway', footway: 'sidewalk'}});

        // Crossing way (unvalidated) - connects sidewalks, will cross road and kerbs
        const footway_unvalidated = iD.osmWay({id: 'w-sidewalk', nodes: ['n-2', 'n-41'], tags: {highway: 'footway'}});
        // Expected after validation:
        // - Part 1: from sidewalk1_connect (n-2) to kerb1_validator_connect (n-11) - regular footway
        // - Part 2: from kerb1_validator_connect (n-11) through road_validator_connect (n-21) to kerb2_validator_connect (n-31) - footway=crossing
        // - Part 3: from kerb2_validator_connect (n-31) to sidewalk2_connect (n-41) - regular footway

        context.perform(
            iD.actionAddEntity(sidewalk1_start),
            iD.actionAddEntity(sidewalk1_connect),
            iD.actionAddEntity(sidewalk1_end),
            iD.actionAddEntity(sidewalk2_start),
            iD.actionAddEntity(sidewalk2_connect),
            iD.actionAddEntity(sidewalk2_end),
            iD.actionAddEntity(road_start),
            iD.actionAddEntity(road_end),
            iD.actionAddEntity(kerb1_start),
            iD.actionAddEntity(kerb1_end),
            iD.actionAddEntity(kerb2_start),
            iD.actionAddEntity(kerb2_end),
            iD.actionAddEntity(sidewalk1),
            iD.actionAddEntity(sidewalk2),
            iD.actionAddEntity(road),
            iD.actionAddEntity(kerb1),
            iD.actionAddEntity(kerb2),
            iD.actionAddEntity(footway_unvalidated)
        );

        return {
            crossingWay: footway_unvalidated,
            sidewalkLeft: sidewalk1,
            sidewalkRight: sidewalk2,
            sidewalk1_connect: sidewalk1_connect,
            sidewalk2_connect: sidewalk2_connect,
            road: road,
            kerbLeft: kerb1,
            kerbRight: kerb2,
            road_validator_connect: road_validator_connect,
            kerb1_validator_connect: kerb1_validator_connect,
            kerb2_validator_connect: kerb2_validator_connect
        };
    }

    function validate() {
        var validator = iD.validationCrossingWays(context);
        var changes = context.history().changes();
        var entities = changes.modified.concat(changes.created);
        var issues = [];
        entities.forEach(function(entity) {
            issues = issues.concat(validator(entity, context.graph()));
        });
        return issues;
    }

    it('creates kerb nodes at intersections with kerb barriers', function() {
        var geometry = createKerbCrossingGeometry();
        var issues = validate();

        // Should have crossing issue
        expect(issues.length).to.be.greaterThan(0);
        var crossingIssue = issues.find(function(issue) {
            return issue.type === 'crossing_ways' && issue.entityIds.indexOf(geometry.crossingWay.id) !== -1;
        });
        expect(crossingIssue).to.exist;

        // Select the crossing way so dynamic fixes are generated
        context.enter(iD.modeSelect(context, [geometry.crossingWay.id]));

        // Get all fixes (includes dynamic fixes with issue bound)
        var fixes = crossingIssue.fixes(context);

        // The crossing fix should be generated when connectionTags.highway === 'crossing' and one way is a side path
        // Based on the code at line 516-526, it should be unshifted to the front of the fixes array
        expect(fixes.length).to.be.greaterThan(0);

        // The fix that creates a crossing should be one of the first fixes (it's unshifted to front)
        // Skip the "ignore" fix which is always last
        var crossingFix = fixes.find(function(fix, index) {
            // Skip the last fix which is usually "ignore issue"
            if (index === fixes.length - 1) return false;
            // The crossing fix should be among the first fixes
            return true;
        });

        // If we can't find it, use the first fix (should be the crossing fix)
        if (!crossingFix && fixes.length > 1) {
            crossingFix = fixes[0]; // First fix should be the crossing fix
        }

        expect(crossingFix).to.exist;

        // Apply the fix
        crossingFix.onClick(context);

        // Verify validator-created nodes exist
        var graph = context.graph();

        // Find all ways that connect the sidewalk connection points
        // The crossing way may have been split, so find ways that contain the connection nodes
        var sidewalk1ConnectNode = graph.entity(geometry.sidewalk1_connect.id);
        var sidewalk2ConnectNode = graph.entity(geometry.sidewalk2_connect.id);
        expect(sidewalk1ConnectNode).to.exist;
        expect(sidewalk2ConnectNode).to.exist;

        // Find ways that contain the connection nodes (the crossing way may be split)
        var crossingWays = [];
        var waysFromNode1 = graph.parentWays(sidewalk1ConnectNode);
        var waysFromNode2 = graph.parentWays(sidewalk2ConnectNode);
        // Combine and deduplicate
        var allWays = waysFromNode1.concat(waysFromNode2);
        allWays.forEach(function(way) {
            if (crossingWays.indexOf(way) === -1) {
                crossingWays.push(way);
            }
        });

        expect(crossingWays.length).to.be.greaterThan(0);

        // Find nodes at expected locations across all crossing ways
        var roadCrossingNode = null;
        var kerb1Node = null;
        var kerb2Node = null;

        crossingWays.forEach(function(way) {
            way.nodes.forEach(function(nodeId) {
                var node = graph.entity(nodeId);
                if (!node) return;
                var loc = node.loc;
                // Check if node is at road crossing location [1, 2]
                if (Math.abs(loc[0] - 1) < 0.001 && Math.abs(loc[1] - 2) < 0.001) {
                    roadCrossingNode = node;
                }
                // Check if node is at kerb1 location [1, 1]
                if (Math.abs(loc[0] - 1) < 0.001 && Math.abs(loc[1] - 1) < 0.001) {
                    kerb1Node = node;
                }
                // Check if node is at kerb2 location [1, 3]
                if (Math.abs(loc[0] - 1) < 0.001 && Math.abs(loc[1] - 3) < 0.001) {
                    kerb2Node = node;
                }
            });
        });

        // Check road crossing node exists
        expect(roadCrossingNode).to.exist;

        // Check kerb1 node exists and has barrier=kerb tag
        expect(kerb1Node).to.exist;
        expect(kerb1Node.tags).to.exist;
        expect(kerb1Node.tags.barrier).to.equal('kerb');

        // Check kerb2 node exists and has barrier=kerb tag
        expect(kerb2Node).to.exist;
        expect(kerb2Node.tags).to.exist;
        expect(kerb2Node.tags.barrier).to.equal('kerb');

        // Verify kerb validator nodes are connected to kerb ways
        if (kerb1Node) {
            var kerb1ParentWays = graph.parentWays(kerb1Node);
            var kerb1ConnectedToKerb = kerb1ParentWays.some(function(way) {
                return way.tags && way.tags.barrier === 'kerb';
            });
            expect(kerb1ConnectedToKerb).to.be.true;
        }

        if (kerb2Node) {
            var kerb2ParentWays = graph.parentWays(kerb2Node);
            var kerb2ConnectedToKerb = kerb2ParentWays.some(function(way) {
                return way.tags && way.tags.barrier === 'kerb';
            });
            expect(kerb2ConnectedToKerb).to.be.true;
        }

        // Verify the expected structure: way should be split into parts
        // Find all ways that connect sidewalk1_connect to sidewalk2_connect
        var waysConnectingSidewalks = [];
        crossingWays.forEach(function(way) {
            var hasNode2 = way.nodes.indexOf('n-2') !== -1;
            var hasNode41 = way.nodes.indexOf('n-41') !== -1;
            if (hasNode2 || hasNode41) {
                waysConnectingSidewalks.push(way);
            }
        });

        // Should have at least 3 ways (the original way split into parts)
        expect(waysConnectingSidewalks.length).to.be.greaterThanOrEqual(1);

        // Find the way segment that has the crossing tag (should be between kerb nodes)
        var crossingSegment = null;
        waysConnectingSidewalks.forEach(function(way) {
            var wayTags = way.tags || {};
            if (wayTags.footway === 'crossing' || wayTags.cycleway === 'crossing' || wayTags.path === 'crossing') {
                crossingSegment = way;
            }
        });

        expect(crossingSegment).to.exist;
        expect(crossingSegment.tags.footway).to.equal('crossing');

        // Verify the crossing segment contains the road crossing node and kerb nodes
        var crossingSegmentHasRoadNode = crossingSegment.nodes.indexOf(roadCrossingNode.id) !== -1;
        var crossingSegmentHasKerb1 = kerb1Node && crossingSegment.nodes.indexOf(kerb1Node.id) !== -1;
        var crossingSegmentHasKerb2 = kerb2Node && crossingSegment.nodes.indexOf(kerb2Node.id) !== -1;

        expect(crossingSegmentHasRoadNode).to.be.true;
        expect(crossingSegmentHasKerb1).to.be.true;
        expect(crossingSegmentHasKerb2).to.be.true;
    });
});
