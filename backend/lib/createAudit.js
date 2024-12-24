import Audit from "../models/Audit.js";

export const createAudit = async (
  action,
  targetType,
  targetId,
  performedBy,
  details
) => {
  try {
    // Action = Created, Resolved, Dismissed, Deleted, Edited, Reviewed
    // targetType = listing, user
    // details max length = 1000 characters
    const audit = new Audit({
      action,
      targetType,
      targetId,
      performedBy,
      details,
    });
    await audit.save();
  } catch (error) {
    console.error(error);
  }
};
