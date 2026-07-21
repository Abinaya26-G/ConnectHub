package com.connecthub.websocket;

public class ChatMessage {
    private String type;
    private String sender;
    private String content;
    private String roomCode;
    private long timestamp;

    public ChatMessage() {}

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}