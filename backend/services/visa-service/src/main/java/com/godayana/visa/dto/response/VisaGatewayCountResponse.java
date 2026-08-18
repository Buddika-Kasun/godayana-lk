package com.godayana.visa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisaGatewayCountResponse {
    private long visaCount;
    private long gatewayCount;
}
