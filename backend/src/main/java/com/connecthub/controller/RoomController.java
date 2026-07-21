package com.connecthub.controller;

import com.connecthub.dto.ApiResponse;
import com.connecthub.dto.RoomRequest;
import com.connecthub.dto.RoomResponse;
import com.connecthub.service.RoomService;
import com.connecthub.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        RoomResponse room = roomService.createRoom(userId);
        return ResponseEntity.ok(ApiResponse.success("Room created successfully", room));
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResponse<RoomResponse>> joinRoom(
            @Valid @RequestBody RoomRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        RoomResponse room = roomService.joinRoom(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Joined room successfully", room));
    }

    @PostMapping("/leave")
    public ResponseEntity<ApiResponse<Void>> leaveRoom(
            @RequestParam String roomCode,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        roomService.leaveRoom(roomCode, userId);
        return ResponseEntity.ok(ApiResponse.success("Left room successfully", null));
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomDetails(
            @PathVariable String roomCode) {
        RoomResponse room = roomService.getRoomDetails(roomCode);
        return ResponseEntity.ok(ApiResponse.success("Room details fetched", room));
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        return jwtUtil.getUserIdFromToken(token);
    }
}
