import { NextResponse } from "next/server";

/**
 * OpenAPI/REST standard response format
 */

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  options?: {
    message?: string;
    meta?: Record<string, any>;
    status?: number;
  }
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };

  if (options?.message) {
    response.message = options.message;
  }

  if (options?.meta) {
    response.meta = options.meta;
  }

  return NextResponse.json(response, { status: options?.status || 200 });
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  options?: {
    code?: string;
    details?: any;
    status?: number;
  }
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: options?.code || "INTERNAL_ERROR",
      message,
      details: options?.details,
    },
  };

  return NextResponse.json(response, { status: options?.status || 500 });
}

/**
 * Common error responses
 */
export const ErrorResponses = {
  unauthorized: (message = "Unauthorized") =>
    errorResponse(message, {
      code: "UNAUTHORIZED",
      status: 401,
    }),

  forbidden: (message = "Forbidden") =>
    errorResponse(message, {
      code: "FORBIDDEN",
      status: 403,
    }),

  notFound: (message = "Resource not found") =>
    errorResponse(message, {
      code: "NOT_FOUND",
      status: 404,
    }),

  badRequest: (message: string, details?: any) =>
    errorResponse(message, {
      code: "BAD_REQUEST",
      status: 400,
      details,
    }),

  validationError: (details: any) =>
    errorResponse("Validation failed", {
      code: "VALIDATION_ERROR",
      status: 422,
      details,
    }),

  conflict: (message: string) =>
    errorResponse(message, {
      code: "CONFLICT",
      status: 409,
    }),

  internalError: (message = "Internal server error") =>
    errorResponse(message, {
      code: "INTERNAL_ERROR",
      status: 500,
    }),
};
