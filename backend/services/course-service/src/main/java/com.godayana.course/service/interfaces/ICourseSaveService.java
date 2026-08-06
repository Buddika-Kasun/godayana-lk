package com.godayana.course.service.interfaces;

import com.godayana.course.dto.response.CourseSaveResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ICourseSaveService {

    CourseSaveResponse saveCourse(UUID seekerId, UUID courseId);

    Page<CourseSaveResponse> getSavedCoursesBySeeker(UUID seekerId, Pageable pageable);

    void removeSavedCourse(UUID seekerId, UUID courseId);

    void removeAllSeekerSavedCourses(UUID seekerId);

    long countSavedCoursesBySeeker(UUID seekerId);

    Boolean checkSavedCourse(UUID seekerId, UUID courseId);

}