package com.godayana.course.service.impl;

import com.godayana.course.dto.response.CourseSaveResponse;
import com.godayana.course.entity.Course;
import com.godayana.course.entity.CourseSave;
import com.godayana.course.repository.CourseRepository;
import com.godayana.course.repository.CourseSaveRepository;
import com.godayana.course.service.interfaces.ICourseSaveService;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseSaveServiceImpl implements ICourseSaveService {

    private final CourseSaveRepository courseSaveRepository;
    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public CourseSaveResponse saveCourse(UUID seekerId, UUID courseId) {
        log.info("Save course: {} by seeker: {}", courseId, seekerId);

        Course job = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (job.getStatus() != Course.CourseStatus.APPROVED) {
            throw new BusinessException("Course is not open for save",
                    ErrorCode.BUSINESS_ERROR.getCode(), 400);
        }

        if (courseSaveRepository.existsBySeekerIdAndCourseId(seekerId, courseId)) {
            throw new BusinessException("You have already saved this job",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(), 409);
        }

        CourseSave savedCourse = CourseSave.builder()
                .courseId(courseId)
                .seekerId(seekerId)
                .build();

        savedCourse = courseSaveRepository.save(savedCourse);

        return mapToResponse(savedCourse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseSaveResponse> getSavedCoursesBySeeker(UUID seekerId, Pageable pageable) {
        return courseSaveRepository.findBySeekerId(seekerId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void removeSavedCourse(UUID seekerId, UUID courseId) {
        courseSaveRepository.deleteBySeekerIdAndCourseId(seekerId, courseId);
    }

    @Override
    @Transactional
    public void removeAllSeekerSavedCourses(UUID seekerId) {
        courseSaveRepository.deleteAllBySeekerId(seekerId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countSavedCoursesBySeeker(UUID seekerId) {
        return courseSaveRepository.countBySeekerId(seekerId);
    }

    @Override
    public Boolean checkSavedCourse(UUID seekerId, UUID courseId) {
        return courseSaveRepository.existsBySeekerIdAndCourseId(seekerId, courseId);
    }

    private CourseSaveResponse mapToResponse(CourseSave savedCourse) {
        return CourseSaveResponse.builder()
                .courseId(savedCourse.getCourseId())
                .seekerId(savedCourse.getSeekerId())
                .savedAt(savedCourse.getSavedAt())
                .build();
    }

}