// src/main/java/com/godayana/file/repository/UploadedFileRepository.java
package com.godayana.file.repository;

import com.godayana.file.entity.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UploadedFileRepository extends JpaRepository<UploadedFile, String> {

    Optional<UploadedFile> findByIdAndUploaderId(String id, String uploaderId);

    List<UploadedFile> findByUploaderIdAndStatusNot(String uploaderId, UploadedFile.FileStatus status);

    List<UploadedFile> findByUploaderIdAndFolderAndStatusNot(String uploaderId, String folder, UploadedFile.FileStatus status);

    Optional<UploadedFile> findByFileKey(String fileKey);

    @Query("SELECT f FROM UploadedFile f WHERE f.fileKey IN :fileKeys")
    List<UploadedFile> findByFileKeyIn(@Param("fileKeys") List<String> fileKeys);

    List<UploadedFile> findByUploaderId(String uploaderId);

    List<UploadedFile> findByFolder(String folder);

    void deleteByUploaderId(String uploaderId);

    long countByUploaderIdAndStatusNot(String uploaderId, UploadedFile.FileStatus status);

    @Query("SELECT COALESCE(SUM(f.fileSize), 0) FROM UploadedFile f WHERE f.uploaderId = :uploaderId AND f.status != :status")
    long sumFileSizeByUploaderIdAndStatusNot(@Param("uploaderId") String uploaderId, @Param("status") UploadedFile.FileStatus status);
}