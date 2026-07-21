package com.connecthub.service.impl;

import com.connecthub.dto.RoomRequest;
import com.connecthub.dto.RoomResponse;
import com.connecthub.entity.Room;
import com.connecthub.entity.User;
import com.connecthub.exception.ResourceNotFoundException;
import com.connecthub.exception.RoomFullException;
import com.connecthub.exception.RoomNotFoundException;
import com.connecthub.repository.RoomRepository;
import com.connecthub.repository.UserRepository;
import com.connecthub.service.RoomService;
import com.connecthub.util.RoomCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomCodeGenerator roomCodeGenerator;

    @Override
    @Transactional
    public RoomResponse createRoom(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String roomCode;
        do {
            roomCode = roomCodeGenerator.generateCode();
        } while (roomRepository.existsByRoomCode(roomCode));

        Room room = Room.builder()
                .roomCode(roomCode)
                .createdBy(user)
                .participantOne(user)
                .status("ACTIVE")
                .build();

        Room savedRoom = roomRepository.save(room);
        return mapToRoomResponse(savedRoom);
    }

    @Override
    @Transactional
    public RoomResponse joinRoom(RoomRequest request, Long userId) {
        Room room = roomRepository.findByRoomCode(request.getRoomCode())
                .orElseThrow(() -> new RoomNotFoundException("Room not found with code: " + request.getRoomCode()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (room.getParticipantOne() != null && room.getParticipantOne().getId().equals(userId)) {
            return mapToRoomResponse(room);
        }

        if (room.getParticipantTwo() != null) {
            throw new RoomFullException("Room is already full. Maximum 2 participants allowed.");
        }

        room.setParticipantTwo(user);
        Room updatedRoom = roomRepository.save(room);
        return mapToRoomResponse(updatedRoom);
    }

    @Override
    @Transactional
    public void leaveRoom(String roomCode, Long userId) {
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with code: " + roomCode));

        if (room.getParticipantOne() != null && room.getParticipantOne().getId().equals(userId)) {
            room.setParticipantOne(null);
        } else if (room.getParticipantTwo() != null && room.getParticipantTwo().getId().equals(userId)) {
            room.setParticipantTwo(null);
        } else {
            throw new ResourceNotFoundException("User is not a participant of this room");
        }

        if (room.getParticipantOne() == null && room.getParticipantTwo() == null) {
            roomRepository.delete(room);
        } else {
            roomRepository.save(room);
        }
    }

    @Override
    public RoomResponse getRoomDetails(String roomCode) {
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with code: " + roomCode));
        return mapToRoomResponse(room);
    }

    private RoomResponse mapToRoomResponse(Room room) {
        int count = 0;
        if (room.getParticipantOne() != null) count++;
        if (room.getParticipantTwo() != null) count++;

        return RoomResponse.builder()
                .id(room.getId())
                .roomCode(room.getRoomCode())
                .createdBy(room.getCreatedBy() != null ? room.getCreatedBy().getName() : null)
                .participantOne(room.getParticipantOne() != null ? room.getParticipantOne().getName() : null)
                .participantTwo(room.getParticipantTwo() != null ? room.getParticipantTwo().getName() : null)
                .status(room.getStatus())
                .participantCount(count)
                .createdAt(room.getCreatedAt())
                .build();
    }
}
