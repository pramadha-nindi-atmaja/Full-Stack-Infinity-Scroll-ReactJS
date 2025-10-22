import prisma from "../utils/client.js";

/**
 * Controller: Get paginated and searchable list of personal data
 * @async
 * @function getPersonals
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getPersonals = async (req, res) => {
  try {
    const pagination = extractPaginationParams(req);
    const search = extractSearchParams(req);

    const queryOptions = buildQueryOptions(pagination, search);
    const results = await prisma.personaldata.findMany(queryOptions);

    return sendSuccessResponse(res, results, pagination.limit);
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * Extracts pagination parameters from request query
 * @param {import('express').Request} req
 * @returns {{ lastId: number, limit: number }}
 */
const extractPaginationParams = (req) => ({
  lastId: Number(req.query.lastId) || 0,
  limit: Math.min(Number(req.query.limit) || 10, 100), // protect from large queries
});

/**
 * Extracts search query parameter
 * @param {import('express').Request} req
 * @returns {{ query: string }}
 */
const extractSearchParams = (req) => ({
  query: req.query.search_query?.trim() || "",
});

/**
 * Constructs query options for Prisma
 * @param {{ lastId: number, limit: number }} pagination
 * @param {{ query: string }} search
 * @returns {object}
 */
const buildQueryOptions = (pagination, search) => {
  const where = buildWhereCondition(pagination.lastId, search.query);

  return {
    where,
    take: pagination.limit,
    orderBy: { id: "desc" },
  };
};

/**
 * Builds combined filter for search and pagination
 * @param {number} lastId
 * @param {string} query
 * @returns {object}
 */
const buildWhereCondition = (lastId, query) => {
  const conditions = [];

  if (lastId > 0) {
    conditions.push({ id: { lt: lastId } });
  }

  if (query) {
    conditions.push({
      OR: [
        { first_name: { contains: query, mode: "insensitive" } },
        { last_name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { gender: { contains: query, mode: "insensitive" } },
        { ip_address: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (conditions.length === 0) return {};
  if (conditions.length === 1) return conditions[0];

  return { AND: conditions };
};

/**
 * Sends a formatted successful JSON response
 * @param {import('express').Response} res
 * @param {Array} data
 * @param {number} limit
 */
const sendSuccessResponse = (res, data, limit) => {
  const lastId = data?.length ? data[data.length - 1].id : 0;

  res.status(200).json({
    success: true,
    result: data,
    lastId,
    hasMore: data.length >= limit,
  });
};

/**
 * Handles and sends standardized error responses
 * @param {import('express').Response} res
 * @param {Error} error
 */
const handleError = (res, error) => {
  console.error("[PersonalDataController] Error:", error);

  res.status(500).json({
    success: false,
    error: "Failed to fetch personal data",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
  });
};
