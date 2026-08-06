package com.godayana.course.controller;

import com.godayana.course.dto.response.CourseSaveResponse;
import com.godayana.course.service.interfaces.ICourseSaveService;
import com.godayana.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses/save")
@RequiredArgsConstructor
@Slf4j
public class CourseSaveController {

    private final ICourseSaveService courseSaveService;

    @PostMapping("/{courseId}")
    public ApiResponse<CourseSaveResponse> saveJob(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID courseId
    ) {
        log.info("Save job: {} by seeker: {}", courseId, seekerId);
        return ApiResponse.success(courseSaveService.saveCourse(UUID.fromString(seekerId), courseId));
    }

    @GetMapping
    public ApiResponse<Page<CourseSaveResponse>> getSavedJobBySeeker(
            @RequestHeader("X-User-Id") String seekerId,
            Pageable pageable) {
        log.info("Fetching saved courses by seeker: {}", seekerId);
        return ApiResponse.success(courseSaveService.getSavedCoursesBySeeker(UUID.fromString(seekerId), pageable));
    }

    @DeleteMapping
    public ApiResponse<Void> removeAllSavedJob(
            @RequestHeader("X-User-Id") String seekerId
    ) {
        log.info("Remove saved jobs by seeker: {}", seekerId);
        courseSaveService.removeAllSeekerSavedCourses(UUID.fromString(seekerId));
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{courseId}")
    public ApiResponse<Void> removeSavedJob(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID courseId
    ) {
        log.info("Remove saved course: {} by seeker: {}", courseId, seekerId);
        courseSaveService.removeSavedCourse(UUID.fromString(seekerId), courseId);
        return ApiResponse.success(null);
    }

    @GetMapping("/count")
    public ApiResponse<Long> countSavedJobs(
            @RequestHeader("X-User-Id") String seekerId
    ) {
        log.info("Counting saved jobs of seeker: {}", seekerId);
        return ApiResponse.success(courseSaveService.countSavedCoursesBySeeker(
                UUID.fromString(seekerId)));
    }

    @GetMapping("/check/{courseId}")
    public ApiResponse<Boolean> checkSavedJob(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID courseId
    ) {
        log.info("Checking saved course of seeker: {}", seekerId);
        return ApiResponse.success(courseSaveService.checkSavedCourse(
                UUID.fromString(seekerId), courseId));
    }
}