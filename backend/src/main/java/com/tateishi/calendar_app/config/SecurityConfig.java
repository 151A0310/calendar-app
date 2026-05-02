package com.tateishi.calendar_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF無効化
                .cors(cors -> {
                }) // CORS有効化（CorsConfigと連携）
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // 全部許可

        return http.build();
    }
}
