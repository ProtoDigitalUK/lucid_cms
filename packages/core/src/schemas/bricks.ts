import z from "zod";
import { FieldTypesEnum } from "@builders/brick-builder/index.js";

const FieldTypesSchema = z.nativeEnum(FieldTypesEnum);

// ------------------------------------
// UPDATE BRICKS / FIELDS
export const FieldSchema = z.object({
  key: z.string(),
  type: FieldTypesSchema,
  value: z.union([
    z.string(),
    z.boolean(),
    z.number(),
    z.object({
      id: z.number().nullable(),
      target: z.string().nullable().optional(),
      label: z.string().nullable().optional(),
    }),
    z.object({
      url: z.string().nullable(),
      target: z.string().nullable().optional(),
      label: z.string().nullable().optional(),
    }),
    z.null(),
    z.object({}).optional(),
  ]),
  language_id: z.number(),
  fields_id: z.number().optional(),
  group_id: z.union([z.number(), z.string()]).optional(),
});

export const GroupSchema = z.object({
  group_id: z.union([z.number(), z.string()]), // if prefixed with ref-, it needs creating - its just a placeholder id to marry up fields that reference it
  group_order: z.number(),
  parent_group_id: z.union([z.number(), z.string(), z.null()]).optional(),
  repeater_key: z.string().optional(),
  language_id: z.number(),
});

export const BrickSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  key: z.string(),
  order: z.number(),
  type: z.union([z.literal("builder"), z.literal("fixed")]),

  groups: z.array(GroupSchema).optional(),
  fields: z.array(FieldSchema).optional(),
});

// ------------------------------------
// GET ALL CONFIG
const getAllConfigBody = z.object({});
const getAllConfigQuery = z.object({
  include: z.array(z.enum(["fields"])).optional(),
  filter: z
    .object({
      collection_key: z.string().optional(),
      environment_key: z.string().optional(),
    })
    .optional()
    .refine(
      (data) =>
        (data?.collection_key && data?.environment_key) ||
        (!data?.collection_key && !data?.environment_key),
      {
        message:
          "Both collection_key and environment_key should be set or neither.",
        path: [],
      }
    ),
});
const getAllConfigParams = z.object({});

// ------------------------------------
// GET SINGLE CONFIG
const getSingleConfigBody = z.object({});
const getSingleConfigQuery = z.object({});
const getSingleConfigParams = z.object({
  brick_key: z.string().nonempty(),
});

// ------------------------------------
// EXPORT
export default {
  config: {
    getAll: {
      body: getAllConfigBody,
      query: getAllConfigQuery,
      params: getAllConfigParams,
    },
    getSingle: {
      body: getSingleConfigBody,
      query: getSingleConfigQuery,
      params: getSingleConfigParams,
    },
  },
};
