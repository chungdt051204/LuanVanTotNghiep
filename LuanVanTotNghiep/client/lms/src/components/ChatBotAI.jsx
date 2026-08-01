import { useState } from "react";
import { aiService } from "../services/aiService";
import chatbotAI from "../assets/ChatBotAI.png";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import loadingIcon from "../assets/three-dots.gif";
import { FiSend } from "react-icons/fi";
const ChatBotAI = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isDropdown, setIsDropdown] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSended, setIsSended] = useState(false);
  const handleSendMessage = async () => {
    setIsLoading(true);
    setIsSended(true);
    setMessages((prev) => [...prev, { message: input, sender: "user" }]);
    try {
      const result = await aiService.sendMessage({ input });
      console.log(result.data);
      setMessages((prev) => [
        ...prev,
        { message: result.data, sender: "chatbot-ai" },
      ]);
      setIsSended(false);
      setInput("");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <button
        onClick={() => setIsClicked((prev) => !prev)}
        className="fixed bottom-5 right-5 p-2 bg-blue-500 text-white rounded-[16px]"
      >
        Chatbot AI
      </button>
      {isClicked && (
        <div className="fixed bottom-20 right-5 bg-surface-white w-[380px] rounded-[16px] shadow-md">
          <div className="p-4 bg-blue-500 h-[80px] rounded-t-[16px]">
            <div className="flex justify-between items-start">
              <div className="flex gap-x-4">
                <div className="rounded-[1000px] p-2 bg-blue-200">
                  <img
                    src={chatbotAI}
                    alt=""
                    width={30}
                    height={30}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col text-surface-white">
                  <p className="text-title-sm font-medium">ChatBot AI</p>
                  <p className="text-body-md">
                    Trợ lý học lập trình trực tuyến
                  </p>
                </div>
              </div>
              <div className="flex gap-x-2 text-title-sm text-surface-white">
                <button onClick={() => setIsDropdown((prev) => !prev)}>
                  {isDropdown ? <FaAngleDown /> : <FaAngleUp />}
                </button>
                <button onClick={() => setIsClicked(false)}>X</button>
              </div>
            </div>
          </div>
          {isDropdown && (
            <div>
              <div className="h-[280px] overflow-y-auto scroll-auto bg-gray-50 p-4">
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-4 items-start">
                    <div className="rounded-[1000px] p-2 bg-blue-200">
                      <img
                        src={chatbotAI}
                        alt=""
                        width={20}
                        height={20}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-y-2 bg-surface-white rounded-[16px] w-[80%] p-4 shadow-md text-body-md">
                      <p>
                        Xin chào! Tôi là ChatBot AI, trợ lý học lập trình của
                        bạn.
                      </p>
                      <p>
                        Tôi có thể giúp bạn tìm khóa học phù hợp, giải thích
                        kiến thức lập trình, hoặc hỗ trợ theo dõi tiến độ học
                        tập.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4 mt-6">
                    {messages?.map((value, index) => {
                      return (
                        <div
                          key={index}
                          className={`flex ${
                            value.sender == "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div className="flex gap-x-4 items-start">
                            {value.sender == "chatbot-ai" && (
                              <div className="rounded-[1000px] p-2 bg-blue-200">
                                <img
                                  src={chatbotAI}
                                  alt=""
                                  width={20}
                                  height={20}
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div
                              className={`py-2 px-4 ${
                                value.sender == "user"
                                  ? "bg-blue-500 text-surface-white"
                                  : "bg-surface-white text-surface-nav"
                              } rounded-[16px] text-body-md shadow-md`}
                            >
                              {value.message}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {isSended && isLoading && (
                    <div className="flex gap-x-4 items-start">
                      <div className="rounded-[1000px] p-2 bg-blue-200">
                        <img
                          src={chatbotAI}
                          alt=""
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      </div>
                      <div className="py-2 px-4 bg-surface-white rounded-[16px] shadow-md">
                        <img src={loadingIcon} alt="" width={30} height={30} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-surface-white h-[60px] rounded-b-[16px] border-t-gray-100 px-4 py-2">
                <div className="flex gap-x-4 items-center">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="px-4 py-2 text-title-sm text-surface-nav rounded-[16px] w-[80%] border border-gray-200 bg-gray-50 outline-none"
                    type="text"
                    placeholder="Nhập câu hỏi..."
                  />
                  <div
                    onClick={handleSendMessage}
                    className={`p-2 rounded-[12px] bg-blue-500 hover:cursor-pointer ${
                      !input ? "opacity-50" : "hover:opacity-90"
                    }`}
                  >
                    <FiSend className="text-headline-sm text-surface-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default ChatBotAI;
