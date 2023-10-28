import createSingle from "./create-single.js";
import deleteSingle from "./delete-single.js";
import getMultiple from "./get-multiple.js";
import getSingle from "./get-single.js";
import updateSingle from "./update-single.js";
import checkPageExists from "./check-page-exists.js"; // needs use verified
import buildUniqueSlug from "./build-unique-slug.js";
import parentChecks from "./parent-checks.js"; // verified
import resetHomepages from "./reset-homepages.js"; // verified
import checkPageCollection from "./check-page-collection.js"; // verified
import checkParentAncestry from "./check-parent-ancestry.js";
import deleteMultiple from "./delete-multiple.js";
import getMultipleValidParents from "./get-multiple-valid-parents.js";

export default {
  createSingle,
  deleteSingle,
  getMultiple,
  getSingle,
  updateSingle,
  checkPageExists,
  buildUniqueSlug,
  parentChecks,
  resetHomepages,
  checkPageCollection,
  checkParentAncestry,
  deleteMultiple,
  getMultipleValidParents,
};
