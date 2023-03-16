$(document).ready(function() {
  const messageContainer = $("#message-container");
  const inputMessage = $("#input-message");
  const sendBtn = $("#send-btn");
  const loadingContainer = document.querySelector(".loading-container");

  function showLoading() {
    loadingContainer.style.display = "flex";
  }
  
  function hideLoading() {
    loadingContainer.style.display = "none";
  }
  
  
  function sendMessage() {
    const apiKey = $("#api-key").val().trim();
    const message = inputMessage.val().trim();
    if (!apiKey) {
      alert('Missing api-key!')
      return false
    }
    if (message) {
      const messageEle = $("<div></div>").text(`Me: ${message}`);
      messageEle.addClass("message");
      messageEle.addClass("sent");
      messageEle.addClass("user");
      messageEle.appendTo(messageContainer);
      inputMessage.val("");
      messageContainer.scrollTop(messageContainer[0].scrollHeight);

      showLoading();

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}` // Set OpenAPI key as a header
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{"role": "user", "content": message}]
        })
      };

      fetch("https://api.openai.com/v1/chat/completions", requestOptions)
      .then(response => response.json())
      .then(data => {
        hideLoading();

        console.log(data);

        const content = data.choices[0].message.content;
        const messageEle = $("<div></div>").addClass("message").addClass("response");

        if (content.startsWith("```") && content.endsWith("```")) {
          messageEle.append($("<pre></pre>").text(`GPT: ${content}`));
        } else {
          messageEle.text(`GPT: ${content}`);
        }

        if (data.choices[0].sender === "user") {
          messageEle.addClass("user");
        } else {
          messageEle.addClass("response");
        }

        messageEle.appendTo(messageContainer);
        // messageContainer.scrollTop(messageContainer[0].scrollHeight);
      })
      .catch(error => {
        hideLoading();
        console.log(error)
      });
    }
  }

  sendBtn.on("click", sendMessage);
  
  // inputMessage.on("keyup", function(event) {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     sendBtn.trigger("click");
  //   }
  // });
});
  
