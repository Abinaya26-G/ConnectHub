package com.connecthub.service;

import com.connecthub.dto.AuthResponse;
import com.connecthub.dto.LoginRequest;
import com.connecthub.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
