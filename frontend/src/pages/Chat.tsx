import { useEffect, useState, useRef } from 'react';
import { Search, Send, Hash, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatApi } from '@/services/api';
import type { Channel, Message } from '@/types';

export default function Chat() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      loadMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChannels = async () => {
    try {
      const data = await chatApi.getChannels();
      setChannels(data);
      if (data.length > 0) {
        setSelectedChannel(data[0]);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    }
  };

  const loadMessages = async (channelId: string) => {
    try {
      const data = await chatApi.getMessages(channelId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel) return;

    const message = {
      senderId: '1',
      senderName: 'Employee',
      senderAvatar: 'EM',
      content: newMessage,
      timestamp: new Date().toISOString(),
      channelId: selectedChannel.id,
    };

    try {
      await chatApi.sendMessage(message);
      setNewMessage('');
      loadMessages(selectedChannel.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex h-full">
        {/* Channels Sidebar */}
        <div className="w-64 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search channels..."
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Channel List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              <p className="text-xs font-medium text-gray-500 px-3 py-2">CHANNELS</p>
              {channels.filter(c => c.type === 'public').map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedChannel?.id === channel.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span className="flex-1 text-left">{channel.name}</span>
                  {channel.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              ))}

              <p className="text-xs font-medium text-gray-500 px-3 py-2 mt-4">DIRECT MESSAGES</p>
              {channels.filter(c => c.type === 'direct').map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedChannel?.id === channel.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                    {channel.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="flex-1 text-left">{channel.name}</span>
                  {channel.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChannel ? (
            <>
              {/* Channel Header */}
              <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  {selectedChannel.type === 'direct' ? (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">
                      {selectedChannel.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Hash className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedChannel.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedChannel.type === 'public' ? 'Public channel' : 'Direct message'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs flex-shrink-0">
                        {message.senderAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{message.senderName}</span>
                          <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a channel to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
