export const globalErrorHandling=(err, req, res, next) => {
    const status = err.cause || 500;
    return res
      .status(status)
      .json({
        message: "something went error",
        error: err.message,
        stack: err.stack,
      });
  }