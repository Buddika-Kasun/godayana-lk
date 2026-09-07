package com.godayana.gateway.config;

import com.godayana.gateway.handler.FallbackHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.factory.RetryGatewayFilterFactory;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.time.Duration;

@Configuration
public class GatewayConfig {

    @Value("${AUTH_SERVICE_URL:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${OTP_SERVICE_URL:http://localhost:8090}")
    private String otpServiceUrl;

    @Value("${USER_SERVICE_URL:http://localhost:8082}")
    private String userServiceUrl;

    @Value("${JOB_SERVICE_URL:http://localhost:8083}")
    private String jobServiceUrl;

    @Value("${COURSE_SERVICE_URL:http://localhost:8092}")
    private String courseServiceUrl;

    @Value("${VISA_GATEWAY_CONTENT_SERVICE_URL:http://localhost:8085}")
    private String visaGatewayContentServiceUrl;

    @Value("${FILE_SERVICE_URL:http://localhost:8084}")
    private String fileServiceUrl;

    // ============ RETRY CONFIGURATIONS ============

    /**
     * Lightweight retry for fast operations (auth, otp)
     * - Fewer retries, shorter delays
     */
    private void configureFastRetry(RetryGatewayFilterFactory.RetryConfig config) {
        config.setRetries(2);
        config.setStatuses(
                HttpStatus.SERVICE_UNAVAILABLE,
                HttpStatus.GATEWAY_TIMEOUT,
                HttpStatus.REQUEST_TIMEOUT
        );
        config.setMethods(
                HttpMethod.GET,
                HttpMethod.POST,
                HttpMethod.PUT,
                HttpMethod.DELETE
        );
        config.setBackoff(Duration.ofMillis(300), Duration.ofSeconds(2), 2, true);
    }

