import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const BACKEND_URL = "http://localhost:8000";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

// disable enter in textarea
window.addEventListener("load", () => {
  document.querySelector("textarea").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return false;
    }
  });
});

let loadInterval;

const loader = (element) => {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
};

const typeText = (element, text) => {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
};

const generateUniqueId = () => {
  const timestamp = Date.now();
  const hexaDecimalString = Math.random().toString(16);

  return `id-${timestamp}-${hexaDecimalString}`;
};

const chatStripe = (isAi, value, uniqueId) => {
  return `<div class='wrapper ${isAi && "ai"}'>
      <article class='chat'>
        <figure class='profile'>
          <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}" />
        </figure>
        <div class='message' id="${uniqueId}">${value}</div>
      </article>
    </div>`;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // user's chatStripe
  const formData = new FormData(form);
  chatContainer.innerHTML += chatStripe(false, formData.get("prompt"));
  form.reset();

  // bot's chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.get("prompt"),
      }),
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = "";

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();
      typeText(messageDiv, parsedData);
    } else {
      const err = await response.text();
      messageDiv.innerHTML = `Error in getting response: ${err}`;
    }
  } catch (err) {
    messageDiv.innerHTML = `Error in sending request: ${err.message}`;
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});
