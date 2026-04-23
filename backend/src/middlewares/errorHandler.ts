import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../lib/httpError.js";

type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function isDuplicateKeyError(err: unknown): err is { code: number; keyValue?: unknown } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === 11000
  );
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (res.headersSent) return;

  if (err instanceof ZodError) {
    const body: ApiErrorBody = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.flatten(),
      },
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof HttpError) {
    const body: ApiErrorBody = {
      error: {
        code: err.code,
        message: err.message,
      },
    };
    res.status(err.status).json(body);
    return;
  }

  if (isDuplicateKeyError(err)) {
    const body: ApiErrorBody = {
      error: {
        code: "CONFLICT",
        message: "Resource already exists",
        details: { keyValue: err.keyValue },
      },
    };
    res.status(409).json(body);
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    const body: ApiErrorBody = {
      error: {
        code: "BAD_REQUEST",
        message: "Invalid identifier",
        details: { path: err.path, value: err.value },
      },
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      issue: e.kind,
      message: e.message,
    }));
    const body: ApiErrorBody = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details,
      },
    };
    res.status(400).json(body);
    return;
  }

  const status =
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as { status?: unknown }).status === "number"
      ? (err as { status: number }).status
      : 500;

  const code =
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code?: unknown }).code === "string"
      ? (err as { code: string }).code
      : status === 500
        ? "INTERNAL_ERROR"
        : "ERROR";

  const message =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "Something went wrong";

  const body: ApiErrorBody = {
    error: {
      code,
      message:
        status === 500 && env.isProd ? "Internal server error" : message,
    },
  };

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json(body);
};
