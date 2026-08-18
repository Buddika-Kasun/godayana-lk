package com.godayana.visa_gateway_content.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GatewayCountryCountResponse {
    private long pending;
    private long inReview;
    private long completed;
    private long cancelled;
}
