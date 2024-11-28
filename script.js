// Lấy các phần tử cần thiết
const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');

// Hàm thêm tin nhắn vào giao diện
function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);

    // Tự động cuộn xuống cuối
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Hàm gửi yêu cầu tới backend
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Hiển thị tin nhắn của người dùng
    addMessage(userMessage, 'user');
    userInput.value = '';

    // Vô hiệu hóa nút gửi trong khi xử lý
    sendButton.disabled = true;

    try {
        const response = await fetch('/api', { // Gửi yêu cầu tới backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        addMessage(data.reply || 'Không nhận được phản hồi từ server.', 'bot');
    } catch (error) {
        console.error('Lỗi:', error);
        addMessage('Có lỗi xảy ra, vui lòng thử lại sau.', 'bot');
    } finally {
        sendButton.disabled = false;
    }
}

// Gửi tin nhắn khi nhấn nút hoặc Enter
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
