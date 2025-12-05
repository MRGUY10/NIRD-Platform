"""
Custom Exception Handlers
Global error handling for the NIRD Platform API
"""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
import traceback
import logging

logger = logging.getLogger(__name__)


class NirdAPIException(Exception):
    """Base exception for NIRD API"""
    def __init__(self, status_code: int, detail: str, error_code: str = None):
        self.status_code = status_code
        self.detail = detail
        self.error_code = error_code or "API_ERROR"
        super().__init__(self.detail)


class ResourceNotFoundError(NirdAPIException):
    """Raised when a resource is not found"""
    def __init__(self, resource: str, identifier: str = None):
        detail = f"{resource} not found"
        if identifier:
            detail = f"{resource} with ID '{identifier}' not found"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code="RESOURCE_NOT_FOUND"
        )


class UnauthorizedError(NirdAPIException):
    """Raised when user is not authenticated"""
    def __init__(self, detail: str = "Authentication required"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code="UNAUTHORIZED"
        )


class ForbiddenError(NirdAPIException):
    """Raised when user doesn't have permission"""
    def __init__(self, detail: str = "Insufficient permissions"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="FORBIDDEN"
        )


class ConflictError(NirdAPIException):
    """Raised when there's a conflict (e.g., duplicate resource)"""
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
            error_code="CONFLICT"
        )


class ValidationError(NirdAPIException):
    """Raised for validation errors"""
    def __init__(self, detail: str, field: str = None):
        error_detail = detail
        if field:
            error_detail = f"Validation error for field '{field}': {detail}"
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=error_detail,
            error_code="VALIDATION_ERROR"
        )


# Exception handlers

async def nird_api_exception_handler(request: Request, exc: NirdAPIException):
    """Handler for custom NIRD API exceptions"""
    logger.warning(f"API Exception: {exc.error_code} - {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.detail,
                "path": str(request.url.path)
            }
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handler for Pydantic validation errors"""
    errors = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"])
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"]
        })
    
    logger.warning(f"Validation error: {errors}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "details": errors,
                "path": str(request.url.path)
            }
        }
    )


async def database_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handler for database errors"""
    logger.error(f"Database error: {str(exc)}", exc_info=True)
    
    # Don't expose internal database errors to users
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "DATABASE_ERROR",
                "message": "A database error occurred. Please try again later.",
                "path": str(request.url.path)
            }
        }
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """Handler for unhandled exceptions"""
    logger.error(
        f"Unhandled exception: {type(exc).__name__}: {str(exc)}",
        exc_info=True
    )
    
    # Print traceback in development
    traceback.print_exc()
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred. Please try again later.",
                "path": str(request.url.path)
            }
        }
    )


def register_exception_handlers(app):
    """Register all exception handlers with the FastAPI app"""
    app.add_exception_handler(NirdAPIException, nird_api_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, database_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
