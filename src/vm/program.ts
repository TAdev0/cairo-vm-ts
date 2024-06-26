import { z } from 'zod';

import { Felt } from 'primitives/felt';

const ApTrackingData = z.object({
  group: z.number(),
  offset: z.number(),
});

const Reference = z.object({
  ap_tracking_data: ApTrackingData,
  pc: z.number(),
  value: z.string(),
});

const ReferenceManager = z.object({
  references: z.array(Reference),
});

type ReferenceManager = z.infer<typeof ReferenceManager>;

const Identifier = z.object({
  full_name: z.string().optional(),
  members: z.record(z.string(), z.any()).optional(),
  size: z.number().optional(),
  decorators: z.array(z.string()).optional(),
  pc: z.number().optional(),
  type: z.string().optional(),
  cairo_type: z.string().optional(),
  value: z
    .number()
    .transform((value) => new Felt(BigInt(value)))
    .optional(),
  destination: z.string().optional(),
});

export type Identifier = z.infer<typeof Identifier>;

const Program = z.object({
  attributes: z.any(),
  builtins: z.array(z.string()),
  compiler_version: z.string(),
  data: z
    .array(z.string())
    .transform((value) => value.map((v) => new Felt(BigInt(v)))),
  debug_info: z.any(), // TODO: DebugInfo
  hints: z.record(z.string(), z.any()), // TODO: HintParams
  identifiers: z
    .record(z.string(), Identifier)
    .transform((value) => new Map<string, Identifier>(Object.entries(value))),
  main_scope: z.string(),
  prime: z.string(),
  reference_manager: ReferenceManager,
});

export type Program = z.infer<typeof Program>;

export function parseProgram(program: string): Program {
  return Program.parse(JSON.parse(program));
}
