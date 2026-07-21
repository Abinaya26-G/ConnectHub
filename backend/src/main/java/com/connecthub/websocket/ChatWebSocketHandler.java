package com.connecthub.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, CopyOnWriteArrayList<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
    private final Map<String, String> sessionRoomMap = new ConcurrentHashMap<>();
    private final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("New WebSocket connection: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Received: " + payload);
        
        ChatMessage chatMessage = objectMapper.readValue(payload, ChatMessage.class);
        String roomCode = chatMessage.getRoomCode();
        
        sessionRoomMap.put(session.getId(), roomCode);
        sessionUserMap.put(session.getId(), chatMessage.getSender());
        roomSessions.computeIfAbsent(roomCode, k -> new CopyOnWriteArrayList<>()).add(session);
        
        switch (chatMessage.getType()) {
            case "JOIN":
                broadcastOnlineCount(roomCode);
                broadcastToRoom(roomCode, chatMessage, session);
                if (roomSessions.get(roomCode).size() == 2) {
                    ChatMessage readyMsg = new ChatMessage();
                    readyMsg.setType("READY");
                    readyMsg.setSender("System");
                    readyMsg.setContent("Both users are here! Ready to chat.");
                    readyMsg.setRoomCode(roomCode);
                    readyMsg.setTimestamp(System.currentTimeMillis());
                    broadcastToRoom(roomCode, readyMsg, null);
                }
                break;
            case "LEAVE":
                broadcastToRoom(roomCode, chatMessage, session);
                removeSession(session);
                break;
            case "CHAT":
                broadcastToRoom(roomCode, chatMessage, null);
                break;
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomCode = sessionRoomMap.get(session.getId());
        String userName = sessionUserMap.get(session.getId());
        
        if (roomCode != null && userName != null) {
            ChatMessage leaveMsg = new ChatMessage();
            leaveMsg.setType("LEAVE");
            leaveMsg.setSender(userName);
            leaveMsg.setContent(userName + " left the room");
            leaveMsg.setRoomCode(roomCode);
            leaveMsg.setTimestamp(System.currentTimeMillis());
            
            try {
                broadcastToRoom(roomCode, leaveMsg, session);
            } catch (Exception e) {
                System.out.println("Error broadcasting leave: " + e.getMessage());
            }
            removeSession(session);
        }
    }

    private void broadcastToRoom(String roomCode, ChatMessage message, WebSocketSession exclude) throws IOException {
        CopyOnWriteArrayList<WebSocketSession> sessions = roomSessions.get(roomCode);
        if (sessions == null) return;
        
        String json = objectMapper.writeValueAsString(message);
        for (WebSocketSession s : sessions) {
            if (s.isOpen() && (exclude == null || !s.getId().equals(exclude.getId()))) {
                s.sendMessage(new TextMessage(json));
            }
        }
    }

    private void broadcastOnlineCount(String roomCode) throws IOException {
        CopyOnWriteArrayList<WebSocketSession> sessions = roomSessions.get(roomCode);
        int count = sessions != null ? sessions.size() : 0;
        
        ChatMessage countMsg = new ChatMessage();
        countMsg.setType("COUNT");
        countMsg.setSender("System");
        countMsg.setContent(String.valueOf(count));
        countMsg.setRoomCode(roomCode);
        countMsg.setTimestamp(System.currentTimeMillis());
        
        broadcastToRoom(roomCode, countMsg, null);
    }

    private void removeSession(WebSocketSession session) {
        String roomCode = sessionRoomMap.remove(session.getId());
        sessionUserMap.remove(session.getId());
        
        if (roomCode != null) {
            CopyOnWriteArrayList<WebSocketSession> sessions = roomSessions.get(roomCode);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    roomSessions.remove(roomCode);
                } else {
                    try {
                        broadcastOnlineCount(roomCode);
                    } catch (Exception e) {
                        System.out.println("Error updating count: " + e.getMessage());
                    }
                }
            }
        }
    }
}