package com.godayana.gateway.config;

import com.godayana.gateway.handler.FallbackHandler;

import org.springframework.beans.factory.annotation.Value;
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

//    @Value("${NOTIFICATION_SERVICE_URL:http://localhost:8089}")
//    private String notificationServiceUrl;

    @Value("${JOB_SERVICE_URL:http://localhost:8083}")
    private String jobServiceUrl;

//    @Value("${COURSE_SERVICE_URL:http://localhost:8085}")
//    private String courseServiceUrl;
//
//    @Value("${VISA_SERVICE_URL:http://localhost:8086}")
//    private String visaServiceUrl;
//
//    @Value("${COUNTRY_SERVICE_URL:http://localhost:8087}")
//    private String countryServiceUrl;
//
//    @Value("${STORY_SERVICE_URL:http://localhost:8088}")
//    private String storyServiceUrl;
//
//    @Value("${PAYMENT_SERVICE_URL:http://localhost:8091}")
//    private String paymentServiceUrl;
//
//    @Value("${ADMIN_SERVICE_URL:http://localhost:8090}")
//    private String adminServiceUrl;

    @Value("${FILE_SERVICE_URL:http://localhost:8084}")
    private String fileServiceUrl;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service Routes - With Retry and CircuitBreaker
                .route("auth-service", r -> r
                        .path("/api/v1/auth/**")
                        .filters(f -> f
                                .retry(config -> {
                                    config.setRetries(3);
                                    config.setStatuses(
                                            HttpStatus.SERVICE_UNAVAILABLE,
                                            HttpStatus.INTERNAL_SERVER_ERROR,
                                            HttpStatus.GATEWAY_TIMEOUT
                                    );
                                    config.setMethods(
                                            HttpMethod.POST,
                                            HttpMethod.GET,
                                            HttpMethod.PUT,
                                            HttpMethod.DELETE
                                    );
                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
                                })
                                .circuitBreaker(config -> {
                                    config.setName("authService");
                                    config.setFallbackUri("forward:/fallback/auth");
                                })
                                .stripPrefix(0))
                        .uri(authServiceUrl))

                // OTP Service Routes - With Retry and CircuitBreaker
                .route("otp-service", r -> r
                        .path("/api/v1/otp/**")
                        .filters(f -> f
                                .retry(config -> {
                                    config.setRetries(3);
                                    config.setStatuses(
                                            HttpStatus.SERVICE_UNAVAILABLE,
                                            HttpStatus.INTERNAL_SERVER_ERROR,
                                            HttpStatus.GATEWAY_TIMEOUT
                                    );
                                    config.setMethods(
                                            HttpMethod.POST,
                                            HttpMethod.GET,
                                            HttpMethod.PUT,
                                            HttpMethod.DELETE
                                    );
                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
                                })
                                .circuitBreaker(config -> {
                                    config.setName("otpService");
                                    config.setFallbackUri("forward:/fallback/otp");
                                })
                                .stripPrefix(0))
                        .uri(otpServiceUrl))

                .route("user-service-upload", r -> r
                        .path("/api/v1/seeker/me/upload/**",
                                "/api/v1/seeker/profiles/me/profile-pic",
                                "/api/v1/company/profiles/me/logo",
                                "/api/v1/seeker/profiles/me/resume")
                        .filters(f -> f
                                .retry(config -> {
                                    config.setRetries(3);
                                    config.setStatuses(
                                            HttpStatus.SERVICE_UNAVAILABLE,
                                            HttpStatus.INTERNAL_SERVER_ERROR,
                                            HttpStatus.GATEWAY_TIMEOUT
                                    );
                                    config.setMethods(
                                            HttpMethod.POST,
                                            HttpMethod.PUT,
                                            HttpMethod.PATCH,
                                            HttpMethod.DELETE
                                    );
                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
                                })
                                // NO circuit breaker
                                .stripPrefix(0))
                        .uri(userServiceUrl))

                // User Service Routes - With Retry and CircuitBreaker
                .route("user-service", r -> r
                        .path("/api/v1/users/**", "/api/v1/profiles/**",
                                "/api/v1/seeker/**", "/api/v1/company/**")
                        .filters(f -> f
                                .retry(config -> {
                                    config.setRetries(10);
                                    config.setStatuses(
                                            HttpStatus.SERVICE_UNAVAILABLE,
                                            HttpStatus.INTERNAL_SERVER_ERROR,
                                            HttpStatus.GATEWAY_TIMEOUT
                                    );
                                    config.setMethods(
                                            HttpMethod.POST,
                                            HttpMethod.GET,
                                            HttpMethod.PUT,
                                            HttpMethod.DELETE
                                    );
                                    config.setBackoff(Duration.ofMillis(500), Duration.ofSeconds(8), 2, true);
                                })
                                .circuitBreaker(config -> {
                                    config.setName("userService");
                                    config.setFallbackUri("forward:/fallback/user");
                                })
                                .stripPrefix(0))
                        .uri(userServiceUrl))

                // Notification Service Routes - With Retry and CircuitBreaker