    /**
     * Standard retry for business operations
     * - Moderate retries with exponential backoff
     */
    private void configureStandardRetry(RetryGatewayFilterFactory.RetryConfig config) {
        config.setRetries(3);
        config.setStatuses(
                HttpStatus.SERVICE_UNAVAILABLE,
                HttpStatus.GATEWAY_TIMEOUT,
                HttpStatus.REQUEST_TIMEOUT,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
        config.setMethods(
                HttpMethod.GET,
                HttpMethod.POST,
                HttpMethod.PUT,
                HttpMethod.DELETE
        );
        config.setBackoff(Duration.ofMillis(500), Duration.ofSeconds(5), 2, true);
    }

    /**
     * Heavy retry for data-heavy operations (file uploads, batch operations)
     * - More retries with longer delays
     */
    private void configureHeavyRetry(RetryGatewayFilterFactory.RetryConfig config) {
        config.setRetries(5);
        config.setStatuses(
                HttpStatus.SERVICE_UNAVAILABLE,
                HttpStatus.GATEWAY_TIMEOUT,
                HttpStatus.REQUEST_TIMEOUT,
                HttpStatus.INTERNAL_SERVER_ERROR,
                HttpStatus.TOO_MANY_REQUESTS
        );
        config.setMethods(
                HttpMethod.POST,
                HttpMethod.PUT,
                HttpMethod.PATCH,
                HttpMethod.DELETE
        );
        config.setBackoff(Duration.ofSeconds(1), Duration.ofSeconds(10), 2, true);
    }

    /**
     * No retry for OTP - prevents duplicate emails
     */
    private void configureNoRetry(RetryGatewayFilterFactory.RetryConfig config) {
        config.setRetries(0);  // No retries
    }

    // ============ CIRCUIT BREAKER NAMES ============

    private static final String CB_AUTH = "authService";
    private static final String CB_OTP = "otpService";
    private static final String CB_USER = "userService";
    private static final String CB_JOB = "jobService";
    private static final String CB_COURSE = "courseService";
    private static final String CB_VISA = "visaService";
    private static final String CB_FILE = "fileService";

    // ============ FALLBACK URIS ============

    private static final String FALLBACK_AUTH = "forward:/fallback/auth";
    private static final String FALLBACK_OTP = "forward:/fallback/otp";
    private static final String FALLBACK_USER = "forward:/fallback/user";
    private static final String FALLBACK_JOB = "forward:/fallback/job";
    private static final String FALLBACK_COURSE = "forward:/fallback/course";
    private static final String FALLBACK_VISA = "forward:/fallback/visa";
    private static final String FALLBACK_FILE = "forward:/fallback/file";

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()

                // ============ AUTH SERVICE ============
                .route("auth-service", r -> r
                        .path("/api/v1/auth/**")
                        .filters(f -> f
                                .retry(this::configureFastRetry)
                                .circuitBreaker(config -> {
                                    config.setName(CB_AUTH);
                                    config.setFallbackUri(FALLBACK_AUTH);
                                })
                                .stripPrefix(0))
                        .uri(authServiceUrl))

                // ============ OTP SERVICE ============
                .route("otp-service", r -> r
                        .path("/api/v1/otp/**")
                        .filters(f -> f
//                                .retry(this::configureNoRetry)
                                .circuitBreaker(config -> {
                                    config.setName(CB_OTP);
                                    config.setFallbackUri(FALLBACK_OTP);
                                })
                                .stripPrefix(0))
                        .uri(otpServiceUrl))

                // ============ USER SERVICE - UPLOADS ============
                .route("user-service-upload", r -> r
                        .path("/api/v1/seeker/me/upload/**",
                                "/api/v1/seeker/profiles/me/profile-pic",
                                "/api/v1/company/profiles/me/logo",
                                "/api/v1/seeker/profiles/me/resume")
                        .filters(f -> f
                                .retry(this::configureHeavyRetry)
                                .stripPrefix(0))
                        .uri(userServiceUrl))

                // ============ USER SERVICE ============
                .route("user-service", r -> r
                        .path("/api/v1/users/**", "/api/v1/profiles/**",
                                "/api/v1/seeker/**", "/api/v1/company/**")
                        .filters(f -> f
                                .retry(this::configureStandardRetry)
                                .circuitBreaker(config -> {
                                    config.setName(CB_USER);
                                    config.setFallbackUri(FALLBACK_USER);
                                })
                                .stripPrefix(0))
                        .uri(userServiceUrl))

                // ============ JOB SERVICE - UPLOADS ============
                .route("job-service-upload", r -> r
                        .path("/api/v1/jobs/upload/**")
                        .filters(f -> f
                                .retry(this::configureHeavyRetry)
                                .stripPrefix(0))
                        .uri(jobServiceUrl))

                // ============ JOB SERVICE ============
                .route("job-service", r -> r
                        .path("/api/v1/jobs/**", "/api/v1/applications/**")
                        .filters(f -> f
                                .retry(this::configureStandardRetry)
                                .circuitBreaker(config -> {
                                    config.setName(CB_JOB);
                                    config.setFallbackUri(FALLBACK_JOB);
                                })
                                .stripPrefix(0))
                        .uri(jobServiceUrl))

                // ============ COURSE SERVICE - UPLOADS ============
                .route("course-service-upload", r -> r
                        .path("/api/v1/courses/upload/**")
                        .filters(f -> f
                                .retry(this::configureHeavyRetry)
                                .stripPrefix(0))
                        .uri(courseServiceUrl))

                // ============ COURSE SERVICE ============
                .route("course-service", r -> r
                        .path("/api/v1/courses/**", "/api/v1/enrollments/**", "/api/v1/reviews/**")
                        .filters(f -> f
                                .retry(this::configureStandardRetry)
                                .circuitBreaker(config -> {
                                    config.setName(CB_COURSE);
                                    config.setFallbackUri(FALLBACK_COURSE);
                                })
                                .stripPrefix(0))
                        .uri(courseServiceUrl))

                // ============ VISA, GATEWAY, CONTENT SERVICE ============
                .route("visa_gateway_content-service", r -> r
                        .path("/api/v1/visa/**",
                                "/api/v1/visa-consultations/**",
                                "/api/v1/gateway-consultations/**",
                                "/api/v1/visa-posts/**",
                                "/api/v1/countries/**",
                                "/api/v1/stories/**")
                        .filters(f -> f
                                .retry(this::configureStandardRetry)
                                .circuitBreaker(config -> {
                                    config.setName(CB_VISA);
                                    config.setFallbackUri(FALLBACK_VISA);
                                })
                                .stripPrefix(0))
                        .uri(visaGatewayContentServiceUrl))

                // ============ FILE SERVICE ============
                .route("file-service", r -> r
                        .path("/api/v1/files/**")
                        .filters(f -> f
                                .retry(this::configureHeavyRetry)
                                // No circuit breaker for file service (handled separately)
                                .stripPrefix(0))
                        .uri(fileServiceUrl))

                .build();
    }

