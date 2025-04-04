
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Trash2, Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { menuAPI } from "@/services/restaurantService";

type MessageType = {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

type OrderItemType = {
  name: string;
  quantity: number;
  notes?: string;
};

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      text: "Hello! I'm your voice assistant. How can I help you today? You can ask me about the menu, place an order, or inquire about restaurant information.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [currentOrder, setCurrentOrder] = useState<OrderItemType[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Load menu items
    const fetchMenuItems = async () => {
      try {
        const items = await menuAPI.getMenuItems();
        setMenuItems(items || []);
      } catch (error) {
        console.error("Failed to load menu items:", error);
        // Mock data if API fails
        setMenuItems([
          { id: "1", name: "Seared Salmon", price: 22.99, category: "Main Course" },
          { id: "2", name: "Chocolate Lava Cake", price: 8.99, category: "Dessert" },
          { id: "3", name: "Garlic Truffle Fries", price: 6.99, category: "Appetizer" },
          { id: "4", name: "Caesar Salad", price: 9.99, category: "Salad" },
          { id: "5", name: "Margherita Pizza", price: 14.99, category: "Main Course" },
        ]);
      }
    };
    
    fetchMenuItems();

    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptValue = result[0].transcript;
        setTranscript(transcriptValue);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current?.start();
        }
      };
    } else {
      toast.error("Speech recognition is not supported in your browser");
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      toast.error("Speech synthesis is not supported in your browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isListening]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        toast.success("Listening...");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast.error("Failed to start speech recognition");
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Process the transcript if it's not empty
    if (transcript.trim()) {
      addMessage(transcript, "user");
      processUserInput(transcript);
      setTranscript("");
    }
  };

  const addMessage = (text: string, sender: "user" | "assistant") => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        text: "Hello! I'm your voice assistant. How can I help you today?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
    setCurrentOrder([]);
  };

  const handleSendMessage = () => {
    if (transcript.trim()) {
      addMessage(transcript, "user");
      processUserInput(transcript);
      setTranscript("");
    }
  };

  const processUserInput = (input: string) => {
    setIsLoading(true);
    const normalizedInput = input.toLowerCase();
    
    // Simulate AI processing with a timeout
    setTimeout(() => {
      let response = "";

      // Menu query handling
      if (normalizedInput.includes("what's on the menu") || normalizedInput.includes("show menu") || normalizedInput.includes("what do you have")) {
        const categories = [...new Set(menuItems.map(item => item.category))];
        response = `Our menu includes: ${categories.join(", ")}. Would you like to hear about specific items in any category?`;
      }
      // Category specific queries
      else if (normalizedInput.includes("appetizer") || normalizedInput.includes("starter")) {
        const appetizers = menuItems.filter(item => item.category.toLowerCase().includes("appetizer"));
        if (appetizers.length > 0) {
          response = `Our appetizers include: ${appetizers.map(a => a.name).join(", ")}. Would you like to order any of these?`;
        } else {
          response = "I couldn't find any appetizers on our menu at the moment.";
        }
      }
      // Order processing
      else if (normalizedInput.includes("order") || normalizedInput.includes("i want") || normalizedInput.includes("i'd like")) {
        // Simple order processing logic
        const itemMatches = menuItems.filter(item => 
          normalizedInput.toLowerCase().includes(item.name.toLowerCase())
        );
        
        if (itemMatches.length > 0) {
          const newItems = itemMatches.map(item => ({
            name: item.name,
            quantity: 1,
          }));
          
          setCurrentOrder(prev => [...prev, ...newItems]);
          
          response = `I've added ${itemMatches.map(i => i.name).join(", ")} to your order. Would you like anything else?`;
        } else {
          response = "I didn't catch which item you'd like to order. Could you please specify the dish name?";
        }
      }
      // Restaurant information
      else if (normalizedInput.includes("hour") || normalizedInput.includes("open") || normalizedInput.includes("close")) {
        response = "Our restaurant is open from 11:00 AM to 10:00 PM Monday through Thursday, and 11:00 AM to 11:00 PM Friday through Sunday.";
      }
      // Reservation queries
      else if (normalizedInput.includes("reservation") || normalizedInput.includes("book a table") || normalizedInput.includes("reserve")) {
        response = "I can help you make a reservation. Could you please specify the date, time, and number of guests?";
      }
      // Help queries
      else if (normalizedInput.includes("help") || normalizedInput.includes("what can you do") || normalizedInput.includes("how does this work")) {
        response = "I can help you with viewing our menu, placing orders, checking restaurant hours, making reservations, and answering general questions about our restaurant. Just ask what you'd like to know!";
      }
      // Current order status
      else if (normalizedInput.includes("my order") || normalizedInput.includes("what did i order") || normalizedInput.includes("show order")) {
        if (currentOrder.length > 0) {
          response = `Your current order includes: ${currentOrder.map(item => `${item.quantity} ${item.name}`).join(", ")}. Would you like to add anything else or proceed to checkout?`;
        } else {
          response = "You haven't added any items to your order yet. Would you like to see our menu?";
        }
      }
      // Checkout
      else if (normalizedInput.includes("checkout") || normalizedInput.includes("pay") || normalizedInput.includes("bill")) {
        if (currentOrder.length > 0) {
          response = "Great! Your order is ready for checkout. Would you like to pay now, or add it to your table's bill?";
        } else {
          response = "Your order is empty. Would you like to see our menu to add some items?";
        }
      }
      // Fallback
      else {
        response = "I'm not sure I understand. Could you please rephrase your question or request?";
      }

      addMessage(response, "assistant");
      speak(response);
      setIsLoading(false);
    }, 1000);
  };

  const submitOrder = () => {
    if (currentOrder.length === 0) {
      toast.error("Your order is empty");
      return;
    }

    toast.success("Order submitted successfully!");
    addMessage("Your order has been submitted. Thank you!", "assistant");
    speak("Your order has been submitted. Thank you!");
    setCurrentOrder([]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b py-4 px-6 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Voice Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearChat}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear Chat
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-4 h-full overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p>{message.text}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-secondary animate-pulse">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="mt-4 flex items-end gap-2">
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Say something or type your message..."
              className="resize-none"
              rows={2}
            />
            <div className="flex flex-col gap-2">
              <Button
                variant={isListening ? "destructive" : "default"}
                size="icon"
                onClick={toggleListening}
                className="rounded-full h-10 w-10"
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleSendMessage}
                className="rounded-full h-10 w-10"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {isSpeaking && (
            <div className="mt-2 flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={stopSpeaking}
                className="flex items-center gap-1"
              >
                <VolumeX className="h-4 w-4" />
                Stop Speaking
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <Card className="w-80 h-full flex flex-col border-t-0 border-r-0 border-b-0 rounded-none">
          <CardHeader>
            <CardTitle>Current Order</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {currentOrder.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Your order is empty.</p>
                <p className="text-sm mt-2">
                  Try saying "I want to order..." or "Add [dish name] to my order."
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentOrder.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.quantity}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          setCurrentOrder(currentOrder.filter((_, i) => i !== index));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex flex-col gap-2">
            <div className="w-full flex justify-between text-sm mb-2">
              <span>Total Items:</span>
              <span>{currentOrder.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <Button
              className="w-full"
              disabled={currentOrder.length === 0}
              onClick={submitOrder}
            >
              Submit Order
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/pos")}
            >
              Go to POS
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VoiceAssistant;