//                .route("notification-service", r -> r
//                        .path("/api/v1/notifications/**")
//                        .filters(f -> f
//                                .retry(config -> {
//                                    config.setRetries(3);
//                                    config.setStatuses(
//                                            HttpStatus.SERVICE_UNAVAILABLE,
//                                            HttpStatus.INTERNAL_SERVER_ERROR,
//                                            HttpStatus.GATEWAY_TIMEOUT
//                                    );
//                                    config.setMethods(
//                                            HttpMethod.POST,
//                                            HttpMethod.GET,
//                                            HttpMethod.PUT,
//                                            HttpMethod.DELETE
//                                    );
//                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
//                                })
//                                .circuitBreaker(config -> {
//                                    config.setName("notificationService");
//                                    config.setFallbackUri("forward:/fallback/notification");
//                                })
//                                .stripPrefix(0))
//                        .uri(notificationServiceUrl))

                // Job Service Routes - With Retry and CircuitBreaker
                .route("job-service-upload", r -> r
                        .path("/api/v1/jobs/upload/**",
                                "/api/v1/jobs/upload/job-image")
                        .filters(f -> f
                                .retry(config -> {
                                    config.setRetries(3);
                                    config.setStatuses(
                                            HttpStatus.SERVICE_UNAVAILABLE,
                                            HttpStatus.INTERNAL_SERVER_ERROR,
                                            HttpStatus.GATEWAY_TIMEOUT
                                    );
                                    config.setMethods(
                                            HttpMethod.POST,
                                            HttpMethod.PUT,
                                            HttpMethod.PATCH,
                                            HttpMethod.DELETE
                                    );
                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
                                })
                                // NO circuit breaker
                                .stripPrefix(0))
                        .uri(jobServiceUrl))

                .route("job-service", r -> r
                        .path("/api/v1/jobs/**", "/api/v1/applications/**")
                        .filters(f -> f
                                .retry(config -> {
                                    config.setRetries(3);
                                    config.setStatuses(
                                            HttpStatus.SERVICE_UNAVAILABLE,
                                            HttpStatus.INTERNAL_SERVER_ERROR,
                                            HttpStatus.GATEWAY_TIMEOUT
                                    );
                                    config.setMethods(
                                            HttpMethod.POST,
                                            HttpMethod.GET,
                                            HttpMethod.PUT,
                                            HttpMethod.DELETE
                                    );
                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
                                })
                                .circuitBreaker(config -> {
                                    config.setName("jobService");
                                    config.setFallbackUri("forward:/fallback/job");
                                })
                                .stripPrefix(0))
                        .uri(jobServiceUrl))

                // Course Service Routes - With Retry and CircuitBreaker
