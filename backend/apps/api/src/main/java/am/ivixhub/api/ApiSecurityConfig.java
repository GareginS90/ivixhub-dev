package am.ivixhub.api;

import am.ivixhub.api.error.ApiAccessDeniedHandler;
import am.ivixhub.api.error.ApiAuthEntryPoint;
import am.ivixhub.api.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class ApiSecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final ApiAuthEntryPoint authEntryPoint;
    private final ApiAccessDeniedHandler accessDeniedHandler;

    public ApiSecurityConfig(JwtAuthFilter jwtAuthFilter,
                             ApiAuthEntryPoint authEntryPoint,
                             ApiAccessDeniedHandler accessDeniedHandler) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authEntryPoint = authEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    @Order(1)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .logout(logout -> logout.disable())
            .rememberMe(rm -> rm.disable())
            .requestCache(rc -> rc.disable())

            // ✅ custom JSON for 401/403
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/ws/**").permitAll()

                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()

                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/debug/**").hasRole("ADMIN")

                .requestMatchers("/api/me").authenticated()
                .requestMatchers("/api/phone/**").authenticated()
                .requestMatchers("/api/psychologists/**").authenticated()
                .requestMatchers("/api/bookings/**").authenticated()
                .requestMatchers("/api/payments/**").authenticated()
                .requestMatchers("/api/escrow/**").authenticated()
                .requestMatchers("/api/finance/**").authenticated()
                .requestMatchers("/api/video/**").authenticated()
                .requestMatchers("/api/chat/**").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/api/secured/**").authenticated()

                .anyRequest().permitAll()
            )

            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .contentTypeOptions(Customizer.withDefaults())
            );

        return http.build();
    }
}
