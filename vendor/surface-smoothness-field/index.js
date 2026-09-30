//#region ../data/dist/generated/catalogue.js
var e = {
	version: "0.0.0",
	meta: {
		source: "StreetComplete",
		generatedBy: "scripts/extract-from-streetcomplete.ts",
		counts: {
			surfaces: 26,
			smoothnessLevels: 8,
			matrixSurfaces: 8,
			matrixCells: 43,
			images: 55
		}
	},
	smoothnessLevels: {
		excellent: {
			osmValue: "excellent",
			title: "Smooth and even",
			emoji: "🛹"
		},
		good: {
			osmValue: "good",
			title: "Mostly even",
			emoji: "🛴"
		},
		intermediate: {
			osmValue: "intermediate",
			title: "A little bumpy",
			emoji: "🚲"
		},
		bad: {
			osmValue: "bad",
			title: "Bumpy",
			emoji: "🚗"
		},
		very_bad: {
			osmValue: "very_bad",
			title: "Very bumpy",
			emoji: "🚙"
		},
		horrible: {
			osmValue: "horrible",
			title: "Very bumpy and uneven",
			emoji: "🛻"
		},
		very_horrible: {
			osmValue: "very_horrible",
			title: "Almost impassable",
			emoji: "🚜"
		},
		impassable: {
			osmValue: "impassable",
			title: "Impassable",
			emoji: "🚶"
		}
	},
	surfaces: {
		asphalt: {
			osmValue: "asphalt",
			title: "Asphalt",
			icon: "images/surface_asphalt.jpg",
			smoothnessQuest: !0
		},
		concrete: {
			osmValue: "concrete",
			title: "Concrete",
			icon: "images/surface_concrete.jpg",
			smoothnessQuest: !0
		},
		"concrete:lanes": {
			osmValue: "concrete:lanes",
			title: "Concrete lanes",
			icon: "images/surface_concrete_lanes.jpg",
			smoothnessQuest: !1
		},
		paving_stones: {
			osmValue: "paving_stones",
			title: "Paving stones",
			icon: "images/surface_paving_stones.jpg",
			smoothnessQuest: !0
		},
		sett: {
			osmValue: "sett",
			title: "Sett",
			icon: "images/surface_sett.jpg",
			smoothnessQuest: !0
		},
		unhewn_cobblestone: {
			osmValue: "unhewn_cobblestone",
			title: "Unhewn cobblestone",
			icon: "images/surface_cobblestone.jpg",
			smoothnessQuest: !1
		},
		grass_paver: {
			osmValue: "grass_paver",
			title: "Grass paver",
			icon: "images/surface_grass_paver.jpg",
			smoothnessQuest: !1
		},
		metal: {
			osmValue: "metal",
			title: "Metal",
			icon: "images/surface_metal.jpg",
			smoothnessQuest: !1
		},
		wood: {
			osmValue: "wood",
			title: "Wood",
			icon: "images/surface_wood.jpg",
			smoothnessQuest: !1
		},
		compacted: {
			osmValue: "compacted",
			title: "Compacted gravel",
			icon: "images/surface_compacted.jpg",
			smoothnessQuest: !0
		},
		woodchips: {
			osmValue: "woodchips",
			title: "Woodchips",
			icon: "images/surface_woodchips.jpg",
			smoothnessQuest: !1
		},
		fine_gravel: {
			osmValue: "fine_gravel",
			title: "Fine gravel",
			icon: "images/surface_fine_gravel.jpg",
			smoothnessQuest: !0
		},
		pebblestone: {
			osmValue: "pebblestone",
			title: "Pebbles",
			icon: "images/surface_pebblestone.jpg",
			smoothnessQuest: !1
		},
		gravel: {
			osmValue: "gravel",
			title: "Coarse gravel",
			icon: "images/surface_gravel.jpg",
			smoothnessQuest: !0
		},
		dirt: {
			osmValue: "dirt",
			title: "Dirt",
			icon: "images/surface_dirt.jpg",
			smoothnessQuest: !1
		},
		mud: {
			osmValue: "mud",
			title: "Persistent mud",
			icon: "images/surface_mud.jpg",
			smoothnessQuest: !1
		},
		grass: {
			osmValue: "grass",
			title: "Grass",
			icon: "images/surface_grass.jpg",
			smoothnessQuest: !1
		},
		sand: {
			osmValue: "sand",
			title: "Sand",
			icon: "images/surface_sand.jpg",
			smoothnessQuest: !1
		},
		rock: {
			osmValue: "rock",
			title: "Rock",
			icon: "images/surface_rock.jpg",
			smoothnessQuest: !1
		},
		clay: {
			osmValue: "clay",
			title: "Clay",
			icon: "images/surface_tennis_clay.jpg",
			smoothnessQuest: !1
		},
		artificial_turf: {
			osmValue: "artificial_turf",
			title: "Artificial turf",
			icon: "images/surface_artificial_turf.jpg",
			smoothnessQuest: !1
		},
		rubber: {
			osmValue: "rubber",
			title: "Rubber granules",
			icon: "images/surface_tartan.jpg",
			smoothnessQuest: !1
		},
		acrylic: {
			osmValue: "acrylic",
			title: "Synthetic resin",
			icon: "images/surface_acrylic.jpg",
			smoothnessQuest: !1
		},
		paved: {
			osmValue: "paved",
			title: "Paved (generic)",
			icon: "images/surface_paved_area.jpg",
			smoothnessQuest: !1
		},
		unpaved: {
			osmValue: "unpaved",
			title: "Unpaved (generic)",
			icon: "images/surface_unpaved_area.jpg",
			smoothnessQuest: !1
		},
		ground: {
			osmValue: "ground",
			title: "Ground (generic)",
			icon: "images/surface_ground_area.jpg",
			smoothnessQuest: !1
		}
	},
	surfaceAliases: {
		"concrete:plates": "concrete",
		earth: "dirt",
		soil: "dirt",
		tartan: "rubber",
		bricks: "paving_stones",
		brick: "paving_stones",
		chipseal: "asphalt",
		metal_grid: "metal"
	},
	surfacesForSmoothnessQuest: [
		"asphalt",
		"concrete",
		"concrete:plates",
		"sett",
		"paving_stones",
		"compacted",
		"gravel",
		"fine_gravel"
	],
	smoothnessMatrix: {
		asphalt: {
			excellent: {
				photo: "images/surface_asphalt_excellent.jpg",
				description: "No bumps or cracks"
			},
			good: {
				photo: "images/surface_asphalt_good.jpg",
				description: "Only small cracks, gaps, repairs or a little rough surface"
			},
			intermediate: {
				photo: "images/surface_asphalt_intermediate.jpg",
				description: "Unusually rough surface, wider gaps, cracks, shallow ruts, potholes or other damage"
			},
			bad: {
				photo: "images/surface_asphalt_bad.jpg",
				description: "Big gaps, potholes, ruts, crumbled paving or other damage"
			},
			very_bad: {
				photo: "images/surface_asphalt_very_bad.jpg",
				description: "Deep potholes, ruts or other dangerous damage"
			}
		},
		concrete: {
			excellent: {
				photo: "images/surface_concrete_excellent.jpg",
				description: "No bumps or cracks"
			},
			good: {
				photo: "images/surface_concrete_good.jpg",
				description: "Only small cracks, gaps, repairs or a little rough surface"
			},
			intermediate: {
				photo: "images/surface_concrete_intermediate.jpg",
				description: "Unusually rough surface, wider gaps, cracks, shallow ruts, potholes or other damage"
			},
			bad: {
				photo: "images/surface_concrete_bad.jpg",
				description: "Big gaps, potholes, ruts, crumbled paving or other damage"
			},
			very_bad: {
				photo: "images/surface_concrete_very_bad.jpg",
				description: "Deep potholes, ruts or other dangerous damage"
			}
		},
		"concrete:plates": {
			excellent: {
				photo: "images/surface_concrete_excellent.jpg",
				description: "No bumps or cracks"
			},
			good: {
				photo: "images/surface_concrete_good.jpg",
				description: "Only small cracks, gaps, repairs or a little rough surface"
			},
			intermediate: {
				photo: "images/surface_concrete_intermediate.jpg",
				description: "Unusually rough surface, wider gaps, cracks, shallow ruts, potholes or other damage"
			},
			bad: {
				photo: "images/surface_concrete_bad.jpg",
				description: "Big gaps, potholes, ruts, crumbled paving or other damage"
			},
			very_bad: {
				photo: "images/surface_concrete_very_bad.jpg",
				description: "Deep potholes, ruts or other dangerous damage"
			}
		},
		sett: {
			good: {
				photo: "images/surface_sett_good.jpg",
				description: "Unusually flat stones, regular pattern, very shallow or narrow gaps"
			},
			intermediate: {
				photo: "images/surface_sett_intermediate.jpg",
				description: "Flat stones or with square edges, shallow or narrow gaps"
			},
			bad: {
				photo: "images/surface_sett_bad.jpg",
				description: "Weathered stone or irregular shapes, big gaps or damage"
			},
			very_bad: {
				photo: "images/surface_sett_very_bad.jpg",
				description: "Big gaps, displaced, missing or irregularly shaped stones or dangerous damage"
			}
		},
		paving_stones: {
			excellent: {
				photo: "images/surface_paving_stones_excellent.jpg",
				description: "Almost seamless"
			},
			good: {
				photo: "images/surface_paving_stones_good.jpg",
				description: "Shallow or narrow gaps"
			},
			intermediate: {
				photo: "images/surface_paving_stones_intermediate.jpg",
				description: "Wider gaps, possibly some displaced stones or other damage"
			},
			bad: {
				photo: "images/surface_paving_stones_bad.jpg",
				description: "Displaced stones, big gaps or other damage"
			},
			very_bad: {
				photo: "images/surface_paving_stones_very_bad.jpg",
				description: "Missing and broken stones, gaps or other dangerous damage"
			}
		},
		compacted: {
			good: {
				photo: "images/surface_compacted_good.jpg",
				description: "Hard-packed, very little loose gravel or sand"
			},
			intermediate: {
				photo: "images/surface_compacted_intermediate.jpg",
				description: "Fine gravel, shallow bumps or potholes"
			},
			bad: {
				photo: "images/surface_compacted_bad.jpg",
				description: "Some bigger gravel, bumps, ruts or potholes"
			},
			very_bad: {
				photo: "images/surface_compacted_very_bad.jpg",
				description: "Some large stones, deep potholes, bumps, ruts, erosion or other hazardous damage"
			},
			horrible: {
				photo: "images/surface_unpaved_horrible.jpg",
				description: "Properly usable only by off-road vehicles or on foot"
			},
			very_horrible: {
				photo: "images/surface_unpaved_very_horrible.jpg",
				description: "Properly usable only by specialized off-road vehicles or on foot"
			},
			impassable: {
				photo: "images/surface_unpaved_impassable.jpg",
				description: "Unfit for any vehicle, only passable on foot"
			}
		},
		gravel: {
			intermediate: {
				photo: "images/surface_gravel_intermediate.jpg",
				description: "Fine gravel, shallow bumps or potholes"
			},
			bad: {
				photo: "images/surface_gravel_bad.jpg",
				description: "Some bigger gravel, bumps, ruts or potholes"
			},
			very_bad: {
				photo: "images/surface_gravel_very_bad.jpg",
				description: "Some large stones, deep potholes, bumps, ruts, erosion or other hazardous damage"
			},
			horrible: {
				photo: "images/surface_unpaved_horrible.jpg",
				description: "Properly usable only by off-road vehicles or on foot"
			},
			very_horrible: {
				photo: "images/surface_unpaved_very_horrible.jpg",
				description: "Properly usable only by specialized off-road vehicles or on foot"
			},
			impassable: {
				photo: "images/surface_unpaved_impassable.jpg",
				description: "Unfit for any vehicle, only passable on foot"
			}
		},
		fine_gravel: {
			intermediate: {
				photo: "images/surface_gravel_intermediate.jpg",
				description: "Fine gravel, shallow bumps or potholes"
			},
			bad: {
				photo: "images/surface_gravel_bad.jpg",
				description: "Some bigger gravel, bumps, ruts or potholes"
			},
			very_bad: {
				photo: "images/surface_gravel_very_bad.jpg",
				description: "Some large stones, deep potholes, bumps, ruts, erosion or other hazardous damage"
			},
			horrible: {
				photo: "images/surface_unpaved_horrible.jpg",
				description: "Properly usable only by off-road vehicles or on foot"
			},
			very_horrible: {
				photo: "images/surface_unpaved_very_horrible.jpg",
				description: "Properly usable only by specialized off-road vehicles or on foot"
			},
			impassable: {
				photo: "images/surface_unpaved_impassable.jpg",
				description: "Unfit for any vehicle, only passable on foot"
			}
		}
	},
	attribution: [
		{
			file: "images/surface_acrylic.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Tennis_Court_Phoenix.jpg (NWSPhoenix)"
		},
		{
			file: "images/surface_artificial_turf.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Artificial_turf.jpg"
		},
		{
			file: "images/surface_asphalt.jpg",
			license: "Public Domain",
			source: "https://commons.wikimedia.org/wiki/File:Ground_frost_damages.JPG (SeppVei)"
		},
		{
			file: "images/surface_asphalt_bad.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Crumbling_asphalt_path.jpg (Andre Thum)"
		},
		{
			file: "images/surface_asphalt_excellent.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Mala_Hrastice_2020-06-16_Ulice_z_navsi_na_nadrazi_obr05.jpg (Miloš Hlávka)"
		},
		{
			file: "images/surface_asphalt_good.jpg",
			license: "Public Domain",
			source: "https://wiki.openstreetmap.org/wiki/File:Small_road_with_a_few_repairs.jpg (helium314)"
		},
		{
			file: "images/surface_asphalt_intermediate.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Nids-de-poule_sur_une_route_communale.jpg (Mathis Brancquart)"
		},
		{
			file: "images/surface_asphalt_very_bad.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Kamieniec_Szalejow_Gorny_road.jpg (Jojo)"
		},
		{
			file: "images/surface_cobblestone.jpg",
			license: "CC-BY-SA 3.0",
			source: "https://commons.wikimedia.org/wiki/File:Bad_Radkersburg_Murgasse_IMG_0583.jpg (E.mil.mil)"
		},
		{
			file: "images/surface_compacted.jpg",
			license: "CC-BY 2.0",
			source: "https://commons.wikimedia.org/wiki/File:Dirt_road_in_countryside.jpg (Ian Munroe)"
		},
		{
			file: "images/surface_compacted_bad.jpg",
			license: "Public Domain",
			source: "https://wiki.openstreetmap.org/wiki/File:Rough_compacted_track.jpg (helium314)"
		},
		{
			file: "images/surface_compacted_good.jpg",
			license: "CC-BY-SA 2.0",
			source: "https://www.geograph.org.uk/photo/3670104 (Alan Hunt)"
		},
		{
			file: "images/surface_compacted_intermediate.jpg",
			license: "CC-BY-SA 2.0",
			source: "https://www.geograph.org.uk/photo/3670853 (Alan Hunt)"
		},
		{
			file: "images/surface_compacted_very_bad.jpg",
			license: "CC0",
			source: "https://wiki.openstreetmap.org/wiki/File:Smoothness_very_bad.jpg (rhhsm)"
		},
		{
			file: "images/surface_concrete.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:2014-08-29_15_33_15_View_across_Stuyvesant_Avenue_in_Ewing,_New_Jersey,_with_concrete_pavement_likely_dating_to_the_1950s.JPG (Famartin)"
		},
		{
			file: "images/surface_concrete_bad.jpg",
			license: "CC-BY-SA 2.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Geograph-6398805-by-Trevor-Littlewood.jpg (Trevor Littlewood)"
		},
		{
			file: "images/surface_concrete_excellent.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Boat_ramp,_Flint_River_Park.JPG (Michael Rivera)"
		},
		{
			file: "images/surface_concrete_good.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:2014-08-29_15_31_39_View_southeast_along_Stuyvesant_Avenue_in_Ewing,_New_Jersey,_with_concrete_pavement_likely_dating_to_the_1950s.JPG (Famartin)"
		},
		{
			file: "images/surface_concrete_intermediate.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Concrete_plates_-_intermediate.jpg (Supaplex030)"
		},
		{
			file: "images/surface_concrete_lanes.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:%D0%91%D0%B5%D1%82%D0%BE%D0%BD%D0%BD%D0%B0_%D0%B2%D1%96%D0%B9%D1%81%D1%8C%D0%BA%D0%BE%D0%B2%D0%B0_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%D0%BD%D0%B0_%D0%9F%D0%BE%D0%BB%D0%BE%D0%BD%D0%B8%D0%BD%D1%83_%D0%A0%D1%83%D0%BD%D1%83.jpg (Maximym44)"
		},
		{
			file: "images/surface_concrete_very_bad.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Damaged_Irrigation_Canal.JPG (Narek75)"
		},
		{
			file: "images/surface_dirt.jpg",
			license: "CC-BY 3.0",
			source: "https://commons.wikimedia.org/wiki/File:Dirt_road_towards_the_south_and_Ndara_Borehole_in_the_Tsavo_East_National_Park,_Kenya.jpg (CT Cooper)"
		},
		{
			file: "images/surface_fine_gravel.jpg",
			license: "CC0",
			source: "https://commons.wikimedia.org/wiki/File:Schottertextur_20160312_1.jpg (Sebastian Rittau)"
		},
		{
			file: "images/surface_grass.jpg",
			license: "CC-BY-SA 2.0",
			source: "https://commons.wikimedia.org/wiki/File:Footpath_through_the_long_grass_near_Southorpe_Bottom_(geograph_4621359).jpg (Richard Humphrey)"
		},
		{
			file: "images/surface_grass_paver.jpg",
			license: "Public Domain",
			source: "https://commons.wikimedia.org/wiki/File:Rasenpflasterstein_1.jpg (Immanuel Giel)"
		},
		{
			file: "images/surface_gravel.jpg",
			license: "CC-BY 3.0",
			source: "https://commons.wikimedia.org/wiki/File:Gravel_at_the_top_of_Vidova_gora,_island_of_Bra%C4%8D,_Croatia.jpg (Ante Perkovic)"
		},
		{
			file: "images/surface_gravel_bad.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Gravel_-_bad.jpg (Supaplex030)"
		},
		{
			file: "images/surface_gravel_intermediate.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Compacted_-_intermediate.jpg (Supaplex030)"
		},
		{
			file: "images/surface_gravel_very_bad.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Mountain_path_with_large_gravel.jpg (Andre Thum)"
		},
		{
			file: "images/surface_ground_area.jpg",
			license: "CC-BY 2.0",
			source: "https://commons.wikimedia.org/wiki/File:Bend_It_Like_Beckham_(3734770583).jpg (Danumurthi Mahendra)"
		},
		{
			file: "images/surface_metal.jpg",
			license: "Public Domain",
			source: "https://commons.wikimedia.org/wiki/File:Metal_steel_surface.jpg (Titus Tscharntke)"
		},
		{
			file: "images/surface_mud.jpg",
			license: "CC-BY-SA 3.0",
			source: "https://commons.wikimedia.org/wiki/File:Dirt_road,_Ond%C5%99ejovsko_(4).jpg (Pavel Ševela [sevela.p])"
		},
		{
			file: "images/surface_paved_area.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:2014-08-27_13_01_48_View_across_Parkway_Avenue_(Mercer_County_Route_634)_near_the_Delaware_and_Bound_Brook_Railroad_underpass,_with_concrete_pavement_likely_dating_to_the_1950s.JPG (Famartin)"
		},
		{
			file: "images/surface_paving_stones.jpg",
			license: "CC-BY-SA 4.0",
			source: "Tobias Zwick with modifications by Mateusz Konieczny"
		},
		{
			file: "images/surface_paving_stones_bad.jpg",
			license: "CC0 1.0",
			source: "https://wiki.openstreetmap.org/wiki/File:20230418_142605c.jpg (Rhhsmits)"
		},
		{
			file: "images/surface_paving_stones_excellent.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Footway_with_very_smooth_paving.jpg (mcliquid)"
		},
		{
			file: "images/surface_paving_stones_good.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Paving_stones_-_good.jpg (Supaplex030)"
		},
		{
			file: "images/surface_paving_stones_intermediate.jpg",
			license: "Public Domain",
			source: "https://wiki.openstreetmap.org/wiki/File:Damaged_and_loose_paving_stones.jpg (helium314)"
		},
		{
			file: "images/surface_paving_stones_very_bad.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Broken_up_sidewalk_near_the_shore_of_the_St._Lawrence_River_near_Aultsville,_Ontario.jpg (Aultsville)"
		},
		{
			file: "images/surface_pebblestone.jpg",
			license: "CC-BY-SA 2.0",
			source: "https://commons.wikimedia.org/wiki/File:Boulders_and_shingle_on_Aber_Rhigian_Beach_-_geograph.org.uk_-_7859065.jpg (Jeff Buck)"
		},
		{
			file: "images/surface_rock.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Rock_Trail_Surface_at_Patapsco_Valley_State_Park.jpg"
		},
		{
			file: "images/surface_sand.jpg",
			license: "CC-BY-SA 3.0",
			source: "https://commons.wikimedia.org/wiki/File:2013-08-21_12_04_26_View_south_towards_Barnegat_Lighthouse_along_the_sand_road_to_Barnegat_Inlet_in_Island_Beach_State_Park.jpg (Famartin )"
		},
		{
			file: "images/surface_sett.jpg",
			license: "CC-BY-SA 3.0",
			source: "https://commons.wikimedia.org/wiki/File:Brusteinshalden.JPG (Øyvind Holmstad )"
		},
		{
			file: "images/surface_sett_bad.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Sett_-_bad.jpg (Supaplex030)"
		},
		{
			file: "images/surface_sett_good.jpg",
			license: "CC0",
			source: "https://wiki.openstreetmap.org/wiki/File:Sett_paving_with_flattened_stones_and_very_shallow_gaps.jpg (NicoHood)"
		},
		{
			file: "images/surface_sett_intermediate.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Sett_paving_with_mostly_square_but_rough_stones.jpg (Andre Thum)"
		},
		{
			file: "images/surface_sett_very_bad.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Sett-5-VeryBad-B.jpg (Szem)"
		},
		{
			file: "images/surface_tartan.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:4_%C3%97_100_metres_relay_start_line.jpg (Santeri Viinamäki)"
		},
		{
			file: "images/surface_tennis_clay.jpg",
			license: "CC-BY-SA 2.0",
			source: "https://commons.wikimedia.org/wiki/File:Rafael_Nadal%2C_2011_Roland_Garros_(3).jpg (Yann Caradec)"
		},
		{
			file: "images/surface_unpaved_area.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Art_earthwork_landscape_sculpture_Woodland_Trust_Theydon_Bois_Essex_08.JPG (Acabashi)"
		},
		{
			file: "images/surface_unpaved_horrible.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Smoothness_horrible.jpg (rhhsm)"
		},
		{
			file: "images/surface_unpaved_impassable.jpg",
			license: "Public Domain",
			source: "https://drive.google.com/file/d/1yZXynVd07IWQPKpBbrlbABzfKHkG9X7R/view?usp=sharing (Tobias Zwick)"
		},
		{
			file: "images/surface_unpaved_very_horrible.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://wiki.openstreetmap.org/wiki/File:Very_horrible_ruts.jpg (Preslav)"
		},
		{
			file: "images/surface_wood.jpg",
			license: "CC-BY-SA 4.0",
			source: "https://commons.wikimedia.org/wiki/File:Wooden_Bridge_In_Midst_of_Kaziranga_Wild_life_Sanctuary.jpg (Pavan Goswami)"
		},
		{
			file: "images/surface_woodchips.jpg",
			license: "CC-BY-SA 3.0",
			source: "https://commons.wikimedia.org/wiki/File:Woodchips_surface.jpg (10992-osm)"
		}
	]
};
//#endregion
//#region ../data/dist/index.js
function t(t) {
	return e.surfaceAliases[t] ?? t;
}
function n(n) {
	return e.surfaces[n] ?? e.surfaces[t(n)];
}
function r(n) {
	let r = e.smoothnessMatrix[n] ?? e.smoothnessMatrix[t(n)];
	return r ? Object.entries(r).map(([t, n]) => ({
		smoothness: t,
		cell: n,
		level: e.smoothnessLevels[t]
	})) : [];
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-dispatch@3.0.1-44d06e028eeabd79/node_modules/d3-dispatch/src/dispatch.js
var i = { value: () => {} };
function a() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new o(n);
}
function o(e) {
	this._ = e;
}
function s(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
o.prototype = a.prototype = {
	constructor: o,
	on: function(e, t) {
		var n = this._, r = s(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = c(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = l(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = l(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new o(e);
	},
	call: function(e, t) {
		if ((i = arguments.length - 2) > 0) for (var n = Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
	},
	apply: function(e, t, n) {
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
	}
};
function c(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function l(e, t, n) {
	for (var r = 0, a = e.length; r < a; ++r) if (e[r].name === t) {
		e[r] = i, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var u = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/namespace.js
function d(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), u.hasOwnProperty(t) ? {
		space: u[t],
		local: e
	} : e;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/creator.js
function f(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function p(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function m(e) {
	var t = d(e);
	return (t.local ? p : f)(t);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selector.js
function h() {}
function g(e) {
	return e == null ? h : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/select.js
function _(e) {
	typeof e != "function" && (e = g(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new W(r, this._parents);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/array.js
function v(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selectorAll.js
function y() {
	return [];
}
function b(e) {
	return e == null ? y : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/selectAll.js
function x(e) {
	return function() {
		return v(e.apply(this, arguments));
	};
}
function ee(e) {
	e = typeof e == "function" ? x(e) : b(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new W(r, i);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/matcher.js
function S(e) {
	return function() {
		return this.matches(e);
	};
}
function C(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/selectChild.js
var w = Array.prototype.find;
function T(e) {
	return function() {
		return w.call(this.children, e);
	};
}
function E() {
	return this.firstElementChild;
}
function D(e) {
	return this.select(e == null ? E : T(typeof e == "function" ? e : C(e)));
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/selectChildren.js
var O = Array.prototype.filter;
function k() {
	return Array.from(this.children);
}
function A(e) {
	return function() {
		return O.call(this.children, e);
	};
}
function j(e) {
	return this.selectAll(e == null ? k : A(typeof e == "function" ? e : C(e)));
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/filter.js
function M(e) {
	typeof e != "function" && (e = S(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new W(r, this._parents);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/sparse.js
function N(e) {
	return Array(e.length);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/enter.js
function P() {
	return new W(this._enter || this._groups.map(N), this._parents);
}
function F(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
F.prototype = {
	constructor: F,
	appendChild: function(e) {
		return this._parent.insertBefore(e, this._next);
	},
	insertBefore: function(e, t) {
		return this._parent.insertBefore(e, t);
	},
	querySelector: function(e) {
		return this._parent.querySelector(e);
	},
	querySelectorAll: function(e) {
		return this._parent.querySelectorAll(e);
	}
};
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/constant.js
function te(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/data.js
function ne(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new F(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function re(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new F(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function ie(e) {
	return e.__data__;
}
function ae(e, t) {
	if (!arguments.length) return Array.from(this, ie);
	var n = t ? re : ne, r = this._parents, i = this._groups;
	typeof e != "function" && (e = te(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = oe(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new W(o, r), o._enter = s, o._exit = c, o;
}
function oe(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/exit.js
function se() {
	return new W(this._exit || this._groups.map(N), this._parents);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/join.js
function ce(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/merge.js
function le(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new W(s, this._parents);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/order.js
function ue() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/sort.js
function de(e) {
	e ||= fe;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new W(i, this._parents).order();
}
function fe(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/call.js
function pe() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/nodes.js
function me() {
	return Array.from(this);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/node.js
function he() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/size.js
function ge() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/empty.js
function _e() {
	return !this.node();
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/each.js
function ve(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/attr.js
function ye(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function be(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function xe(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Se(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Ce(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function we(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Te(e, t) {
	var n = d(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? be : ye : typeof t == "function" ? n.local ? we : Ce : n.local ? Se : xe)(n, t));
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/window.js
function I(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/style.js
function Ee(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function De(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function Oe(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function ke(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Ee : typeof t == "function" ? Oe : De)(e, t, n ?? "")) : Ae(this.node(), e);
}
function Ae(e, t) {
	return e.style.getPropertyValue(t) || I(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/property.js
function je(e) {
	return function() {
		delete this[e];
	};
}
function Me(e, t) {
	return function() {
		this[e] = t;
	};
}
function Ne(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function Pe(e, t) {
	return arguments.length > 1 ? this.each((t == null ? je : typeof t == "function" ? Ne : Me)(e, t)) : this.node()[e];
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/classed.js
function L(e) {
	return e.trim().split(/^|\s+/);
}
function R(e) {
	return e.classList || new z(e);
}
function z(e) {
	this._node = e, this._names = L(e.getAttribute("class") || "");
}
z.prototype = {
	add: function(e) {
		this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
	},
	remove: function(e) {
		var t = this._names.indexOf(e);
		t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
	},
	contains: function(e) {
		return this._names.indexOf(e) >= 0;
	}
};
function B(e, t) {
	for (var n = R(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function V(e, t) {
	for (var n = R(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function Fe(e) {
	return function() {
		B(this, e);
	};
}
function Ie(e) {
	return function() {
		V(this, e);
	};
}
function Le(e, t) {
	return function() {
		(t.apply(this, arguments) ? B : V)(this, e);
	};
}
function Re(e, t) {
	var n = L(e + "");
	if (arguments.length < 2) {
		for (var r = R(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? Le : t ? Fe : Ie)(n, t));
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/text.js
function ze() {
	this.textContent = "";
}
function Be(e) {
	return function() {
		this.textContent = e;
	};
}
function Ve(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function He(e) {
	return arguments.length ? this.each(e == null ? ze : (typeof e == "function" ? Ve : Be)(e)) : this.node().textContent;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/html.js
function Ue() {
	this.innerHTML = "";
}
function We(e) {
	return function() {
		this.innerHTML = e;
	};
}
function Ge(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function Ke(e) {
	return arguments.length ? this.each(e == null ? Ue : (typeof e == "function" ? Ge : We)(e)) : this.node().innerHTML;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/raise.js
function qe() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function Je() {
	return this.each(qe);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/lower.js
function Ye() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Xe() {
	return this.each(Ye);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/append.js
function Ze(e) {
	var t = typeof e == "function" ? e : m(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/insert.js
function Qe() {
	return null;
}
function $e(e, t) {
	var n = typeof e == "function" ? e : m(e), r = t == null ? Qe : typeof t == "function" ? t : g(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/remove.js
function et() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function tt() {
	return this.each(et);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/clone.js
function nt() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function rt() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function it(e) {
	return this.select(e ? rt : nt);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/datum.js
function at(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/on.js
function ot(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function st(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function ct(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function lt(e, t, n) {
	return function() {
		var r = this.__on, i, a = ot(t);
		if (r) {
			for (var o = 0, s = r.length; o < s; ++o) if ((i = r[o]).type === e.type && i.name === e.name) {
				this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
				return;
			}
		}
		this.addEventListener(e.type, a, n), i = {
			type: e.type,
			name: e.name,
			value: t,
			listener: a,
			options: n
		}, r ? r.push(i) : this.__on = [i];
	};
}
function ut(e, t, n) {
	var r = st(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? lt : ct, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/dispatch.js
function H(e, t, n) {
	var r = I(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function dt(e, t) {
	return function() {
		return H(this, e, t);
	};
}
function ft(e, t) {
	return function() {
		return H(this, e, t.apply(this, arguments));
	};
}
function pt(e, t) {
	return this.each((typeof t == "function" ? ft : dt)(e, t));
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/iterator.js
function* mt() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/index.js
var U = [null];
function W(e, t) {
	this._groups = e, this._parents = t;
}
function ht() {
	return new W([[document.documentElement]], U);
}
function gt() {
	return this;
}
W.prototype = ht.prototype = {
	constructor: W,
	select: _,
	selectAll: ee,
	selectChild: D,
	selectChildren: j,
	filter: M,
	data: ae,
	enter: P,
	exit: se,
	join: ce,
	merge: le,
	selection: gt,
	order: ue,
	sort: de,
	call: pe,
	nodes: me,
	node: he,
	size: ge,
	empty: _e,
	each: ve,
	attr: Te,
	style: ke,
	property: Pe,
	classed: Re,
	text: He,
	html: Ke,
	raise: Je,
	lower: Xe,
	append: Ze,
	insert: $e,
	remove: tt,
	clone: it,
	datum: at,
	on: ut,
	dispatch: pt,
	[Symbol.iterator]: mt
};
//#endregion
//#region ../../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/select.js
function G(e) {
	return typeof e == "string" ? new W([[document.querySelector(e)]], [document.documentElement]) : new W([[e]], U);
}
//#endregion
//#region src/logic.ts
var K = {
	surfaceKey: "surface",
	smoothnessKey: "smoothness"
};
function q(e = {}) {
	return {
		surfaceKey: e.surfaceKey ?? K.surfaceKey,
		smoothnessKey: e.smoothnessKey ?? K.smoothnessKey
	};
}
function J(e) {
	return e ? r(e).map((e) => e.smoothness) : [];
}
function Y(e, t) {
	return t ? J(e).includes(t) : !0;
}
function X(e, t, n = K) {
	let r = { [n.surfaceKey]: t || void 0 };
	return Y(t, e) || (r[n.smoothnessKey] = void 0), r;
}
function _t(e, t = K) {
	return { [t.smoothnessKey]: e || void 0 };
}
var Z = [
	"asphalt",
	"paving_stones",
	"concrete",
	"sett",
	"unhewn_cobblestone",
	"concrete:lanes",
	"compacted",
	"fine_gravel",
	"gravel",
	"grass_paver",
	"ground",
	"dirt"
];
function vt() {
	let t = Object.keys(e.surfaces);
	return [...Z.filter((e) => t.includes(e)), ...t.filter((e) => !Z.includes(e))];
}
function Q(t) {
	let n = t ? r(t) : [];
	return n.length ? n.map((e) => ({
		smoothness: e.smoothness,
		level: e.level,
		cell: e.cell
	})) : Object.values(e.smoothnessLevels).map((e) => ({
		smoothness: e.osmValue,
		level: e,
		cell: void 0
	}));
}
function $(t) {
	if (!t) return;
	let n = e.attribution.find((e) => e.file === t);
	return n ? `${n.source} (${n.license})` : void 0;
}
//#endregion
//#region src/createSurfaceSmoothnessField.impl.ts
function yt(t = {}, r = {}, i = {}) {
	let o = a("change"), s = q(t), c = i.t ?? ((e, t) => t), l = r.assetUrl ?? ((e) => e), u = {}, d = G(null), f = "images", p, m = !1, h = (e) => {
		let t = u[e];
		return typeof t == "string" && t ? t : void 0;
	}, g = (e) => Array.isArray(u[e]), _ = (e) => i.optionLabel?.("surface", e) ?? n(e)?.title ?? e, v = (t) => i.optionLabel?.("smoothness", t) ?? e.smoothnessLevels[t]?.title ?? t;
	function y(e) {
		u = {
			...u,
			...e
		}, C(), o.call("change", P, e);
	}
	function b(e) {
		if (m = !1, p = e ? "smoothness" : void 0, e === h(s.surfaceKey)) return C();
		y(X(h(s.smoothnessKey), e, s));
	}
	function x(e) {
		p = void 0, y(_t(e, s));
	}
	function ee(e) {
		let t = e === "smoothness" && !h(s.surfaceKey) ? "surface" : e;
		p = p === t ? void 0 : t, m = !1, C();
	}
	function S(e, t, n) {
		let r = `.${n.split(" ").join(".")}`, i = e.selectAll(`:scope > ${r}`).data([0]);
		return i.enter().append(t).attr("class", n).merge(i);
	}
	function C() {
		if (d.empty() || !d.node()) return;
		d.attr("data-mode", f);
		let e = d.selectAll(":scope > .ssf-images").data(f === "images" ? [0] : []);
		e.exit().remove();
		let t = e.enter().append("div").attr("class", "ssf-images").merge(e), n = d.selectAll(":scope > .ssf-text").data(f === "text" ? [0] : []);
		n.exit().remove();
		let r = n.enter().append("div").attr("class", "ssf-text").merge(n);
		f === "images" ? w(t) : A(r);
	}
	function w(t) {
		let r = h(s.surfaceKey), i = h(s.smoothnessKey), a = Q(r).find((e) => e.smoothness === i), o = c("multiple_values", "Multiple values"), l = S(t, "div", "ssf-pair");
		T(l, {
			id: "surface",
			photo: r ? n(r)?.icon ?? void 0 : void 0,
			emoji: void 0,
			title: g(s.surfaceKey) ? o : r ? _(r) : void 0,
			placeholder: c("surface", "Surface"),
			tag: r ? `${s.surfaceKey}=${r}` : void 0
		}), T(l, {
			id: "smoothness",
			photo: a?.cell?.photo,
			emoji: i ? e.smoothnessLevels[i]?.emoji ?? void 0 : void 0,
			title: g(s.smoothnessKey) ? o : i ? v(i) : void 0,
			placeholder: c("smoothness", "Smoothness"),
			tag: i ? `${s.smoothnessKey}=${i}` : void 0
		});
		let u = t.selectAll(":scope > .ssf-picker").data(p ? [p] : [], (e) => e);
		u.exit().remove();
		let d = u.enter().append("div").attr("class", (e) => `ssf-picker ssf-picker-${e}`).merge(u);
		p === "surface" && E(d, r), p === "smoothness" && r && D(d, r, Q(r), i), p && j(d, p);
	}
	function T(e, t) {
		let n = S(e, "button", `ssf-value ssf-value-${t.id}`).attr("type", "button").classed("empty", !t.title).classed("open", p === t.id).attr("aria-expanded", String(p === t.id)).attr("title", [t.tag, $(t.photo) ? `${c("photo", "Photo")}: ${$(t.photo)}` : ""].filter(Boolean).join("\n") || null).on("click", (e) => {
			e.preventDefault(), ee(t.id);
		});
		n.html("");
		let r = n.append("span").attr("class", "ssf-value-visual");
		t.photo ? r.append("img").attr("src", l(t.photo)).attr("alt", "") : t.emoji && r.append("span").attr("class", "ssf-value-emoji").text(t.emoji), n.append("span").attr("class", "ssf-value-title").text(t.title ? `${t.photo && t.emoji ? `${t.emoji} ` : ""}${t.title}` : t.placeholder);
	}
	function E(e, t) {
		let r = vt(), i = m ? r : r.filter((e) => Z.includes(e) || e === t), a = [...i.map((e) => ({ surface: e })), { more: !0 }], o = S(e, "div", "ssf-tiles").selectAll("button.ssf-tile").data(a, (e) => "more" in e ? "_more" : e.surface);
		o.exit().remove();
		let u = o.enter().append("button").attr("type", "button").attr("class", (e) => "more" in e ? "ssf-tile ssf-tile-more" : "ssf-tile");
		u.each(function(e) {
			let t = G(this), r = t.append("span").attr("class", "ssf-tile-visual");
			if (t.append("span").attr("class", "ssf-tile-title"), "more" in e) return;
			let i = n(e.surface)?.icon;
			i && r.append("img").attr("loading", "lazy").attr("src", l(i)).attr("alt", "");
		});
		let d = u.merge(o).order().classed("selected", (e) => "surface" in e && e.surface === t).attr("aria-pressed", (e) => "surface" in e ? String(e.surface === t) : null).attr("title", (e) => {
			if ("more" in e) return null;
			let t = $(n(e.surface)?.icon);
			return `${s.surfaceKey}=${e.surface}${t ? `\n${c("photo", "Photo")}: ${t}` : ""}`;
		}).on("click", (e, t) => {
			e.preventDefault(), "more" in t ? (m = !m, C()) : b(t.surface);
		});
		d.select(".ssf-tile-title").text((e) => "more" in e ? m ? c("fewer", "Fewer") : c("more", "More") : _(e.surface)), d.filter((e) => "more" in e).select(".ssf-tile-visual").text(m ? "−" : `+${r.length - i.length}`);
	}
	function D(e, t, n, r) {
		let i = n.some((e) => e.cell);
		e.selectAll(i ? ":scope > .ssf-levels" : ":scope > .ssf-cards").remove();
		let a = S(e, "div", i ? "ssf-cards" : "ssf-levels").selectAll("button.ssf-card").data(n, (e) => `${t}/${e.smoothness}`);
		a.exit().remove();
		let o = a.enter().append("button").attr("type", "button").attr("class", "ssf-card");
		o.each(function(e) {
			let t = G(this);
			e.cell && t.append("img").attr("class", "ssf-card-photo").attr("loading", "lazy").attr("src", l(e.cell.photo)).attr("alt", "");
			let n = t.append("span").attr("class", "ssf-card-head");
			n.append("span").attr("class", "ssf-card-emoji").text(e.level?.emoji ?? ""), n.append("span").attr("class", "ssf-card-title").text(v(e.smoothness));
		}), o.merge(a).order().classed("selected", (e) => e.smoothness === r).attr("aria-pressed", (e) => String(e.smoothness === r)).attr("title", (e) => {
			let t = [`${s.smoothnessKey}=${e.smoothness}`];
			e.cell?.description && t.push(e.cell.description);
			let n = $(e.cell?.photo);
			return n && t.push(`${c("photo", "Photo")}: ${n}`), t.join("\n");
		}).on("click", (e, t) => {
			e.preventDefault(), x(t.smoothness === r ? void 0 : t.smoothness);
		});
	}
	function O(t) {
		let n = t === "surface" ? vt() : Object.keys(e.smoothnessLevels), r = i.options?.(t) ?? [];
		return [...n, ...r.filter((e) => !n.includes(e))];
	}
	function k(e) {
		return e === "surface" ? {
			name: e,
			key: s.surfaceKey,
			label: c("surface", "Surface"),
			values: O("surface"),
			title: _
		} : {
			name: e,
			key: s.smoothnessKey,
			label: c("smoothness", "Smoothness"),
			values: O("smoothness"),
			title: v
		};
	}
	function A(e) {
		let t = S(e, "ul", "rows rows-table ssf-text-rows").selectAll(":scope > li").data([k("surface"), k("smoothness")], (e) => e.key), n = t.enter().append("li").attr("class", "labeled-input");
		n.append("div").attr("class", "label"), n.append("div").attr("class", "ssf-text-cell");
		let r = n.merge(t);
		r.select(".label").text((e) => e.label), r.select(".ssf-text-cell").each((e, t, n) => {
			let r = n[t];
			r && M(G(r), e);
		});
	}
	function j(e, t) {
		M(S(e, "div", "ssf-picker-dropdown ssf-text-cell"), k(t));
	}
	function M(e, t) {
		let n = S(e, "input", "ssf-text-input").attr("type", "text").attr("autocomplete", "off"), r = S(e, "ul", "ssf-combo-list"), i = n.node();
		if (!i) return;
		let a = u[t.key];
		document.activeElement !== i && (i.value = typeof a == "string" ? t.title(a) : "", r.style("display", "none")), i.placeholder = Array.isArray(a) ? c("multiple_values", "Multiple values") : c(`${t.name}_placeholder`, `${t.title(t.values[0] ?? "")}…`);
		let o = (e) => {
			e !== (typeof u[t.key] == "string" ? u[t.key] : void 0) && (t.key === s.surfaceKey ? b(e) : x(e));
		}, l = () => {
			let e = i.value.trim(), n = t.values.find((n) => n === e || t.title(n).toLowerCase() === e.toLowerCase());
			o(e ? n ?? e : void 0);
		};
		n.on("focus input", () => N(r, t, i.value)).on("keydown", (e) => {
			e.key === "Enter" ? (e.preventDefault(), i.blur()) : e.key === "Escape" && r.style("display", "none");
		}).on("blur", () => {
			r.style("display", "none"), l();
		}), r.on("mousedown", (e) => {
			let n = e.target.closest("li");
			n?.__data__ && (e.preventDefault(), i.value = t.title(n.__data__), r.style("display", "none"), i.blur(), o(n.__data__));
		});
	}
	function N(e, t, n) {
		let r = n.trim().toLowerCase(), i = t.values.filter((e) => !r || e.toLowerCase().includes(r) || t.title(e).toLowerCase().includes(r));
		e.style("display", i.length ? "block" : "none");
		let a = e.selectAll("li").data(i, (e) => e);
		a.exit().remove();
		let o = a.enter().append("li").attr("class", "ssf-combo-item");
		o.append("span").attr("class", "ssf-combo-title"), o.append("span").attr("class", "ssf-combo-code");
		let s = o.merge(a).order();
		s.select(".ssf-combo-title").text((e) => t.title(e)), s.select(".ssf-combo-code").text((e) => e);
	}
	let P = ((e) => {
		let t = e.selectAll(".surface-smoothness-field").data([0]);
		d = t.enter().append("div").attr("class", "surface-smoothness-field").merge(t), C();
	});
	return P.tags = (e) => (u = e ?? {}, C(), P), P.entityIDs = () => (p = void 0, m = !1, P), P.focus = () => (d.select("button, input").node()?.focus(), P), P.mode = ((e) => e === void 0 ? f : (f = e, C(), P)), P.on = (e, t) => (o.on(e, t), P), P;
}
//#endregion
export { yt as createSurfaceSmoothnessField, Y as isSmoothnessValidForSurface, q as resolveKeys, _t as smoothnessChangePatch, J as smoothnessValuesForSurface, X as surfaceChangePatch };
