package com.connecthub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomRequest {
    @NotBlank(message = "Room code is required")
    @Size(min = 6, max = 6, message = "Room code must be exactly 6 characters")
    private String roomCode;
}
