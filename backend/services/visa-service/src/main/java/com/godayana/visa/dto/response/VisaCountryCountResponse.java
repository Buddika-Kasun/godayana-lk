package com.godayana.visa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisaCountryCountResponse {
    private long student;
    private long work;
    private long visit;
    private long pending;
    private long inReview;
    private long completed;
    private long cancelled;
}