    // ============ FALLBACK ROUTES ============

    @Bean
    public RouterFunction<ServerResponse> fallbackRoutes(FallbackHandler fallbackHandler) {
        return RouterFunctions.route()
                // Auth Fallbacks
                .GET("/fallback/auth", fallbackHandler::handleAuthFallback)
                .POST("/fallback/auth", fallbackHandler::handleAuthFallback)
                .PUT("/fallback/auth", fallbackHandler::handleAuthFallback)
                .DELETE("/fallback/auth", fallbackHandler::handleAuthFallback)

                // User Fallbacks
                .GET("/fallback/user", fallbackHandler::handleUserFallback)
                .POST("/fallback/user", fallbackHandler::handleUserFallback)
                .PUT("/fallback/user", fallbackHandler::handleUserFallback)
                .DELETE("/fallback/user", fallbackHandler::handleUserFallback)

                // OTP Fallbacks
                .GET("/fallback/otp", fallbackHandler::handleOtpFallback)
                .POST("/fallback/otp", fallbackHandler::handleOtpFallback)
                .PUT("/fallback/otp", fallbackHandler::handleOtpFallback)
                .DELETE("/fallback/otp", fallbackHandler::handleOtpFallback)

                // Notification Fallbacks
                .GET("/fallback/notification", fallbackHandler::handleNotificationFallback)
                .POST("/fallback/notification", fallbackHandler::handleNotificationFallback)
                .PUT("/fallback/notification", fallbackHandler::handleNotificationFallback)
                .DELETE("/fallback/notification", fallbackHandler::handleNotificationFallback)

                // Job Fallbacks
                .GET("/fallback/job", fallbackHandler::handleJobFallback)
                .POST("/fallback/job", fallbackHandler::handleJobFallback)
                .PUT("/fallback/job", fallbackHandler::handleJobFallback)
                .DELETE("/fallback/job", fallbackHandler::handleJobFallback)

                // Course Fallbacks
                .GET("/fallback/course", fallbackHandler::handleCourseFallback)
                .POST("/fallback/course", fallbackHandler::handleCourseFallback)
                .PUT("/fallback/course", fallbackHandler::handleCourseFallback)
                .DELETE("/fallback/course", fallbackHandler::handleCourseFallback)

                // Visa Fallbacks
                .GET("/fallback/visa", fallbackHandler::handleVisaFallback)
                .POST("/fallback/visa", fallbackHandler::handleVisaFallback)
                .PUT("/fallback/visa", fallbackHandler::handleVisaFallback)
                .DELETE("/fallback/visa", fallbackHandler::handleVisaFallback)

                // Payment Fallbacks
                .GET("/fallback/payment", fallbackHandler::handlePaymentFallback)
                .POST("/fallback/payment", fallbackHandler::handlePaymentFallback)
                .PUT("/fallback/payment", fallbackHandler::handlePaymentFallback)
                .DELETE("/fallback/payment", fallbackHandler::handlePaymentFallback)

                // Admin Fallbacks
                .GET("/fallback/admin", fallbackHandler::handleAdminFallback)
                .POST("/fallback/admin", fallbackHandler::handleAdminFallback)
                .PUT("/fallback/admin", fallbackHandler::handleAdminFallback)
                .DELETE("/fallback/admin", fallbackHandler::handleAdminFallback)

                // File Fallbacks
                .GET("/fallback/file", fallbackHandler::handleFileFallback)
                .POST("/fallback/file", fallbackHandler::handleFileFallback)
                .PUT("/fallback/file", fallbackHandler::handleFileFallback)
                .DELETE("/fallback/file", fallbackHandler::handleFileFallback)

                // Generic Fallback for any unmatched paths
                .GET("/fallback/**", fallbackHandler::handleGenericFallback)
                .POST("/fallback/**", fallbackHandler::handleGenericFallback)
                .PUT("/fallback/**", fallbackHandler::handleGenericFallback)
                .DELETE("/fallback/**", fallbackHandler::handleGenericFallback)

                .build();
    }
}