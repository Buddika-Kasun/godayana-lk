package com.godayana.visa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.godayana.visa", "com.godayana.exception"})
public class VisaServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(VisaServiceApplication.class, args);
    }
}