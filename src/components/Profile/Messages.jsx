import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaSearch, FaArrowLeft } from "react-icons/fa";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch user data and conversations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view messages");
          setLoading(false);
          return;
        }

        // Get user data
        const userResponse = await axios.get("http://localhost:3000/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data.userData);

        // Get conversations
        const conversationsResponse = await axios.get("http://localhost:3000/api/messages/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(conversationsResponse.data.conversations || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load messages. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;
      
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");
        
        const response = await axios.get(`http://localhost:3000/api/messages/${activeConversation.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setMessages(response.data.messages || []);
        setLoading(false);
        
        // Mark messages as read
        await axios.post(
          `http://localhost:3000/api/messages/${activeConversation.id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update unread count in conversations list
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === activeConversation.id ? { ...conv, unreadCount: 0 } : conv
          )
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load conversation messages.");
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeConversation]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const token = sessionStorage.getItem("token");
      
      // Optimistically update UI
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: newMessage,
        sender: userData.id,
        createdAt: new Date().toISOString(),
        isTemp: true
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");

      // Send to server
      const response = await axios.post(
        `http://localhost:3000/api/messages/${activeConversation.id}/send`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Replace temp message with actual message from server
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? response.data.message : msg
        )
      );

      // Update last message in conversation list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversation.id 
            ? { ...conv, lastMessage: newMessage, lastMessageDate: new Date().toISOString() } 
            : conv
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove temp message if send failed
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
      setError("Failed to send message. Please try again.");
    }
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    setError(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.otherUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.itemName && conv.itemName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && !activeConversation && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-yellow-400">Loading messages...</div>
      </div>
    );
  }

  if (error && !activeConversation && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <h1 className="text-3xl font-bold text-yellow-400 p-6">Messages</h1>
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Conversations List - Hide on mobile when conversation is active */}
        <div className={`w-full md:w-1/3 bg-zinc-800 overflow-hidden ${activeConversation && 'hidden md:block'}`}>
          <div className="p-4 border-b border-zinc-700">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-yellow-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-full" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-zinc-400">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => selectConversation(conversation)}
                  className={`p-4 border-b border-zinc-700 hover:bg-zinc-700 cursor-pointer transition-all duration-200 ${
                    activeConversation?.id === conversation.id ? 'bg-zinc-700' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={conversation.otherUserAvatar || "https://via.placeholder.com/40"}
                        alt={conversation.otherUserName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 text-zinc-900 text-xs flex items-center justify-center font-bold">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white truncate">{conversation.otherUserName}</h3>
                        <span className="text-xs text-zinc-400">
                          {formatDate(conversation.lastMessageDate)}
                        </span>
                      </div>
                      {conversation.itemName && (
                        <p className="text-xs text-yellow-400 mb-1 truncate">
                          RE: {conversation.itemName}
                        </p>
                      )}
                      <p className="text-sm text-zinc-300 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Message View */}
        <div className={`w-full md:w-2/3 flex flex-col h-full ${!activeConversation && 'hidden md:flex md:items-center md:justify-center'}`}>
          {!activeConversation ? (
            <div className="text-center text-zinc-400 p-8">
              <svg className="w-20 h-20 mx-auto mb-4 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <p className="text-xl">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-zinc-700 bg-zinc-800 flex items-center">
                <button 
                  className="md:hidden mr-3 text-zinc-400 hover:text-white"
                  onClick={() => setActiveConversation(null)}
                >
                  <FaArrowLeft />
                </button>
                <img
                  src={activeConversation.otherUserAvatar || "https://via.placeholder.com/40"}
                  alt={activeConversation.otherUserName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="font-bold text-white">{activeConversation.otherUserName}</h3>
                  {activeConversation.itemName && (
                    <p className="text-xs text-yellow-400">RE: {activeConversation.itemName}</p>
                  )}
                </div>
              </div>
              
              {/* Messages Container */}
              <div 
                className="flex-1 overflow-y-auto p-4 bg-zinc-900"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
              >
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="text-yellow-400">Loading messages...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400">
                    <p>No messages yet. Send a message to start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isCurrentUser = message.sender === userData.id;
                      const showDate = index === 0 || new Date(message.createdAt).toDateString() !== new Date(messages[index - 1].createdAt).toDateString();
                      
                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="text-xs bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-3/4 ${isCurrentUser ? 'bg-yellow-400 text-zinc-900' : 'bg-zinc-700 text-white'} rounded-lg px-4 py-3 ${message.isTemp ? 'opacity-70' : ''}`}>
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${isCurrentUser ? 'text-zinc-800' : 'text-zinc-400'}`}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {message.isTemp && ' • Sending...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-zinc-700 bg-zinc-800">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-3 rounded-l bg-zinc-700 text-white border border-zinc-600 focus:border-yellow-400"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-yellow-400 text-zinc-900 p-3 rounded-r hover:bg-yellow-500 transition-colors"
                    disabled={!newMessage.trim()}
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;