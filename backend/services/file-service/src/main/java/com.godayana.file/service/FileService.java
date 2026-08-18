package com.godayana.file.service;

import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.file.dto.FileUploadResponse;
import com.godayana.file.entity.UploadedFile;
import com.godayana.file.repository.UploadedFileRepository;
import com.godayana.file.validator.FileValidator;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpStatus;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    private final S3Service s3Service;
    private final UploadedFileRepository fileRepository;
    private final FileValidator fileValidator;

    @Transactional
    public FileUploadResponse uploadProfilePic(String userId, MultipartFile file, String folder) {
        // Delete existing files first
        deleteExistingFilesInFolder(userId, folder);

        // Validate and upload new file
        fileValidator.validateImageFile(file);
        return uploadFileToS3(userId, file, folder);
    }

    @Transactional
    public FileUploadResponse uploadResume(String userId, MultipartFile file, String  folder) {
        deleteExistingFilesInFolder(userId, folder);
        fileValidator.validateDocumentFile(file);
        return uploadFileToS3(userId, file, folder);
    }

    @Transactional
    public FileUploadResponse uploadFile(String userId, MultipartFile file, String folder) {
        fileValidator.validateFile(file);
        return uploadFileToS3(userId, file, folder);
    }

    @Transactional
    public FileUploadResponse uploadImage(String userId, MultipartFile file, String folder) {
        fileValidator.validateImageFile(file);
        return uploadFileToS3(userId, file, folder);
    }

    @Transactional
    public FileUploadResponse uploadDocument(String userId, MultipartFile file, String folder) {
        fileValidator.validateDocumentFile(file);
        return uploadFileToS3(userId, file, folder);
    }

    /**
     * Delete all existing files for a user in a specific folder
     */
    private void deleteExistingFilesInFolder(String userId, String folder) {
        try {
            List<UploadedFile> existingFiles = fileRepository.findByUploaderIdAndFolderAndStatusNot(
                    userId, folder, UploadedFile.FileStatus.DELETED);

            if (existingFiles.isEmpty()) {
                return;
            }

            for (UploadedFile file : existingFiles) {
                try {
                    s3Service.deleteFile(file.getFileKey());
                    fileRepository.delete(file);
                } catch (Exception e) {
                    log.error("Failed to delete file: {} - {}", file.getId(), e.getMessage());
                }
            }

        } catch (Exception e) {
            log.error("Error deleting existing files for user: {} in folder: {}", userId, folder, e);
        }
    }

    private FileUploadResponse uploadFileToS3(String userId, MultipartFile file, String folder) {
        try {
            String fileKey = s3Service.uploadFile(file, folder);

            UploadedFile uploadedFile = UploadedFile.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .folder(folder)
                    .fileKey(fileKey)
                    .uploaderId(userId)
                    .status(UploadedFile.FileStatus.UPLOADED)
                    .createdAt(LocalDateTime.now())
                    .uploadedAt(LocalDateTime.now())
                    .build();

            uploadedFile = fileRepository.save(uploadedFile);

            return mapToResponse(uploadedFile);

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to upload file to S3", e);
            throw new BusinessException(
                    "Failed to upload file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    @Transactional(readOnly = true)
    public FileUploadResponse getFile(String fileId, String userId) {
        UploadedFile file = fileRepository.findByIdAndUploaderId(fileId, userId)
                .orElseThrow(() -> new BusinessException(
                        "File not found or not authorized",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        return mapToResponse(file);
    }

    @Transactional(readOnly = true)
    public String getFileUrl(String fileId, String userId) {
        UploadedFile file = fileRepository.findByIdAndUploaderId(fileId, userId)
                .orElseThrow(() -> new BusinessException(
                        "File not found or not authorized",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        return s3Service.getFileUrl(file.getFileKey());
    }

    @Transactional(readOnly = true)
    public String getFileUrlInternal(String fileId) {
        UploadedFile file = fileRepository.findById(fileId)
                .orElseThrow(() -> new BusinessException(
                        "File not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        return s3Service.getFileUrl(file.getFileKey());
    }

    @Transactional(readOnly = true)
    public List<FileUploadResponse> getFilesByUploaderId(String userId) {
        List<UploadedFile> files = fileRepository.findByUploaderIdAndStatusNot(
                userId, UploadedFile.FileStatus.DELETED);

        return files.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Download file by key (internal use)
     */
    public ResponseEntity<InputStreamResource> downloadFileByKey(String fileKey, HttpServletResponse response)
            throws Exception {

        log.info("Downloading file by key: {}", fileKey);

        UploadedFile file = fileRepository.findByFileKey(fileKey)
                .orElseThrow(() -> new BusinessException(
                        "File not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        return downloadFileFromS3(file, response);
    }

    private ResponseEntity<InputStreamResource> downloadFileFromS3(UploadedFile file, HttpServletResponse response)
            throws Exception {

        // Get file from S3
        InputStream inputStream = s3Service.downloadFile(file.getFileKey());

        if (inputStream == null) {
            throw new BusinessException(
                    "File not found in storage",
                    ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                    HttpStatus.SC_NOT_FOUND
            );
        }

        // Set content type
        String contentType = file.getFileType() != null ? file.getFileType() : "application/octet-stream";

        // Encode filename for proper display
        String encodedFileName = URLEncoder.encode(file.getFileName(), StandardCharsets.UTF_8)
                .replaceAll("\\+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(file.getFileSize()))
                .body(new InputStreamResource(inputStream));
    }

    @Transactional(readOnly = true)
    public List<FileUploadResponse> getFilesByFolder(String userId, String folder) {
        List<UploadedFile> files = fileRepository.findByUploaderIdAndFolderAndStatusNot(
                userId, folder, UploadedFile.FileStatus.DELETED);

        return files.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FileUploadResponse> getImagesByUser(String userId) {
        List<UploadedFile> files = fileRepository.findByUploaderIdAndStatusNot(
                userId, UploadedFile.FileStatus.DELETED);

        return files.stream()
                .filter(file -> file.getFileType() != null && file.getFileType().startsWith("image/"))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FileUploadResponse> getDocumentsByUser(String userId) {
        List<UploadedFile> files = fileRepository.findByUploaderIdAndStatusNot(
                userId, UploadedFile.FileStatus.DELETED);

        return files.stream()
                .filter(file -> {
                    if (file.getFileType() == null) return false;
                    String type = file.getFileType();
                    return type.equals("application/pdf") ||
                            type.equals("application/msword") ||
                            type.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteFile(String fileId, String userId) {
        UploadedFile file = fileRepository.findByIdAndUploaderId(fileId, userId)
                .orElseThrow(() -> new BusinessException(
                        "File not found or not authorized",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        try {
            s3Service.deleteFile(file.getFileKey());
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", file.getFileKey(), e);
            throw new BusinessException(
                    "Failed to delete file from storage: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }

        file.setStatus(UploadedFile.FileStatus.DELETED);
        file.setDeletedAt(LocalDateTime.now());
        fileRepository.save(file);
    }

    @Transactional
    public void deleteAllUserFiles(String userId) {
        List<UploadedFile> files = fileRepository.findByUploaderIdAndStatusNot(
                userId, UploadedFile.FileStatus.DELETED);

        for (UploadedFile file : files) {
            try {
                s3Service.deleteFile(file.getFileKey());
            } catch (Exception e) {
                log.error("Failed to delete file from S3: {}", file.getFileKey(), e);
            }

            file.setStatus(UploadedFile.FileStatus.DELETED);
            file.setDeletedAt(LocalDateTime.now());
        }

        fileRepository.saveAll(files);
    }

    @Transactional
    public void adminDeleteFile(String fileId) {
        UploadedFile file = fileRepository.findById(fileId)
                .orElseThrow(() -> new BusinessException(
                        "File not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        try {
            s3Service.deleteFile(file.getFileKey());
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", file.getFileKey(), e);
            throw new BusinessException(
                    "Failed to delete file from storage: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }

        fileRepository.delete(file);
    }

    @Transactional(readOnly = true)
    public List<FileUploadResponse> getAllFiles() {
        return fileRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FileUploadResponse getFileByKey(String fileKey) {
        UploadedFile file = fileRepository.findByFileKey(fileKey)
                .orElseThrow(() -> new BusinessException(
                        "File not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        return mapToResponse(file);
    }

    @Transactional(readOnly = true)
    public long getFileCountByUser(String userId) {
        return fileRepository.countByUploaderIdAndStatusNot(userId, UploadedFile.FileStatus.DELETED);
    }

    @Transactional(readOnly = true)
    public long getTotalStorageUsedByUser(String userId) {
        return fileRepository.sumFileSizeByUploaderIdAndStatusNot(userId, UploadedFile.FileStatus.DELETED);
    }

    public String getPresignedUrl(String fileKey) {
        log.debug("Generating presigned URL for file key: {}", fileKey);

        // Optional: Check if file exists
        UploadedFile file = fileRepository.findByFileKey(fileKey)
                .orElseThrow(() -> new BusinessException(
                        "File not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        // Generate presigned URL
        return s3Service.generatePresignedUrl(file.getFileKey());
    }

//    @Transactional(readOnly = true)
//    public Map<String, String> getPresignedUrlsBatch(List<String> fileKeys) {
//        log.debug("Getting batch presigned URLs for {} files", fileKeys.size());
//
//        if (fileKeys == null || fileKeys.isEmpty()) {
//            return new HashMap<>();
//        }
//
//        // Remove duplicates
//        List<String> uniqueKeys = fileKeys.stream()
//                .filter(key -> key != null && !key.isEmpty())
//                .distinct()
//                .collect(Collectors.toList());
//
//        if (uniqueKeys.isEmpty()) {
//            return new HashMap<>();
//        }
//
//        Map<String, String> result = new HashMap<>();
//        List<String> keysToFetch = new ArrayList<>();
//
//        // Check cache first
////        for (String fileKey : uniqueKeys) {
////            if (presignedUrlCache.containsKey(fileKey)) {
////                result.put(fileKey, presignedUrlCache.get(fileKey));
////            } else {
////                keysToFetch.add(fileKey);
////            }
////        }
//
////        if (keysToFetch.isEmpty()) {
////            return result;
////        }
//
//        // Fetch files from database
//        List<UploadedFile> files = fileRepository.findByFileKeyIn(keysToFetch);
//        Map<String, UploadedFile> fileMap = files.stream()
//                .collect(Collectors.toMap(
//                        UploadedFile::getFileKey,
//                        file -> file,
//                        (existing, replacement) -> existing
//                ));
//
//        // Generate presigned URLs for each file
//        for (String fileKey : keysToFetch) {
//            UploadedFile file = fileMap.get(fileKey);
//            if (file != null) {
//                try {
//                    String presignedUrl = s3Service.generatePresignedUrl(file.getFileKey());
//                    result.put(fileKey, presignedUrl);
////                    presignedUrlCache.put(fileKey, presignedUrl);
//                } catch (Exception e) {
//                    log.error("Failed to generate presigned URL for: {}", fileKey, e);
//                    result.put(fileKey, null);
//                }
//            } else {
//                log.warn("File not found or inactive: {}", fileKey);
//                result.put(fileKey, null);
//            }
//        }
//
//        log.debug("Batch presigned URLs generated for {} files", result.size());
//        return result;
//    }

    @Transactional(readOnly = true)
    public Map<String, String> getPresignedUrlsBatch(List<String> fileKeys) {
        log.debug("Getting batch presigned URLs for {} files", fileKeys.size());

        if (fileKeys == null || fileKeys.isEmpty()) {
            return new HashMap<>();
        }

        // Remove duplicates
        List<String> uniqueKeys = fileKeys.stream()
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .collect(Collectors.toList());

        if (uniqueKeys.isEmpty()) {
            return new HashMap<>();
        }

        Map<String, String> result = new HashMap<>();

        // Fetch files from database
        List<UploadedFile> files = fileRepository.findByFileKeyIn(uniqueKeys);
        Map<String, UploadedFile> fileMap = files.stream()
                .collect(Collectors.toMap(
                        UploadedFile::getFileKey,
                        file -> file,
                        (existing, replacement) -> existing
                ));

        // Generate presigned URLs for each file
        for (String fileKey : uniqueKeys) {
            UploadedFile file = fileMap.get(fileKey);
            if (file != null) {
                try {
                    String presignedUrl = s3Service.generatePresignedUrl(file.getFileKey());
                    result.put(fileKey, presignedUrl);
                } catch (Exception e) {
                    log.error("Failed to generate presigned URL for: {}", fileKey, e);
                    result.put(fileKey, null);
                }
            } else {
                log.warn("File not found or inactive: {}", fileKey);
                result.put(fileKey, null);
            }
        }

        log.debug("Batch presigned URLs generated for {} files", result.size());
        return result;
    }

    public String getPresignedUrlFromUserId(String userId) {

        // Optional: Check if file exists
        UploadedFile file = fileRepository.findByUploaderId(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new BusinessException(
                        "File not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        // Generate presigned URL
        return s3Service.generatePresignedUrl(file.getFileKey());
    }

    public String getProfilePicPresignedUrlFromUserId(String userId) {

        // Define allowed profile picture folders
        Set<String> allowedFolders = Set.of("seeker-profile-pics", "company-profile-pics");

        // Find files uploaded by this user
        List<UploadedFile> userFiles = fileRepository.findByUploaderId(userId);

        userFiles.forEach(file -> log.info("File: folder={}, fileKey={}", file.getFolder(), file.getFileKey()));

        if (userFiles.isEmpty()) {
            throw new BusinessException(
                    "No files found for user",
                    ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                    HttpStatus.SC_NOT_FOUND
            );
        }

        // Filter for profile pictures in allowed folders
        UploadedFile profilePicFile = userFiles.stream()
                .filter(file -> {
                    // Check by folder field
                    if (file.getFolder() != null) {
                        boolean isAllowed = allowedFolders.contains(file.getFolder().trim());
                        return isAllowed;
                    }
                    return false;
                })
                .findFirst()
                .orElseThrow(() -> {
                    return new BusinessException(
                            "Profile picture not found in allowed folders: " + allowedFolders,
                            ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                            HttpStatus.SC_NOT_FOUND
                    );
                });

        // Generate presigned URL
        return s3Service.generatePresignedUrl(profilePicFile.getFileKey());
    }

    private FileUploadResponse mapToResponse(UploadedFile file) {
        return FileUploadResponse.builder()
                .fileId(file.getId())
                .fileKey(file.getFileKey())
                .fileName(file.getFileName())
                .fileType(file.getFileType())
                .fileSize(file.getFileSize())
                .folder(file.getFolder())
                .fileUrl(s3Service.generatePresignedUrl(file.getFileKey()))
                .status(file.getStatus().name())
                .createdAt(file.getCreatedAt())
                .uploadedAt(file.getUploadedAt())
                .build();
    }
}