# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder
#FROM eclipse-temurin:17-jre-alpine AS builder

WORKDIR /app

# Copy entire monorepo (needed for parent POM + common modules)
COPY . .

# Build ONLY this specific service + its dependencies
RUN mvn clean package -pl services/course-service -am -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine

RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Copy the built JAR
COPY --from=builder /app/services/course-service/target/*.jar app.jar

USER spring:spring

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-jar", "app.jar"]

EXPOSE 8083