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

/** GeoJSON-ish FeatureCollection used for pin snap + OSM ids. */
export const MrGeometriesSchema = z.object({
  type: z.string().optional(),
  features: z.array(z.unknown()).optional(),
  cooperativeWork: z.unknown().optional(),
}).passthrough();

export type MrGeometries = z.infer<typeof MrGeometriesSchema>;

/**
 * Cooperative Tag Fix / OSC payload (meta.type 1 = tag fix, 2 = OSC).
 * @see https://learn.maproulette.org/en-US/documentation/creating-cooperative-challenges/
 */
export const MrTagValueSchema = z.union([z.string(), z.number(), z.boolean()]);

/** setTags `data` map — values coerced to strings by callers. */
export const MrSetTagsDataSchema = z.record(z.string(), MrTagValueSchema.nullable());

export type MrSetTagsData = z.infer<typeof MrSetTagsDataSchema>;

export const MrUnsetTagsDataSchema = z.array(z.union([z.string(), z.number()]));

export type MrUnsetTagsData = z.infer<typeof MrUnsetTagsDataSchema>;

export const MrCooperativeChildOpSchema = z.object({
  operation: z.string().optional(),
  operationType: z.string().optional(),
  data: z.unknown().optional(),
}).passthrough();

export type MrCooperativeChildOp = z.infer<typeof MrCooperativeChildOpSchema>;

export const MrModifyElementOpSchema = z.object({
  operationType: z.literal('modifyElement'),
  data: z.object({
    id: z.union([z.string(), z.number()]),
    operations: z.array(MrCooperativeChildOpSchema).optional(),
  }).passthrough(),
}).passthrough();

export type MrModifyElementOp = z.infer<typeof MrModifyElementOpSchema>;

export const MrCooperativeWorkSchema = z.object({
  meta: z.object({
    type: OptionalFiniteInt,
    version: OptionalFiniteInt,
  }).passthrough().optional(),
  operations: z.array(z.unknown()).optional(),
}).passthrough();

export type MrCooperativeWork = z.infer<typeof MrCooperativeWorkSchema>;

/** Task-shaped object that may carry cooperativeWork at top level or under geometries. */
export const MrCooperativeCarrierSchema = z.object({
  cooperativeWork: z.unknown().optional(),
  geometries: z.object({
    cooperativeWork: z.unknown().optional(),
  }).passthrough().optional(),
}).passthrough();

