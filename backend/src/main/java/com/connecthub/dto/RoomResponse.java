package com.connecthub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private Long id;
    private String roomCode;
    private String createdBy;
    private String participantOne;
    private String participantTwo;
    private String status;
    private int participantCount;
    private LocalDateTime createdAt;
}
