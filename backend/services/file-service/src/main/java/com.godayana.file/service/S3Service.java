// src/main/java/com/godayana/file/service/S3Service.java
package com.godayana.file.service;

import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.file.config.StorageConfig;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final StorageConfig storageConfig;
    private S3Client s3Client;
    private S3Presigner s3Presigner;

    @PostConstruct
    public void init() {
        try {
            log.info("Initializing S3 client for bucket: {}", storageConfig.getBucketName());

            AwsBasicCredentials credentials = AwsBasicCredentials.create(
                    storageConfig.getAccessKey(),
                    storageConfig.getSecretKey()
            );

            this.s3Client = S3Client.builder()
                    .region(Region.of(storageConfig.getRegion()))
                    .endpointOverride(URI.create(storageConfig.getEndpoint()))
                    .credentialsProvider(StaticCredentialsProvider.create(credentials))
                    .build();

            this.s3Presigner = S3Presigner.builder()
                    .region(Region.of(storageConfig.getRegion()))
                    .endpointOverride(URI.create(storageConfig.getEndpoint()))
                    .credentialsProvider(StaticCredentialsProvider.create(credentials))
                    .build();

            log.info("S3 client and presigner initialized successfully");
            log.info("S3Presigner is {}null", this.s3Presigner == null ? "" : "not ");

        } catch (Exception e) {
            log.error("Failed to initialize S3 client", e);
            throw new BusinessException(
                    "Failed to initialize storage service: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    public String uploadFile(MultipartFile file, String folder) {
        try {
            String key = generateFileKey(folder, file.getOriginalFilename());
            log.info("Uploading file to S3: {} ({} bytes)", key, file.getSize());

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(storageConfig.getBucketName())
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            log.info("File uploaded successfully to S3: {}", key);
            return key;

        } catch (S3Exception e) {
            log.error("S3 error while uploading file: {}", e.getMessage(), e);
            throw new BusinessException(
                    "Failed to upload file to storage: " + e.awsErrorDetails().errorMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    e.statusCode()
            );
        } catch (IOException e) {
            log.error("IO error while uploading file", e);
            throw new BusinessException(
                    "Failed to read file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        } catch (Exception e) {
            log.error("Unexpected error while uploading file", e);
            throw new BusinessException(
                    "Failed to upload file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    public InputStream downloadFile(String fileKey) throws Exception {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(storageConfig.getBucketName())
                    .key(fileKey)
                    .build();

            return s3Client.getObject(getObjectRequest);

        } catch (Exception e) {
            log.error("Failed to download file from S3: {}", fileKey, e);
            throw new BusinessException(
                    "Failed to download file: " + e.getMessage(),
                    ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                    HttpStatus.SC_NOT_FOUND
            );
        }
    }


    public void deleteFile(String fileKey) {
        try {
            log.info("Deleting file from S3: {}", fileKey);

            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(storageConfig.getBucketName())
                    .key(fileKey)
                    .build();

            s3Client.deleteObject(deleteRequest);
            log.info("Deleted file from S3: {}", fileKey);

        } catch (S3Exception e) {
            log.error("S3 error while deleting file: {}", fileKey, e);
            throw new BusinessException(
                    "Failed to delete file from storage: " + e.awsErrorDetails().errorMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    e.statusCode()
            );
        } catch (Exception e) {
            log.error("Unexpected error while deleting file: {}", fileKey, e);
            throw new BusinessException(
                    "Failed to delete file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    public String generateFileKey(String folder, String fileName) {
        try {
            String sanitizedFileName = fileName != null ?
                    fileName.replaceAll("[^a-zA-Z0-9.\\-]", "_") : "file";

            // Ensure filename doesn't exceed limits
            if (sanitizedFileName.length() > 200) {
                String extension = "";
                if (sanitizedFileName.contains(".")) {
                    extension = sanitizedFileName.substring(sanitizedFileName.lastIndexOf("."));
                    sanitizedFileName = sanitizedFileName.substring(0, 200 - extension.length()) + extension;
                } else {
                    sanitizedFileName = sanitizedFileName.substring(0, 200);
                }
            }

            String uniqueId = UUID.randomUUID().toString();
            String fileKey = String.format("%s/%s-%s", folder, uniqueId, sanitizedFileName);

            log.debug("Generated file key: {}", fileKey);
            return fileKey;

        } catch (Exception e) {
            log.error("Error generating file key", e);
            throw new BusinessException(
                    "Failed to generate file key: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    public String getFileUrl(String key) {
        try {
            if (key == null || key.isEmpty()) {
                throw new BusinessException(
                        "File key is empty",
                        ErrorCode.VALIDATION_ERROR.getCode(),
                        HttpStatus.SC_BAD_REQUEST
                );
            }

            String url = String.format("%s/%s/%s",
                    storageConfig.getEndpoint(),
                    storageConfig.getBucketName(),
                    key
            );

            log.debug("Generated file URL: {}", url);
            return url;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error generating file URL for key: {}", key, e);
            throw new BusinessException(
                    "Failed to generate file URL: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    public boolean fileExists(String fileKey) {
        try {
            log.debug("Checking if file exists: {}", fileKey);

            // Try to get object metadata
            s3Client.headObject(builder -> builder
                    .bucket(storageConfig.getBucketName())
                    .key(fileKey)
                    .build());

            return true;
        } catch (S3Exception e) {
            if (e.statusCode() == 404) {
                return false;
            }
            log.error("Error checking file existence: {}", fileKey, e);
            throw new BusinessException(
                    "Failed to check file existence: " + e.awsErrorDetails().errorMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    e.statusCode()
            );
        } catch (Exception e) {
            log.error("Unexpected error checking file existence: {}", fileKey, e);
            throw new BusinessException(
                    "Failed to check file existence: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    public void copyFile(String sourceKey, String destinationKey) {
        try {
            log.info("Copying file from {} to {}", sourceKey, destinationKey);

            s3Client.copyObject(builder -> builder
                    .sourceBucket(storageConfig.getBucketName())
                    .sourceKey(sourceKey)
                    .destinationBucket(storageConfig.getBucketName())
                    .destinationKey(destinationKey)
                    .build());

            log.info("File copied successfully: {} -> {}", sourceKey, destinationKey);

        } catch (S3Exception e) {
            log.error("S3 error while copying file: {} -> {}", sourceKey, destinationKey, e);
            throw new BusinessException(
                    "Failed to copy file: " + e.awsErrorDetails().errorMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    e.statusCode()
            );
        } catch (Exception e) {
            log.error("Unexpected error while copying file: {} -> {}", sourceKey, destinationKey, e);
            throw new BusinessException(
                    "Failed to copy file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    public void moveFile(String sourceKey, String destinationKey) {
        try {
            log.info("Moving file from {} to {}", sourceKey, destinationKey);
            copyFile(sourceKey, destinationKey);
            deleteFile(sourceKey);
            log.info("File moved successfully: {} -> {}", sourceKey, destinationKey);
        } catch (Exception e) {
            log.error("Failed to move file: {} -> {}", sourceKey, destinationKey, e);
            throw new BusinessException(
                    "Failed to move file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    public String generatePresignedUrl(String fileKey) {
        try {
            if (fileKey == null || fileKey.isEmpty()) {
                throw new BusinessException(
                        "File key is empty",
                        ErrorCode.VALIDATION_ERROR.getCode(),
                        HttpStatus.SC_BAD_REQUEST
                );
            }

            log.debug("Generating presigned URL for: {}", fileKey);

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(storageConfig.getBucketName())
                    .key(fileKey)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(storageConfig.getPresignedUrlExpiryMinutes()))
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            String presignedUrl = presignedRequest.url().toString();

            log.debug("Generated presigned URL: {}", presignedUrl);
            return presignedUrl;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for: {}", fileKey, e);
            throw new BusinessException(
                    "Failed to generate presigned URL: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

}