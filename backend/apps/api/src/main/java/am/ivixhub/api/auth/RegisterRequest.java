package am.ivixhub.api.auth;

import am.ivixhub.users.domain.UserGender;
import am.ivixhub.users.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterRequest(
        @Email @NotBlank String email,
        @Size(max = 150) String fullName,
        @NotBlank
        @Size(min = 3, max = 50)
        @Pattern(regexp = "^[a-zA-Z0-9._]+$", message = "Username may contain only letters, numbers, dot and underscore")
        String username,
        @NotNull LocalDate birthDate,
        @NotNull UserGender gender,
        @NotBlank
        @Size(min = 8, max = 100)
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,100}$",
                message = "Password must contain at least 8 characters, 1 letter, 1 digit and 1 special symbol"
        )
        String password,
        @NotNull UserRole role
) {}
