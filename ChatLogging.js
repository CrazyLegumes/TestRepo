var chat = document.querySelector("#chat>ul")
const defaultSanitizer = new Sanitizer();

const broadcasterURL = "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2"

//---------------------------------------------------------------------------------------------------

function getMessageHTML(message, emotes) {
  console.log("we're here");
  console.log(emotes);
  if (!emotes){ 
    console.log("ereoreafklasd");
    return message;
  }

  // store all emote keywords
  // ! you have to first scan through 
  // the message string and replace later
  const stringReplacements = [];
  console.log("it died?");

  // iterate of emotes to access ids and positions
  Object.entries(emotes).forEach(([id, positions]) => {
    // use only the first position to find out the emote key word
    const position = positions[0];
    const [start, end] = position.split("-");
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    console.log(stringToReplace);
    
    if(id.includes("emotesv2")){
      console.log("replacing thing");
      stringReplacements.push({
        stringToReplace: stringToReplace,
        replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0">`,
      });
    } else {
      stringReplacements.push({
        stringToReplace: stringToReplace,
        replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/2.0">`,
      });
    }
  });

  // generate HTML and replace all emote keywords with image elements
  const messageHTML = stringReplacements.reduce(
    (acc, { stringToReplace, replacement }) => {
      // obs browser doesn't seam to know about replaceAll
      return acc.split(stringToReplace).join(replacement);
    },
    message
  );

  return messageHTML;
}

//---------------------------------------------------------------------------------------------------

ComfyJS.onChat = (user, message, flags, self, extra) => {
  var newMessage = document.createElement("li");
  newMessage.setAttribute("class", "chatItem");

  if(extra.messageEmotes){
    console.log(extra.messageEmotes);
    message = getMessageHTML(message, extra.messageEmotes);
  }

  var nameLineDiv = document.createElement("div");
  nameLineDiv.setAttribute("class", "nameLine");

  var nameAndBadges = document.createElement("span");
  nameAndBadges.setAttribute("class", "badgeWithName");

  var badgeSpan = document.createElement("span");
  badgeSpan.setAttribute("class", "badges");

  if(flags.broadcaster) {
    var broadcasterBadge = document.createElement("img");
    broadcasterBadge.setAttribute("src", broadcasterURL);
    broadcasterBadge.setAttribute("class", "badge");
    nameAndBadges.append(broadcasterBadge);
  }

  var sparkleIcon = document.createElement("img");
  sparkleIcon.setAttribute("class", "sparkle");
  sparkleIcon.setAttribute("src", "https://cdn.discordapp.com/attachments/826340876917276682/848526297747161098/Sparkle_animation_2.gif");

  var userString = document.createElement("span");
  userString.setAttribute("class", "name");
  userString.innerText = user;

  nameLineDiv.append(sparkleIcon);
  nameAndBadges.append(userString);

  nameLineDiv.append(nameAndBadges);

  var messageLineDiv = document.createElement("div");
  messageLineDiv.setAttribute("class", "messageLine");

  var text = document.createElement("span");
  text.setAttribute("class", "message");
  text.innerHTML = message;

  messageLineDiv.append(text);

  newMessage.append(nameLineDiv);
  newMessage.append(messageLineDiv);

  chat.append(newMessage);
}

ComfyJS.Init("CrazyLegumes");