//                .route("course-service", r -> r
//                        .path("/api/v1/courses/**")
//                        .filters(f -> f
//                                .retry(config -> {
//                                    config.setRetries(3);
//                                    config.setStatuses(
//                                            HttpStatus.SERVICE_UNAVAILABLE,
//                                            HttpStatus.INTERNAL_SERVER_ERROR,
//                                            HttpStatus.GATEWAY_TIMEOUT
//                                    );
//                                    config.setMethods(
//                                            HttpMethod.POST,
//                                            HttpMethod.GET,
//                                            HttpMethod.PUT,
//                                            HttpMethod.DELETE
//                                    );
//                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
//                                })
//                                .circuitBreaker(config -> {
//                                    config.setName("courseService");
//                                    config.setFallbackUri("forward:/fallback/course");
//                                })
//                                .stripPrefix(0))
//                        .uri(courseServiceUrl))
//
//                // Visa Service Routes - With Retry and CircuitBreaker
//                .route("visa-service", r -> r
//                        .path("/api/v1/visa/**")
//                        .filters(f -> f
//                                .retry(config -> {
//                                    config.setRetries(3);
//                                    config.setStatuses(
//                                            HttpStatus.SERVICE_UNAVAILABLE,
//                                            HttpStatus.INTERNAL_SERVER_ERROR,
//                                            HttpStatus.GATEWAY_TIMEOUT
//                                    );
//                                    config.setMethods(
//                                            HttpMethod.POST,
//                                            HttpMethod.GET,
//                                            HttpMethod.PUT,
//                                            HttpMethod.DELETE
//                                    );
//                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
//                                })
//                                .circuitBreaker(config -> {
//                                    config.setName("visaService");
//                                    config.setFallbackUri("forward:/fallback/visa");
//                                })
//                                .stripPrefix(0))
//                        .uri(visaServiceUrl))
//
//                // Country Service Routes - With Retry and CircuitBreaker
//                .route("country-service", r -> r
//                        .path("/api/v1/countries/**")
//                        .filters(f -> f
//                                .retry(config -> {
//                                    config.setRetries(3);
//                                    config.setStatuses(
//                                            HttpStatus.SERVICE_UNAVAILABLE,
//                                            HttpStatus.INTERNAL_SERVER_ERROR,
//                                            HttpStatus.GATEWAY_TIMEOUT
//                                    );
//                                    config.setMethods(
//                                            HttpMethod.POST,
//                                            HttpMethod.GET,
//                                            HttpMethod.PUT,
//                                            HttpMethod.DELETE
//                                    );
//                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
//                                })
//                                .circuitBreaker(config -> {
//                                    config.setName("countryService");
//                                    config.setFallbackUri("forward:/fallback/country");
//                                })
//                                .stripPrefix(0))
//                        .uri(countryServiceUrl))
//
//                // Story Service Routes - With Retry and CircuitBreaker
//                .route("story-service", r -> r
//                        .path("/api/v1/stories/**")
//                        .filters(f -> f
//                                .retry(config -> {
//                                    config.setRetries(3);
//                                    config.setStatuses(
//                                            HttpStatus.SERVICE_UNAVAILABLE,
//                                            HttpStatus.INTERNAL_SERVER_ERROR,
//                                            HttpStatus.GATEWAY_TIMEOUT
//                                    );
//                                    config.setMethods(
//                                            HttpMethod.POST,
//                                            HttpMethod.GET,
//                                            HttpMethod.PUT,
//                                            HttpMethod.DELETE
//                                    );
//                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
//                                })
//                                .circuitBreaker(config -> {
//                                    config.setName("storyService");
//                                    config.setFallbackUri("forward:/fallback/story");
//                                })
//                                .stripPrefix(0))
//                        .uri(storyServiceUrl))
//
//                // Payment Service Routes - With Retry and CircuitBreaker
//                .route("payment-service", r -> r
//                        .path("/api/v1/payments/**")
//                        .filters(f -> f
//                                .retry(config -> {
//                                    config.setRetries(3);
//                                    config.setStatuses(
//                                            HttpStatus.SERVICE_UNAVAILABLE,
//                                            HttpStatus.INTERNAL_SERVER_ERROR,
//                                            HttpStatus.GATEWAY_TIMEOUT
//                                    );
//                                    config.setMethods(
//                                            HttpMethod.POST,
//                                            HttpMethod.GET,
//                                            HttpMethod.PUT,
//                                            HttpMethod.DELETE
//                                    );
//                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
//                                })
//                                .circuitBreaker(config -> {
//                                    config.setName("paymentService");
//                                    config.setFallbackUri("forward:/fallback/payment");
//                                })
//                                .stripPrefix(0))
//                        .uri(paymentServiceUrl))
//
//                // Admin Service Routes - With Retry and CircuitBreaker
//                .route("admin-service", r -> r
//                        .path("/api/v1/admin/**")
//                        .filters(f -> f
//                                .retry(config -> {
//                                    config.setRetries(3);
//                                    config.setStatuses(
//                                            HttpStatus.SERVICE_UNAVAILABLE,
//                                            HttpStatus.INTERNAL_SERVER_ERROR,
//                                            HttpStatus.GATEWAY_TIMEOUT
//                                    );
//                                    config.setMethods(
//                                            HttpMethod.POST,
//                                            HttpMethod.GET,
//                                            HttpMethod.PUT,
//                                            HttpMethod.DELETE
//                                    );
//                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
//                                })
//                                .circuitBreaker(config -> {
//                                    config.setName("adminService");
//                                    config.setFallbackUri("forward:/fallback/admin");
//                                })
//                                .stripPrefix(0))
//                        .uri(adminServiceUrl))

                .route("file-service", r -> r
                        .path("/api/v1/files/**")
                        .filters(f -> f
                                .retry(config -> {
                                    config.setRetries(3);
                                    config.setStatuses(
                                            HttpStatus.SERVICE_UNAVAILABLE,
                                            HttpStatus.INTERNAL_SERVER_ERROR,
                                            HttpStatus.GATEWAY_TIMEOUT
                                    );
                                    config.setMethods(
                                            HttpMethod.POST,
                                            HttpMethod.GET,
                                            HttpMethod.PUT,
                                            HttpMethod.DELETE
                                    );
                                    config.setBackoff(Duration.ofSeconds(2), Duration.ofSeconds(5), 2, true);
                                })
//                                .circuitBreaker(config -> {
//                                    config.setName("fileService");
//                                    config.setFallbackUri("forward:/fallback/file");
//                                })
                                .stripPrefix(0))
                        .uri(fileServiceUrl))

                .build();
    }

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

                // Country Fallbacks
//                .GET("/fallback/country", fallbackHandler::handleCountryFallback)
//                .POST("/fallback/country", fallbackHandler::handleCountryFallback)
//                .PUT("/fallback/country", fallbackHandler::handleCountryFallback)
//                .DELETE("/fallback/country", fallbackHandler::handleCountryFallback)
//
//                // Story Fallbacks
//                .GET("/fallback/story", fallbackHandler::handleStoryFallback)
//                .POST("/fallback/story", fallbackHandler::handleStoryFallback)
//                .PUT("/fallback/story", fallbackHandler::handleStoryFallback)
//                .DELETE("/fallback/story", fallbackHandler::handleStoryFallback)

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