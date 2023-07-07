import z from "zod";

// ------------------------------------
// GET SINGLE
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
  id: z.string(),
  form_key: z.string(),
});

// ------------------------------------
// DELETE SINGLE
const deleteSingleBody = z.object({});
const deleteSingleQuery = z.object({});
const deleteSingleParams = z.object({
  id: z.string(),
  form_key: z.string(),
});

// ------------------------------------
// GET MULTIPLE
const getMultipleBody = z.object({});
const getMultipleQuery = z.object({
  sort: z
    .array(
      z.object({
        key: z.enum(["created_at", "updated_at", "read_at"]),
        value: z.enum(["asc", "desc"]),
      })
    )
    .optional(),
  include: z.array(z.enum(["fields"])).optional(),
  page: z.string().optional(),
  per_page: z.string().optional(),
});
const getMultipleParams = z.object({
  form_key: z.string(),
});

// ------------------------------------
// TOGGLE READ AT
const toggleReadAtBody = z.object({});
const toggleReadAtQuery = z.object({});
const toggleReadAtParams = z.object({
  id: z.string(),
  form_key: z.string(),
});

// ------------------------------------
// EXPORT
export default {
  getSingle: {
    body: getSingleBody,
    query: getSingleQuery,
    params: getSingleParams,
  },
  getMultiple: {
    body: getMultipleBody,
    query: getMultipleQuery,
    params: getMultipleParams,
  },
  toggleReadAt: {
    body: toggleReadAtBody,
    query: toggleReadAtQuery,
    params: toggleReadAtParams,
  },
  deleteSingle: {
    body: deleteSingleBody,
    query: deleteSingleQuery,
    params: deleteSingleParams,
  },
};