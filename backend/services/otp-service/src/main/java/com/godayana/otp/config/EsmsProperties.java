package com.godayana.otp.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "esms")
@Getter
@Setter
public class EsmsProperties {
    private String username;
    private String password;
    private String senderAlias;
    private int messageType = 1;
    private long sessionTimeout = 240000; // 4 minutes
}