export function parseMrCooperativeWork(raw: unknown): MrCooperativeWork | null {
  const parsed = MrCooperativeWorkSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

/** Pull cooperativeWork from task / geometry shapes; null if absent or invalid. */
export function extractMrCooperativeWork(task: unknown): MrCooperativeWork | null {
  const carrier = MrCooperativeCarrierSchema.safeParse(task);
  if (!carrier.success) return null;
  const candidate = carrier.data.cooperativeWork
    ?? (carrier.data.geometries && carrier.data.geometries.cooperativeWork);
  return parseMrCooperativeWork(candidate);
}

/** Parse setTags child `data` into a string→value map; null if not an object map. */
export function parseMrSetTagsData(data: unknown): MrSetTagsData | null {
  const parsed = MrSetTagsDataSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

/** Parse unsetTags child `data` into key strings. */
export function parseMrUnsetTagKeys(data: unknown): string[] {
  const parsed = MrUnsetTagsDataSchema.safeParse(data);
  if (!parsed.success) return [];
  return parsed.data.map(String).filter(Boolean);
}

/**
 * Accept either a geometries FeatureCollection or a task that wraps one.
 * Used by pin-snap after box/detail fetch.
 */
export function unwrapMrGeometries(taskOrGeometries: unknown): unknown {
  const wrapped = z.object({
    geometries: z.unknown().optional(),
  }).passthrough().safeParse(taskOrGeometries);
  if (wrapped.success && wrapped.data.geometries !== null && wrapped.data.geometries !== undefined) {
    return wrapped.data.geometries;
  }
  return taskOrGeometries;
}

/** Non-empty cached challenge/task detail; empty `{}` from failed parse → null. */
export function asParsedOrNull<T extends object>(
  value: T | Record<string, never> | null | undefined,
): T | null {
  if (!value || typeof value !== 'object') return null;
  return Object.keys(value).length ? (value as T) : null;
}

export function isMrTagFixCooperativeWork(cw: MrCooperativeWork | null): boolean {
  if (!cw) return false;
  const type = cw.meta && cw.meta.type;
  if (type === 2) return false;
  if (type === 1) return true;
  const version = cw.meta && cw.meta.version;
  if (version === 1 || (type === undefined && Array.isArray(cw.operations))) {
    return Array.isArray(cw.operations) && cw.operations.some(function(op) {
      return MrModifyElementOpSchema.safeParse(op).success;
    });
  }
  return false;
}

export function parseMrModifyElementOps(cw: MrCooperativeWork): MrModifyElementOp[] {
  if (!Array.isArray(cw.operations)) return [];
  const out: MrModifyElementOp[] = [];
  cw.operations.forEach(function(op) {
    const parsed = MrModifyElementOpSchema.safeParse(op);
    if (parsed.success) out.push(parsed.data);
  });
  return out;
}

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
  geometries: MrGeometriesSchema.optional(),
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

/** GET /task/{id}. */
export const MrTaskDetailsSchema = z.object({
  id: IdLike.optional(),
  parentId: IdLike.optional(),
  title: OptionalString,
  instruction: OptionalString,
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

/**
 * Composed sidebar/detail payload from challenge + task detail + box task.
 * Callers can trust string ids and string instruction fields.
 */
export type MrTaskDetailView = {
  id: string;
  parentId: string;
  parentName: string;
  title: string;
  instruction: string;
  description: string;
  taskFeatures: unknown[];
  cooperativeWork?: MrCooperativeWork;
  [key: string]: unknown;
};

export function buildMrTaskDetailView(input: {
  id: string | number;
  parentId: string | number;
  baseTask?: Record<string, unknown> | null;
  challenge?: MrChallenge | null;
  taskDetails?: MrTaskDetails | null;
}): MrTaskDetailView {
  const base = (input.baseTask && typeof input.baseTask === 'object')
    ? input.baseTask
    : {};
  const ch = input.challenge || null;
  const td = input.taskDetails || null;
  const cooperativeWork = extractMrCooperativeWork(td)
    || extractMrCooperativeWork(base)
    || undefined;

  function firstNonEmptyInstruction(...values: unknown[]): string {
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      if (typeof v === 'string' && v.trim()) return v;
    }
    return '';
  }

  const detail: MrTaskDetailView = {
    ...base,
    id: String(input.id),
    parentId: String(input.parentId),
    parentName: (ch && ch.name) || '',
    title: (td && td.title) || (typeof base.title === 'string' ? base.title : '') || '',
    instruction: firstNonEmptyInstruction(
      td && td.instruction,
      base.instruction,
      ch && ch.instruction,
    ),
    description: (ch && ch.description) || '',
    taskFeatures: (td && td.geometries && Array.isArray(td.geometries.features))
      ? td.geometries.features
      : [],
  };
  if (cooperativeWork) detail.cooperativeWork = cooperativeWork;
  return detail;
}

/** Minimal locatable task for go-to-nearest navigation. */
export type MrLocatableTask = {
  id: string | number;
  loc: [number, number];
};

export function asMrLocatableTask(task: unknown): MrLocatableTask | null {
  const parsed = z.object({
    id: IdLike,
    loc: z.tuple([z.number().finite(), z.number().finite()]),
  }).safeParse(task);
  return parsed.success ? parsed.data : null;
}

/**
 * Status fields we read off cached QAItems (not API wire — already normalized).
 * Prefer this over `any` in status helpers.
 */
export type MrQaStatusLike = {
  id?: string | number;
  taskStatus?: number | null;
  mappedOn?: string | null;
  taskPriority?: number | null;
  parentId?: string | number;
  elems?: string[];
  elemsResolved?: boolean;
  earmarked?: boolean;
  task?: {
    status?: number | null;
    mappedOn?: string | null;
    priority?: number | null;
    title?: string | null;
    parentId?: string | number;
    newComment?: string | null;
    cooperativeWork?: unknown;
    geometries?: unknown;
  } | null;
  newComment?: string | null;
  parentName?: string | null;
  loc?: [number, number] | null;
};

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
  completionResponses: z.record(
    z.string(),
    z.union([z.string(), z.boolean()]),
  ).optional(),
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

/** Feature list for pin snap / OSM id collection. */
export function mrGeometryFeatures(geometries: unknown): unknown[] {
  const parsed = MrGeometriesSchema.safeParse(geometries);
  if (parsed.success && Array.isArray(parsed.data.features)) {
    return parsed.data.features;
  }
  if (Array.isArray(geometries)) return geometries;
  return [];
}
