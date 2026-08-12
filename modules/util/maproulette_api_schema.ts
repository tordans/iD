/**
 * Zod 4 schemas for MapRoulette API wire shapes and session earmarks.
 * Parse at the service boundary so callers can trust normalized fields.
 */
import { z } from 'zod';

/** MapRoulette status codes used in this fork (Created … Too Hard). */
export const MrStatusCode = z.coerce.number().int().finite();

const IdLike = z.union([z.string(), z.number()]).transform(function(v) {
  return String(v);
});

const OptionalFiniteInt = z.preprocess(
  function(v) {
    if (v === null || v === undefined || v === '') return undefined;
    return v;
  },
  z.coerce.number().int().finite().optional(),
);

const OptionalString = z.preprocess(
  function(v) {
    if (v === null || v === undefined) return undefined;
    return String(v);
  },
  z.string().optional(),
);

const MrPoint = z.object({
  lng: z.coerce.number().finite(),
  lat: z.coerce.number().finite(),
});

/**
 * GET /tasks/box item (includeGeometries=true).
 * Unknown fields are kept for pin-snap / OSM-id / cooperative helpers.
 */
export const MrBoxTaskSchema = z.object({
  id: IdLike,
  parentId: IdLike,
  point: MrPoint,
  status: OptionalFiniteInt,
  priority: OptionalFiniteInt,
  mappedOn: OptionalString,
  title: OptionalString,
  name: OptionalString,
  geometries: z.unknown().optional(),
  cooperativeWork: z.unknown().optional(),
}).passthrough();

export type MrBoxTask = z.infer<typeof MrBoxTaskSchema>;

export const MrBoxResponseSchema = z.union([
  z.array(z.unknown()),
  z.object({ tasks: z.array(z.unknown()) }).passthrough(),
]);

/** Safe-parse each box task; drop rows that fail (e.g. missing point). */
export function parseMrBoxTasks(data: unknown): MrBoxTask[] {
  const envelope = MrBoxResponseSchema.safeParse(data);
  if (!envelope.success) return [];
  const list = Array.isArray(envelope.data)
    ? envelope.data
    : (envelope.data.tasks || []);
  const out: MrBoxTask[] = [];
  list.forEach(function(row) {
    const parsed = MrBoxTaskSchema.safeParse(row);
    if (parsed.success) out.push(parsed.data);
  });
  return out;
}

/** GET /challenge/{id} fields this app reads. */
export const MrChallengeSchema = z.object({
  id: IdLike.optional(),
  name: OptionalString,
  enabled: z.boolean().optional(),
  deleted: z.boolean().optional(),
  instruction: OptionalString,
  description: OptionalString,
  checkinComment: OptionalString,
  checkinSource: OptionalString,
}).passthrough();

export type MrChallenge = z.infer<typeof MrChallengeSchema>;

export function parseMrChallenge(data: unknown): MrChallenge | null {
  const parsed = MrChallengeSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export function challengeIsVisible(ch: MrChallenge | null | undefined): boolean {
  return !!(ch && ch.enabled && !ch.deleted);
}

const MrGeometriesSchema = z.object({
  type: z.string().optional(),
  features: z.array(z.unknown()).optional(),
  cooperativeWork: z.unknown().optional(),
}).passthrough();

/** GET /task/{id}. */
export const MrTaskDetailsSchema = z.object({
  id: IdLike.optional(),
  parentId: IdLike.optional(),
  title: OptionalString,
  status: OptionalFiniteInt,
  priority: OptionalFiniteInt,
  mappedOn: OptionalString,
  geometries: MrGeometriesSchema.nullish(),
  cooperativeWork: z.unknown().optional(),
}).passthrough();

export type MrTaskDetails = z.infer<typeof MrTaskDetailsSchema>;

export function parseMrTaskDetails(data: unknown): MrTaskDetails | null {
  const parsed = MrTaskDetailsSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

/** sessionStorage `iD-maproulette-earmarks` row. */
export const MrEarmarkSchema = z.object({
  taskID: IdLike,
  challengeID: z.preprocess(
    function(v) {
      if (v === null || v === undefined) return '';
      return String(v);
    },
    z.string(),
  ),
  parentName: z.preprocess(
    function(v) {
      if (v === null || v === undefined) return '';
      return String(v);
    },
    z.string(),
  ),
  title: z.preprocess(
    function(v) {
      if (v === null || v === undefined) return '';
      return String(v);
    },
    z.string(),
  ),
  elems: z.preprocess(
    function(v) {
      return Array.isArray(v) ? v.map(String) : [];
    },
    z.array(z.string()),
  ),
  loc: z.preprocess(
    function(v) {
      if (!Array.isArray(v) || v.length < 2) return null;
      const lng = Number(v[0]);
      const lat = Number(v[1]);
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
      return [lng, lat];
    },
    z.tuple([z.number().finite(), z.number().finite()]).nullable(),
  ),
  newComment: z.preprocess(
    function(v) {
      if (v === null || v === undefined) return '';
      return String(v);
    },
    z.string(),
  ),
  _status: z.preprocess(
    function(v) {
      if (v === null || v === undefined || v === '') return 1; // FIXED
      return v;
    },
    z.coerce.number().int().finite(),
  ),
  includeInUpload: z.preprocess(
    function(v) {
      if (v === undefined) return true;
      return !!v;
    },
    z.boolean(),
  ),
  localDone: z.boolean().optional(),
});

export type MrEarmark = z.infer<typeof MrEarmarkSchema>;

export function parseMrEarmarkList(data: unknown): MrEarmark[] {
  if (!Array.isArray(data)) return [];
  const out: MrEarmark[] = [];
  data.forEach(function(row) {
    const parsed = MrEarmarkSchema.safeParse(row);
    if (parsed.success && parsed.data.taskID) out.push(parsed.data);
  });
  return out;
}

/** Prefer task.status / priority from a parsed API task for QAItem fields. */
export function mrTaskStatusOr(
  task: { status?: number | undefined },
  fallback: number,
): number {
  return task.status !== undefined ? task.status : fallback;
}

export function mrTaskPriorityOf(
  task: { priority?: number | undefined },
): number | undefined {
  return task.priority;
}
