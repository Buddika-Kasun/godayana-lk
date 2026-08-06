// src/main/java/com/godayana/file/controller/FileController.java
package com.godayana.file.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.file.dto.FileUploadResponse;
import com.godayana.file.service.FileService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

//    @PostMapping("/upload/profile-pic")
//    public ApiResponse<FileUploadResponse> uploadProfilePic(
//            @RequestHeader("X-User-Id") String userId,
//            @RequestParam("file") MultipartFile file) {
//        return ApiResponse.success(fileService.uploadProfilePic(userId, file));
//    }

//    @PostMapping("/upload/resume")
//    public ApiResponse<FileUploadResponse> uploadResume(
//            @RequestHeader("X-User-Id") String userId,
//            @RequestParam("file") MultipartFile file) {
//        return ApiResponse.success(fileService.uploadResume(userId, file));
//    }

    @PostMapping("/upload")
    public ApiResponse<FileUploadResponse> uploadFile(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "uploads") String folder) {
        return ApiResponse.success(fileService.uploadFile(userId, file, folder));
    }

    @GetMapping("/{fileId}")
    public ApiResponse<FileUploadResponse> getFile(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String fileId) {
        return ApiResponse.success(fileService.getFile(fileId, userId));
    }

    @GetMapping("/url/{fileId}")
    public ApiResponse<String> getFileUrl(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String fileId) {
        return ApiResponse.success(fileService.getFileUrl(fileId, userId));
    }

    @GetMapping("/my-files")
    public ApiResponse<List<FileUploadResponse>> getMyFiles(
            @RequestHeader("X-User-Id") String userId) {
        return ApiResponse.success(fileService.getFilesByUploaderId(userId));
    }

    @DeleteMapping("/{fileId}")
    public ApiResponse<Void> deleteFile(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String fileId) {
        fileService.deleteFile(fileId, userId);
        return ApiResponse.success(null);
    }

    // Admin endpoints
    @DeleteMapping("/admin/{fileId}")
    public ApiResponse<Void> adminDeleteFile(@PathVariable String fileId) {
        fileService.adminDeleteFile(fileId);
        return ApiResponse.success(null);
    }

    @GetMapping("/admin/all")
    public ApiResponse<List<FileUploadResponse>> getAllFiles() {
        return ApiResponse.success(fileService.getAllFiles());
    }

    @GetMapping("/admin/user/{userId}/files")
    public ApiResponse<List<FileUploadResponse>> getUserFiles(@PathVariable String userId) {
        return ApiResponse.success(fileService.getFilesByUploaderId(userId));
    }

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadFile(
            @RequestParam String fileKey,
            HttpServletResponse response) throws Exception {

        return fileService.downloadFileByKey(fileKey, response);
    }

    // Internal endpoints for other services
    @PostMapping("/internal/upload")
    public ApiResponse<FileUploadResponse> internalUploadFile(
            @RequestParam String userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "uploads") String folder) {
        return ApiResponse.success(fileService.uploadFile(userId, file, folder));
    }

    @PostMapping("/internal/upload/profile-pic")
    public ApiResponse<FileUploadResponse> internalUploadProfilePic(
            @RequestParam String userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "uploads") String folder) {
        return ApiResponse.success(fileService.uploadProfilePic(userId, file, folder));
    }

    @PostMapping("/internal/upload/resume")
    public ApiResponse<FileUploadResponse> internalUploadResume(
            @RequestParam String userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "resume") String folder) {
        return ApiResponse.success(fileService.uploadResume(userId, file, folder));
    }

    @PostMapping("/internal/presigned-url")
    public ApiResponse<String> getPresignedUrl(
            @RequestBody Map<String, String> request
    ) {
        String fileKey = request.get("fileKey");
        if (fileKey == null || fileKey.isEmpty()) {
            return ApiResponse.error("File key is required");
        }
        return ApiResponse.success(fileService.getPresignedUrl(fileKey));
    }

    @PostMapping("/internal/presigned-urls/batch")
    public ApiResponse<Map<String, String>> getPresignedUrlsBatch(
            @RequestBody List<String> fileKeys
    ) {
        log.info("Getting batch presigned URLs for {} files", fileKeys != null ? fileKeys.size() : 0);

        if (fileKeys == null || fileKeys.isEmpty()) {
            return ApiResponse.success(new HashMap<>());
        }

        return ApiResponse.success(fileService.getPresignedUrlsBatch(fileKeys));
    }

    @GetMapping("/internal/presigned-url/{userId}")
    public ApiResponse<String> getPresignedUrlFromUserId(
            @PathVariable String userId
    ) {
        return ApiResponse.success(fileService.getPresignedUrlFromUserId(userId));
    }

    @GetMapping("/internal/presigned-url/profile-pics/{userId}")
    public ApiResponse<String> getProfilePicPresignedUrlFromUserId(
            @PathVariable String userId
    ) {
        return ApiResponse.success(fileService.getProfilePicPresignedUrlFromUserId(userId));
    }

    @GetMapping("/internal/url/{fileId}")
    public ApiResponse<String> internalGetFileUrl(@PathVariable String fileId) {
        return ApiResponse.success(fileService.getFileUrlInternal(fileId));
    }

    @DeleteMapping("/internal/{fileId}")
    public ApiResponse<Void> internalDeleteFile(@PathVariable String fileId) {
        fileService.adminDeleteFile(fileId);
        return ApiResponse.success(null);
    }
}