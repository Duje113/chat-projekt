const drone = new ScaleDrone("AZ7z8FlaczwkzUcB", {
  data: {
    name: getRandomName(),
  },
});
let currentUserID = null;

let members = [];

drone.on("open", (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("Successfully connected to Scaledrone");

  currentUserID = drone.clientId;

  const room = drone.subscribe("observable-room");
  room.on("open", (error) => {
    if (error) {
      return console.error(error);
    }
    console.log("Successfully joined room");
  });

  room.on("members", (m) => {
    members = m;
    updateMembersDOM();
  });

  room.on("member_join", (member) => {
    members.push(member);
    updateMembersDOM();
  });

  room.on("member_leave", ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on("data", (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
    }
  });
});

drone.on("close", (event) => {
  console.log("Connection was closed", event);
});

drone.on("error", (error) => {
  console.error(error);
});

function getRandomName() {
  const adjs = [
    "nice",
    "blue",
    "green",
    "red",
    "black",
    "smitten",
    "focused",
    "squirmy",
    "yellow",
    "pale",
    "dark",
    "happy",
    "sad",
    "ominous",
    "swollen",
    "bland",
    "viscous",
    "serendipitious",
    "silly",
    "angry",
    "amazing",
    "dire",
    "enormous",
    "hazy",
    "small",
    "jealous",
    "pristine",
    "moody",
    "gloomy",
    "swift",
    "warm",
    "icy",
    "smouldering",
    "vivacious",
    "handsome",
    "bright",
    "transparent",
    "gorgeous",
    "dangerous",
    "tricky",
    "lively",
    "smug",
    "sneaky",
    "shy",
    "spicy",
    "egregious",
    "royal",
    "manic",
  ];
  const nouns = [
    "hurricane",
    "river",
    "breeze",
    "moon",
    "rain",
    "wind",
    "sea",
    "morning",
    "snow",
    "lake",
    "sunset",
    "pine",
    "shadow",
    "leaf",
    "dawn",
    "glitter",
    "forest",
    "hill",
    "cloud",
    "meadow",
    "sun",
    "glade",
    "bird",
    "brook",
    "butterfly",
    "bush",
    "dew",
    "dust",
    "field",
    "fire",
    "flower",
    "firefly",
    "feather",
    "grass",
    "haze",
    "mountain",
    "night",
    "pond",
    "darkness",
    "snowflake",
    "silence",
    "sound",
    "sky",
    "shape",
    "surf",
    "thunder",
    "violet",
    "water",
    "wildflower",
    "wave",
    "water",
    "resonance",
    "sun",
    "wood",
    "dream",
    "cherry",
    "tree",
    "fog",
    "frost",
    "voice",
    "paper",
    "frog",
    "smoke",
    "star",
    "lizard",
  ];
  return (
    adjs[Math.floor(Math.random() * adjs.length)] +
    " " +
    nouns[Math.floor(Math.random() * nouns.length)]
  );
}

const DOM = {
  membersCount: document.querySelector(".members-count"),
  membersList: document.querySelector(".members-list"),
  messages: document.querySelector(".messages"),
  input: document.querySelector(".message-form__input"),
  form: document.querySelector(".message-form"),
};

DOM.form.addEventListener("submit", sendMessage);

function sendMessage() {
  const value = DOM.input.value;
  if (value === "") {
    return;
  }
  DOM.input.value = "";
  drone.publish({
    room: "observable-room",
    message: value,
  });
}

function createMemberElement(member) {
  const { name } = member.clientData;
  const el = document.createElement("div");
  el.appendChild(document.createTextNode(name));
  el.className = "member";
  return el;
}

function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} users in room:`;
  DOM.membersList.innerHTML = "";
  members.forEach((member) =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement("div");
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  if (member.id === currentUserID) {
    el.className = "message-left";
  } else {
    el.className = "message-right";
  }
  return el;
}

function addMessageToListDOM(text, member) {
  const el = DOM.messages;

  el.appendChild(createMessageElement(text, member));

  if (el.scrollTop < el.scrollHeight - el.clientHeight) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }

  return el;
}
