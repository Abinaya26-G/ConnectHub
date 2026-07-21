package com.connecthub.service;

import com.connecthub.dto.UserProfileResponse;

public interface UserService {
    UserProfileResponse getUserProfile(Long userId);
}
