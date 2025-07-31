import prisma from "../utils/client.js";

/**
 * Retrieves personal data with pagination and search functionality
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPersonals = async (req, res) => {
  try {
    const paginationParams = extractPaginationParams(req);
    const searchParams = extractSearchParams(req);
    
    const queryOptions = buildQueryOptions(paginationParams, searchParams);
    const personalData = await fetchPersonalData(queryOptions);
    
    sendSuccessResponse(res, personalData, paginationParams.limit);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Extracts pagination parameters from request
 */
const extractPaginationParams = (req) => {
  return {
    lastId: parseInt(req.query.lastId) || 0,
    limit: parseInt(req.query.limit) || 10
  };
};

/**
 * Extracts search parameters from request
 */
const extractSearchParams = (req) => {
  return {
    query: req.query.search_query || ""
  };
};

/**
 * Builds query options for database
 */
const buildQueryOptions = (paginationParams, searchParams) => {
  const { lastId, limit } = paginationParams;
  const { query } = searchParams;
  
  const searchConditions = buildSearchConditions(query);
  const whereCondition = buildWhereCondition(lastId, searchConditions);
  
  return {
    where: whereCondition,
    take: limit,
    orderBy: { id: "desc" }
  };
};

/**
 * Builds search conditions for query
 */
const buildSearchConditions = (query) => {
  if (!query) return {};
  
  return {
    OR: [
      { first_name: { contains: query, mode: 'insensitive' } },
      { last_name: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { gender: { contains: query, mode: 'insensitive' } },
      { ip_address: { contains: query, mode: 'insensitive' } }
    ]
  };
};

/**
 * Builds complete where condition combining ID filter and search
 */
const buildWhereCondition = (lastId, searchConditions) => {
  if (!lastId || Object.keys(searchConditions).length === 0) {
    return lastId ? { id: { lt: lastId } } : searchConditions;
  }
  
  return {
    AND: [
      { id: { lt: lastId } },
      searchConditions
    ]
  };
};

/**
 * Fetches personal data from database
 */
const fetchPersonalData = async (queryOptions) => {
  return await prisma.personaldata.findMany(queryOptions);
};

/**
 * Sends success response with pagination metadata
 */
const sendSuccessResponse = (res, data, limit) => {
  res.json({
    result: data,
    lastId: data.length > 0 ? data[data.length - 1].id : 0,
    hasMore: data.length >= limit
  });
};

/**
 * Handles errors with appropriate response
 */
const handleError = (res, error) => {
  console.error("Error fetching personal data:", error);
  
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? error.message 
    : 'Internal server error';
    
  res.status(500).json({
    error: "Failed to fetch personal data",
    message: errorMessage
  });
};