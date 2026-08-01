// ==UserScript==
// @name         ChatRemielle
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Remielle Assistant Assistant for ChatGPT - Fixed Logic
// @author       You
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  // ===== GIF Config =====
  const GIF = {
    idle: "https://i.redd.it/au55355np1eh1.gif",
    typing: "https://i.redd.it/ne2x955np1eh1.gif",
    thinking: "https://i.redd.it/7p6ep65np1eh1.gif",
    answering: "https://i.redd.it/qfptp65np1eh1.gif",
    done: "https://i.redd.it/z4vvh65np1eh1.gif",
  };

  // ===== CSS =====
  const style = document.createElement("style");
  style.textContent = `
        #remielle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 220px;
            z-index: 999999999;
            user-select: none;
            pointer-events: none;
            transition: opacity 0.2s;
        }
    `;
  document.head.appendChild(style);

  // ===== Image Element =====
  const img = document.createElement("img");
  img.id = "remielle";
  img.src = GIF.idle;
  document.body.appendChild(img);

  // ===== State Management =====
  let currentState = "idle";
  let isGenerating = false; // Cờ đánh dấu Bot đang trả lời

  // Các bộ đếm thời gian riêng biệt
  let userTypingTimer = null; // Timer cho người dùng gõ
  let botAnsweringTimer = null; // Timer chờ Bot gõ xong
  let backToIdleTimer = null; // Timer chuyển từ DONE về IDLE

  function setState(state) {
    if (currentState === state) return;
    currentState = state;
    img.src = GIF[state];
    console.log("[Remielle State]:", state);
  }

  // ===== Hàm tiện ích để dọn dẹp timer =====
  function clearAllTimers() {
    clearTimeout(userTypingTimer);
    clearTimeout(botAnsweringTimer);
    clearTimeout(backToIdleTimer);
  }

  // ===== HÀNH VI NGƯỜI DÙNG GÕ (Event Delegation) =====

  // 1. Khi người dùng nhập liệu
  document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "prompt-textarea") {
      // Nếu bot đang trả lời hoặc đang thinking, không hiện gif typing
      if (isGenerating || currentState === "thinking") return;

      setState("typing");

      clearTimeout(userTypingTimer);
      userTypingTimer = setTimeout(() => {
        // Nếu sau 1s không gõ nữa và vẫn đang ở state typing, quay về idle
        if (currentState === "typing") {
          setState("idle");
        }
      }, 1000);
    }
  });

  // 2. Khi người dùng nhấn phím gửi (Enter)
  document.addEventListener("keydown", (e) => {
    if (e.target && e.target.id === "prompt-textarea") {
      // Kiểm tra Enter không giữ Shift & Không đang gõ Tiếng Việt (IME)
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        // Chỉ trigger nếu ô nhập có nội dung
        if (e.target.innerText.trim() !== "") {
          triggerThinkingState();
        }
      }
    }
  });

  // 3. Khi người dùng click chuột vào nút Gửi
  document.addEventListener("click", (e) => {
    // Tìm nút send gần nhất (ChatGPT dùng SVG bên trong button)
    const sendBtn = e.target.closest('button[data-testid="send-button"]');
    if (sendBtn) {
      // Kiểm tra xem ô input có text không trước khi trigger
      const input = document.getElementById("prompt-textarea");
      if (input && input.innerText.trim() !== "") {
        triggerThinkingState();
      }
    }
  });

  // Hàm chuyển sang trạng thái Thinking
  function triggerThinkingState() {
    if (isGenerating) return; // Nếu đang trả lời thì thôi

    isGenerating = true; // Đánh dấu bot bắt đầu làm việc
    clearAllTimers(); // Xóa hết các đếm ngược của việc gõ trước đó
    setState("thinking");
  }

  // ===== HÀNH VI BOT TRẢ LỜI (Observe ChatGPT Response) =====
  function observeChatGPT() {
    let lastAssistantText = "";

    const observer = new MutationObserver(() => {
      // Tìm tất cả các tin nhắn của Bot
      const assistants = document.querySelectorAll(
        '[data-message-author-role="assistant"]'
      );
      if (!assistants.length) return;

      const lastAssistant = assistants[assistants.length - 1];
      // Lấy text hiện tại, xóa khoảng trắng thừa
      const currentText = lastAssistant.innerText.trim();

      // SỬA LỖI 1: Nếu nội dung Bot thay đổi (Bot đang stream text)
      if (currentText !== lastAssistantText) {
        lastAssistantText = currentText;

        // Nếu Bot đang thực sự gõ (currentState có thể là thinking hoặc answering)
        if (isGenerating) {
          setState("answering");

          // Reset timer chờ phản hồi xong
          clearTimeout(botAnsweringTimer);

          // SỬA LỖI 2: Chờ một chút sau khi Bot ngừng stream text để xác nhận đã xong
          botAnsweringTimer = setTimeout(() => {
            // Kiểm tra xem nút Stop (nút vuông) còn tồn tại không
            const stopButton = document.querySelector(
              'button[data-testid="stop-button"]'
            );

            // Nếu Bot đang gõ VÀ không còn nút Stop => Đã trả lời xong
            if (currentState === "answering" && !stopButton) {
              checkIfBotFinished();
            }
          }, 800); // Chờ 800ms sau lần stream text cuối cùng
        }
      }
    });

    // Bắt đầu theo dõi sự thay đổi của DOM toàn trang
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }

  // Hàm kiểm tra và chuyển sang state DONE
  function checkIfBotFinished() {
    // Chỉ chuyển sang DONE nếu Bot thực sự đang trả lời
    if (currentState === "answering") {
      setState("done");
      isGenerating = false; // Bot đã làm xong việc

      // Chờ 2.5s rồi quay về Idle
      clearTimeout(backToIdleTimer);
      backToIdleTimer = setTimeout(() => {
        if (currentState === "done") {
          setState("idle");
        }
      }, 2500);
    }
  }

  // Khởi chạy Observer
  observeChatGPT();
})();
