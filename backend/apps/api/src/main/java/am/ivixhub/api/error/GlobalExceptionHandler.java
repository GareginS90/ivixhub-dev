package am.ivixhub.api.error;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Value("${ivixhub.debugErrors:false}")
    private boolean debugErrors;

    // ---------- 400: Validation ----------
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Validation failed");
        pd.setDetail("Validation failed");
        pd.setProperty("errorCode", "VALIDATION_FAILED");

        Map<String, String> fields = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fields.put(fe.getField(), fe.getDefaultMessage());
        }
        pd.setProperty("fields", fields);
        pd.setProperty("timestamp", OffsetDateTime.now().toString());
        return pd;
    }

    // ---------- 400: Missing/invalid JSON body ----------
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ProblemDetail handleNotReadable(HttpMessageNotReadableException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Bad Request");
        pd.setDetail("Malformed or missing request body");
        pd.setProperty("errorCode", "BAD_REQUEST");
        pd.setProperty("timestamp", OffsetDateTime.now().toString());
        if (debugErrors) {
            pd.setProperty("debug", ex.getClass().getName() + ": " + ex.getMessage());
        }
        return pd;
    }

    // ---------- 404: No route / resource ----------
    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ProblemDetail handleNoResource(NoResourceFoundException ex, HttpServletRequest req) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        pd.setTitle("Not Found");
        pd.setDetail("No handler found for " + req.getMethod() + " " + req.getRequestURI());
        pd.setProperty("errorCode", "NOT_FOUND");
        pd.setProperty("timestamp", OffsetDateTime.now().toString());
        if (debugErrors) {
            pd.setProperty("debug", ex.getClass().getName() + ": " + ex.getMessage());
        }
        return pd;
    }

    // ---------- 400: IllegalArgumentException ----------
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest req) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Bad Request");
        pd.setDetail(ex.getMessage() == null ? "Bad Request" : ex.getMessage());
        pd.setProperty("errorCode", "BAD_REQUEST");
        pd.setProperty("path", req.getRequestURI());
        pd.setProperty("timestamp", OffsetDateTime.now().toString());
        if (debugErrors) {
            pd.setProperty("debug", ex.getClass().getName() + ": " + ex.getMessage());
        }
        return pd;
    }

    // ---------- Spring ErrorResponseException ----------
    @ExceptionHandler(ErrorResponseException.class)
    public ProblemDetail handleErrorResponse(ErrorResponseException ex, HttpServletRequest req) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        ProblemDetail pd = ProblemDetail.forStatus(status);
        pd.setTitle(status.getReasonPhrase());
        pd.setDetail(ex.getMessage());
        pd.setProperty("errorCode", status.is4xxClientError() ? "BAD_REQUEST" : "INTERNAL_ERROR");
        pd.setProperty("path", req.getRequestURI());
        pd.setProperty("timestamp", OffsetDateTime.now().toString());
        if (debugErrors) {
            pd.setProperty("debug", ex.getClass().getName() + ": " + ex.getMessage());
        }
        return pd;
    }

    // ---------- 500: fallback ----------
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ProblemDetail handleUnknown(Exception ex, HttpServletRequest req) {
        // print stacktrace to console for dev
        ex.printStackTrace();

        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        pd.setTitle("Internal Server Error");
        pd.setDetail("Unexpected error");
        pd.setProperty("errorCode", "INTERNAL_ERROR");
        pd.setProperty("path", req.getRequestURI());
        pd.setProperty("timestamp", OffsetDateTime.now().toString());

        if (debugErrors) {
            String msg = ex.getMessage();
            pd.setProperty("debug", ex.getClass().getName() + (msg == null ? "" : (": " + msg)));
            if (ex.getCause() != null) {
                String cmsg = ex.getCause().getMessage();
                pd.setProperty("cause", ex.getCause().getClass().getName() + (cmsg == null ? "" : (": " + cmsg)));
            }
        }

        return pd;
    }
}

