package com.connecthub.service;

import com.connecthub.dto.RoomRequest;
import com.connecthub.dto.RoomResponse;

public interface RoomService {
    RoomResponse createRoom(Long userId);
    RoomResponse joinRoom(RoomRequest request, Long userId);
    void leaveRoom(String roomCode, Long userId);
    RoomResponse getRoomDetails(String roomCode);
}
