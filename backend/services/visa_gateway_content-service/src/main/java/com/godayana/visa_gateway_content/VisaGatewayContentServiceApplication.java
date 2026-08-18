package com.godayana.visa_gateway_content;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.godayana.visa_gateway_content", "com.godayana.exception"})
public class VisaGatewayContentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(VisaGatewayContentServiceApplication.class, args);
    }
}