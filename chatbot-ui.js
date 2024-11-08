/*
Makes backend API call to rasa chatbot and display output to chatbot frontend
*/

function init() {

    //---------------------------- Including Jquery ------------------------------

    var script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    //--------------------------- Important Variables----------------------------
    botLogoPath = "https://jihuang-adobe.github.io/Chatbot-UI/imgs/bot-logo.png"

    //--------------------------- Chatbot Frontend -------------------------------
    const chatContainer = document.getElementById("chat-container");

    template = ` <button class='chat-btn'><img src = "https://jihuang-adobe.github.io/Chatbot-UI/icons/comment.png" class = "icon" ></button>

    <div class='chat-popup'>
    
		<div class='chat-header'>
			<div class='chatbot-img'>
				<img src='${botLogoPath}' alt='Chat Bot image' class='bot-img'> 
			</div>
			<h3 class='bot-title'>WKND Bot</h3>
			<button class = "expand-chat-window" ><img src="https://jihuang-adobe.github.io/Chatbot-UI/icons/open_fullscreen.png" class="icon" ></button>
		</div>

		<div class='chat-area'>
            <div class='bot-msg'>
                <img class='bot-img' src ='${botLogoPath}' />
				<span class='msg'>Hi, How can i help you?</span>
			</div>

            <!-- <div class='bot-msg'>
                <img class='bot-img' src ='${botLogoPath}' />
                <div class='response-btns'>
                    <button class='btn-primary' onclick= 'userResponseBtn(this)' value='/sign_in'>sample btn</button>            
                </div>
			</div> -->

			<!-- <div class='bot-msg'>
				<img class='msg-image' src = "https://i.imgur.com/nGF1K8f.jpg" />
			</div> -->

			<!-- <div class='user-msg'>
				<span class='msg'>Hi, How can i help you?</span>
			</div> -->
			

		</div>


		<div class='chat-input-area'>
			<input type='text' autofocus class='chat-input' onkeypress='return givenUserInput(event)' placeholder='Type a message ...' autocomplete='off'>
			<button class='chat-submit'><i class='material-icons'>send</i></button>
		</div>

	</div>`


    chatContainer.innerHTML = template;

    //--------------------------- Important Variables----------------------------
    var inactiveMessage = "Server is down, Please contact the developer to activate it"


    chatPopup = document.querySelector(".chat-popup")
    chatBtn = document.querySelector(".chat-btn")
    chatSubmit = document.querySelector(".chat-submit")
    chatHeader = document.querySelector(".chat-header")
    chatArea = document.querySelector(".chat-area")
    chatInput = document.querySelector(".chat-input")
    expandWindow = document.querySelector(".expand-chat-window")
    root = document.documentElement;
    chatPopup.style.display = "none"

    //------------------------ ChatBot Toggler -------------------------

    chatBtn.addEventListener("click", () => {

        mobileDevice = !detectMob()
        if (chatPopup.style.display == "none" && mobileDevice) {
            chatPopup.style.display = "flex"
            chatInput.focus();
            chatBtn.innerHTML = `<img src = "https://jihuang-adobe.github.io/Chatbot-UI/icons/close.png" class = "icon" >`
        } else if (mobileDevice) {
            chatPopup.style.display = "none"
            chatBtn.innerHTML = `<img src = "https://jihuang-adobe.github.io/Chatbot-UI/icons/comment.png" class = "icon" >`
        } else {
            mobileView()
        }
    })

    chatSubmit.addEventListener("click", () => {
        let userResponse = chatInput.value.trim();
        if (userResponse !== "") {
            setUserResponse();
            send(userResponse)
        }
    })

    expandWindow.addEventListener("click", (e) => {
        // console.log(expandWindow.innerHTML)
        if (expandWindow.innerHTML == '<img src="https://jihuang-adobe.github.io/Chatbot-UI/icons/open_fullscreen.png" class="icon">') {
            expandWindow.innerHTML = `<img src = "https://jihuang-adobe.github.io/Chatbot-UI/icons/close_fullscreen.png" class = 'icon'>`
            root.style.setProperty('--chat-window-height', 80 + "%");
            root.style.setProperty('--chat-window-total-width', 85 + "%");
        } else if (expandWindow.innerHTML == '<img src="https://jihuang-adobe.github.io/Chatbot-UI/icons/close.png" class="icon">') {
            chatPopup.style.display = "none"
            chatBtn.style.display = "block"
        } else {
            expandWindow.innerHTML = `<img src = "https://jihuang-adobe.github.io/Chatbot-UI/icons/open_fullscreen.png" class = "icon" >`
            root.style.setProperty('--chat-window-height', 500 + "px");
            root.style.setProperty('--chat-window-total-width', 380 + "px");
        }

    })
}

// end of init function

var passwordInput = false;

function userResponseBtn(e) {
    send(e.value);
}

// to submit user input when he presses enter
function givenUserInput(e) {
    if (e.keyCode == 13) {
        let userResponse = chatInput.value.trim();
        if (userResponse !== "") {
            setUserResponse()
            send(userResponse)
        }
    }
}

// to display user message on UI
function setUserResponse() {
    let userInput = chatInput.value;
    if (passwordInput) {
        userInput = "******"
    }
    if (userInput) {
        let temp = `<div class="user-msg"><span class = "msg">${userInput}</span></div>`
        chatArea.innerHTML += temp;
        chatInput.value = ""
    } else {
        chatInput.disabled = false;
    }
    scrollToBottomOfResults();
}

function scrollToBottomOfResults() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

/***************************************************************
Frontend Part Completed
****************************************************************/

// host = 'http://localhost:5005/webhooks/rest/webhook'
async function send(message) {
    chatInput.type = "text"
    passwordInput = false;
    chatInput.focus();
    console.log("User Message:", message);
    
    const request = {
        "payload": {
            "message": message,
            "seedtext": allAdventuresJson
        }
    };
    
    const res = await fetch(host, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-OW-EXTRA-LOGGING": "on"
        },
        body: JSON.stringify(request)
    });

    const resJson = await res.json();

    setBotResponse([{"text":resJson.choices[0].message.content}]);

    chatInput.focus();
}


//------------------------------------ Set bot response -------------------------------------
function setBotResponse(val) {
    setTimeout(function() {
        if (val.length < 1) {
            //if there is no response from Rasa
            // msg = 'I couldn\'t get that. Let\' try something else!';
            msg = inactiveMessage;

            var BotResponse = `<div class='bot-msg'><img class='bot-img' src ='${botLogoPath}' /><span class='msg'> ${msg} </span></div>`;
            $(BotResponse).appendTo('.chat-area').hide().fadeIn(1000);
            scrollToBottomOfResults();
            chatInput.focus();

        } else {
            //if we get response from Rasa
            for (i = 0; i < val.length; i++) {
                //check if there is text message
                console.log(BotResponse);
                if (val[i].hasOwnProperty("text")) {
                    const botMsg = val[i].text.replaceAll('\n', '<br />');
                    if (botMsg.includes("password")) {
                        chatInput.type = "password";
                        passwordInput = true;
                    }
                    var BotResponse = `<div class='bot-msg'><img class='bot-img' src ='${botLogoPath}' /><span class='msg'>${botMsg}</span></div>`;
                    $(BotResponse).appendTo('.chat-area').hide().fadeIn(1000);
                }

                //check if there is image
                if (val[i].hasOwnProperty("image")) {
                    var BotResponse = "<div class='bot-msg'>" + "<img class='bot-img' src ='${botLogoPath}' />"
                    '<img class="msg-image" src="' + val[i].image + '">' +
                        '</div>'
                    $(BotResponse).appendTo('.chat-area').hide().fadeIn(1000);
                }

                //check if there are buttons
                if (val[i].hasOwnProperty("buttons")) {
                    var BotResponse = `<div class='bot-msg'><img class='bot-img' src ='${botLogoPath}' /><div class='response-btns'>`

                    buttonsArray = val[i].buttons;
                    buttonsArray.forEach(btn => {
                        BotResponse += `<button class='btn-primary' onclick= 'userResponseBtn(this)' value='${btn.payload}'>${btn.title}</button>`
                    })

                    BotResponse += "</div></div>"

                    $(BotResponse).appendTo('.chat-area').hide().fadeIn(1000);
                    chatInput.disabled = true;
                }

            }
            scrollToBottomOfResults();
            chatInput.disabled = false;
            chatInput.focus();
        }

    }, 500);
}

function mobileView() {
    $('.chat-popup').width($(window).width());

    if (chatPopup.style.display == "none") {
        chatPopup.style.display = "flex"
            // chatInput.focus();
        chatBtn.style.display = "none"
        chatPopup.style.bottom = "0"
        chatPopup.style.right = "0"
            // chatPopup.style.transition = "none"
        expandWindow.innerHTML = `<img src = "https://jihuang-adobe.github.io/Chatbot-UI/icons/close.png" class = "icon" >`
    }
}

function detectMob() {
    return ((window.innerHeight <= 800) && (window.innerWidth <= 600));
}

function chatbotTheme(theme) {
    const gradientHeader = document.querySelector(".chat-header");
    const orange = {
        color: "#FBAB7E",
        background: "linear-gradient(19deg, #FBAB7E 0%, #F7CE68 100%)"
    }

    const purple = {
        color: "#B721FF",
        background: "linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)"
    }

    const dark = {
        color: "#5C5C5C",
        background: "linear-gradient(19deg, #5C5C5C 0%, #5C5C5C 100%)"
    }

    if (theme === "orange") {
        root.style.setProperty('--chat-window-color-theme', orange.color);
        gradientHeader.style.backgroundImage = orange.background;
        chatSubmit.style.backgroundColor = orange.color;
    } else if (theme === "purple") {
        root.style.setProperty('--chat-window-color-theme', purple.color);
        gradientHeader.style.backgroundImage = purple.background;
        chatSubmit.style.backgroundColor = purple.color;
    } else if (theme === "dark") {
        root.style.setProperty('--chat-window-color-theme', dark.color);
        gradientHeader.style.backgroundImage = dark.background;
        chatSubmit.style.backgroundColor = dark.color;
    }
}

function createChatBot(hostURL, botLogo, title, welcomeMessage, inactiveMsg, theme = "blue") {
    this.host = hostURL;
    botLogoPath = botLogo;
    inactiveMessage = inactiveMsg;
    init();
    const msg = document.querySelector(".msg");
    msg.innerText = welcomeMessage;

    const botTitle = document.querySelector(".bot-title");
    botTitle.innerText = title;

    initAllAdventures();

    chatbotTheme(theme)
}

async function initAllAdventures() {
    this.allAdventuresJson = {
        "data": {
            "adventureList": {
                "items": [
                    {
                        "title": "7 day Bermuda Cruise",
                        "activity": "Surfing",
                        "price": 519.0,
                        "tripLength": "7 Days",
                        "description": {
                            "plaintext": "Kick back amidst the sun-kissed pleasures of a pink-sand paradise on Carnival cruises to King’s Wharf. This British overseas territory of Bermuda has a rich naval heritage… plus powdery beaches fringed in coconut palms. Located at the very tip of Bermuda’s glittering archipelago of over 100 islets and cays, King’s Wharf was made for lounging in the Gulf Stream’s balmy subtropical clime, which meanders between Bermuda and mainland North America."
                        }
                    },
                    {
                        "title": "Bali Surf Camp",
                        "activity": "Surfing",
                        "price": 5000.0,
                        "tripLength": "6 Days",
                        "description": {
                            "plaintext": "Surfing in Bali is on the bucket list of every surfer - whether you're a beginner or someone who's been surfing for decades, there will be a break to cater to your ability. Bali offers warm water, tropical vibes, awesome breaks and low cost expenses.\n\nLooking for a low cost alternative? Checkout Surf Camp Costa Rica"
                        }
                    },
                    {
                        "title": "Beervana in Portland",
                        "activity": "Social",
                        "price": 300.0,
                        "tripLength": "1 Day",
                        "description": {
                            "plaintext": "Experience the best craft breweries in the Pacific Northwest.\n\nPortland is often referred to as Beervana, and it’s easy to understand why once you get a sip of their delicious ales.  This adventure will provide insider access to spectacular local breweries that define the taste and experience of Oregon beer culture and tradition.   Our Brewery Tour takes you on a beer tasting adventure in hip and trendy Pearl District through Historic Old Town District in Portland, Oregon. Experience Portland’s vibrant history while you sample the best brews the city has to offer.\n\nLooking for an overseas adventure? Checkout this amazing foodie experience: Gastronomic Marais Tour"
                        }
                    },
                    {
                        "title": "Climbing New Zealand",
                        "activity": "Rock Climbing",
                        "price": 900.0,
                        "tripLength": "2 Days",
                        "description": {
                            "plaintext": "Let us take you on a spectacular climbing experience unique to New Zealand\n\nFeel the raw adventure and excitement of our guided rock climbing experience. Reach new heights under our professional instruction and feel your body and mind work together in harmony. Come join us for a guided rock climbing adventure in the mountains that trained Sir Edmund Hilary. Whether it is your first time thinking of putting on climbing shoes or you are an old hand looking for some new challenges, our guides can make your climbing adventure a trip you won’t soon forget. New Zealand has countless climbing routes to choose from and is known as one of the premiere climbing destinations in the world. With so many different routes and areas to choose from our guides can tailor each trip to your exact specifications. Let us help you make your New Zealand climbing vacation a memory you will cherish forever!\n\nRelated trips:\n\nColorado Rock Climbing\n\nYosemite Backpacking \n\n"
                        }
                    },
                    {
                        "title": "Overnight Colorado Rock Climbing",
                        "activity": "Rock Climbing",
                        "price": 1000.0,
                        "tripLength": "3 Days",
                        "description": {
                            "plaintext": "With all of Colorado's beautiful peaks, rock formations and gorgeous mountain views, it's not hard for rock climbers to find a little slice of climbing paradise nearly everywhere they go. On this tour we'll take you to the top parks in Colorado so you can experience the diverse climbing landscape that has made Colorado a goto destination for rock climbers from around the world."
                        }
                    },
                    {
                        "title": "Cycling Southern Utah",
                        "activity": "Cycling",
                        "price": 3000.0,
                        "tripLength": "5 Days",
                        "description": {
                            "plaintext": "Join us as we explore the rugged, stunningly gorgeous landscape of southern Utah. Touch your soul as we ride through red rock canyons and sandstone cliffs in Bryce Canyon and Zion National Park, two of Utah's iconic national parks. These parks provide a stunning backdrop for a once in a lifetime cycling vacation."
                        }
                    },
                    {
                        "title": "Cycling Tuscany",
                        "activity": "Cycling",
                        "price": 4500.0,
                        "tripLength": "4 Days",
                        "description": {
                            "plaintext": "Experience Tuscany by Bicycle\n\nVisiting Tuscany on a bicycle is about experiencing the old world charm of Italy on your own terms. Your efforts on the climbs of Italy's rolling hills during this tour will be rewarded with sunny Mediterranean landscapes and unmatched Italian hospitality.  Tuscany’s natural wonders have always been a well of inspiration for arts and culture. Find out why as you explore the Italian countryside and coastline on bicycle."
                        }
                    },
                    {
                        "title": "Downhill Skiing in Jackson Hole, Wyoming",
                        "activity": "Skiing",
                        "price": 400.0,
                        "tripLength": "2-3 days",
                        "description": {
                            "plaintext": "Experience wild untamed, rolling, wide-open terrain of Wyoming in the winter.\n\n\nThe spectacular Tetons of Wyoming provide a wonderous backdrop for your Jackson Hole ski vacation.  Jackson Hole is unlike anywhere else in the US.  A skiers paradise far from crowds and close to nature with terrain so vast it appears uncharted.  With 2,500 acres of legendary terrain, unmatched levels of snowfall each winter, and unparalleled backcountry access, Jackson Hole offers a truly unique skiing experience."
                        }
                    },
                    {
                        "title": "Gastronomic Marais Tour",
                        "activity": "Social",
                        "price": 95.0,
                        "tripLength": "1 Day",
                        "description": {
                            "plaintext": "Take a VIP gastronomic tour through the vibrant Marais, one of the oldest, colorful and historical areas of Paris. Our Marais expert, Marie Bernard will take food lovers to the top food shops, patisseries and chocolate shops as you take in Marais' unique atmosphere."
                        }
                    },
                    {
                        "title": "Gastronomic Marais Tour",
                        "activity": "Social",
                        "price": 95.0,
                        "tripLength": "1 Day",
                        "description": {
                            "plaintext": "Take a VIP gastronomic tour through the vibrant Marais, one of the oldest, colorful and historical areas of Paris. Our Marais expert, Marie Bernard will take food lovers to the top food shops, patisseries and chocolate shops as you take in Marais' unique atmosphere."
                        }
                    },
                    {
                        "title": "Napa Wine Tasting",
                        "activity": "Social",
                        "price": 152.59,
                        "tripLength": "1 Day",
                        "description": {
                            "plaintext": "Enjoy spectacular wine tasting in the Napa Valley\n\nNapa Valley is one of the most famous wine regions in the world. Located an hour north of San Francisco, Napa is renowned for their wine, pleasant temperatures and world class restaurants. This tasting will provide insider access to spectacular wineries and restaurants in Yountville, Calistoga and St. Helena."
                        }
                    },
                    {
                        "title": "UPS Vacation",
                        "activity": "Social",
                        "price": 1.0,
                        "tripLength": "1 Day",
                        "description": {
                            "plaintext": "delivery person is getting ready for a much-needed vacation. After a long tiring year of hard work, they are looking forward to some rest and relaxation. The person is eager to take a break away from their usual routine and explore the world with a few close friends. During their vacation, they plan to visit different places and do activities they have never done before. They will also have plenty of time for rest and relaxation. This vacation is an excellent opportunity for them to kick back and recharge their batteries so they can come back feeling energized and ready for a new year of work."
                        }
                    },
                    {
                        "title": "Riverside Camping Australia",
                        "activity": "Camping",
                        "price": 500.0,
                        "tripLength": "3 Days",
                        "description": {
                            "plaintext": "Riverside camping in Australia offers a unique and immersive experience, combining the country’s stunning natural beauty with tranquil outdoor relaxation. Whether along the Murray River, the Snowy River, or one of the many other watercourses, camping by an Australian river provides a chance to connect with nature and enjoy a variety of outdoor activities.\n\nThe rivers in Australia often cut through scenic landscapes, ranging from rolling hills and bushland to dense forests and rugged outback settings. Many campsites are nestled right along the water, giving campers easy access to swimming, kayaking, and fishing. The peaceful sounds of flowing water create a calming ambiance, perfect for unwinding around a campfire at night. Wildlife is abundant, with birds, kangaroos, and sometimes even koalas making an appearance, adding to the allure of the Australian bush."
                        }
                    },
                    {
                        "title": "Ski Touring Mont Blanc",
                        "activity": "Skiing",
                        "price": 2600.0,
                        "tripLength": "5 Days",
                        "description": {
                            "plaintext": "If you’re a slopes enthusiast, you know that one run in the backcountry is worth ten in the front country. This adventure includes 5 days of ski touring topped off with the ascent of Mont Blanc, the highest point in Western Europe. An acclimatization phase of the trip will prepare the team physically and mentally for a two-day summit attempt.  During this phase, some of the classic routes around Chamonix will be explored. The final two days we’ll take the summit of Mont Blanc via the Arete Royal and Dome Du Goute."
                        }
                    },
                    {
                        "title": "Surf Camp in Costa Rica",
                        "activity": "Surfing",
                        "price": 3400.0,
                        "tripLength": "5 Days",
                        "description": {
                            "plaintext": "Experience Surfer's Paradise in Costa Rica\n\nExperienced local surf guides will take care of all the logistics and find the best spots for you to experience the best surfing Costa Rica has to offer. If you are a novice, we can take you to the right spot for your skill and preference.  Costa Rica is the ideal location for a first surf trip. It is a safe place to travel and the locals are quite friendly and happy to see other surfers. Costa Rica is home to some incredible waves like Witch’s Rock, Ollies Point, Pavones, Playa Negra, Playa Hermosa, Salsa Brava and tons of lesser known world class waves."
                        }
                    },
                    {
                        "title": "Tahoe Skiing",
                        "activity": "Skiing",
                        "price": 1500.0,
                        "tripLength": "3-4 days",
                        "description": {
                            "plaintext": "Great weather, crystal clear lake water, and a relaxed California attitude make Lake Tahoe one of the most desirable ski destinations in the world. Few ski areas rival Lake Tahoe for its excellent snow conditions, challenging terrain and state-of-the-art lift chairs. Lake Tahoe is home to dozens of resorts and we'll be your guide for the best of them."
                        }
                    },
                    {
                        "title": "West Coast Cycling",
                        "activity": "Cycling",
                        "price": 4500.0,
                        "tripLength": "5 days",
                        "description": {
                            "plaintext": "Join us for this once in a lifetime bike trip traveling from San Francisco to Portland cycling along the Pacific Coast. Experience world class terrain as we head north through redwood forests, state parks, the Columbia river and the Pacific ocean."
                        }
                    },
                    {
                        "title": "Whistler Mountain Biking Adventure with Jian",
                        "activity": "Cycling",
                        "price": 1500.0,
                        "tripLength": "2 Days",
                        "description": {
                            "plaintext": "Explore Whistler's Epic Singletrack Trails\n\nWhistler is often considered North America’s preeminent mountain bike destination.  Let us show you why Whistler has earned that designation by guiding you through the hidden spider web of the most epic single-track you've ever conquered. Our tours are primarily for hardcore moutain biking enthusiasts but can be specialized to the interests and abilities of each group. Ride fast rolling trails or attempt some of the world famous logs and ladders."
                        }
                    },
                    {
                        "title": "Yosemite Backpacking",
                        "activity": "Camping",
                        "price": 1500.0,
                        "tripLength": "5 Days",
                        "description": {
                            "plaintext": "Yosemite National Park, designated a World Heritage Site in 1984, is best known for its granite cliffs, waterfalls and giant sequoias, but within its nearly 1,200 square miles, you can find deep valleys, grand meadows, glaciers and lakes. The majority of visitors spend their time in the Yosemite Valley, which we'll also explore, but on this trip we'll take you to the backcountry that inspired John Muir to lead a movement to have Congress establish Yosemite as we know it today."
                        }
                    },
                    {
                        "title": "Bali Surf Camp",
                        "activity": "Surfing",
                        "price": null,
                        "tripLength": "6 Days",
                        "description": {
                            "plaintext": "Surfing in Bali is on the bucket list of every surfer - whether you're a beginner or someone who's been surfing for decades, there will be a break to cater to your ability. Bali offers warm water, tropical vibes, awesome breaks and low cost expenses."
                        }
                    },
                    {
                        "title": "Beervana in Portland",
                        "activity": "Social",
                        "price": 300.0,
                        "tripLength": "1 Day",
                        "description": {
                            "plaintext": "Experience the best craft breweries in the Pacific Northwest.\n\nPortland is often referred to as Beervana, and it’s easy to understand why once you get a sip of their delicious ales.  This adventure will provide insider access to spectacular local breweries that define the taste and experience of Oregon beer culture and tradition.  Experience Portland’s vibrant history while you sample the best brews the city has to offer."
                        }
                    },
                    {
                        "title": "Climbing New Zealand",
                        "activity": "Rock Climbing",
                        "price": null,
                        "tripLength": "2 Days",
                        "description": {
                            "plaintext": "Let us take you on a spectacular climbing experience unique to New Zealand\n\nFeel the raw adventure and excitement of our guided rock climbing experience. Reach new heights under our professional instruction and feel your body and mind work together in harmony. Come join us for a guided rock climbing adventure in the mountains that trained Sir Edmund Hilary. Whether it is your first time thinking of putting on climbing shoes or you are an old hand looking for some new challenges, our guides can make your climbing adventure a trip you won’t soon forget. New Zealand has countless climbing routes to choose from and is known as one of the premiere climbing destinations in the world. With so many different routes and areas to choose from our guides can tailor each trip to your exact specifications. Let us help you make your New Zealand climbing vacation a memory you will cherish forever!"
                        }
                    },
                    {
                        "title": "Overnight Colorado Rock Climbing",
                        "activity": "Rock Climbing",
                        "price": null,
                        "tripLength": "3 Days",
                        "description": {
                            "plaintext": "With all of Colorado's beautiful peaks, rock formations and gorgeous mountain views, it's not hard for rock climbers to find a little slice of climbing paradise nearly everywhere they go. On this tour we'll take you to the top parks in Colorado so you can experience the diverse climbing landscape that has made Colorado a goto destination for rock climbers from around the world."
                        }
                    },
                    {
                        "title": "Cycling Tuscany",
                        "activity": "Cycling",
                        "price": null,
                        "tripLength": "4 Days",
                        "description": {
                            "plaintext": "Experience Tuscany by Bicycle\n\nVisiting Tuscany on a bicycle is about experiencing the old world charm of Italy on your own terms. Your efforts on the climbs of Italy's rolling hills during this tour will be rewarded with sunny Mediterranean landscapes and unmatched Italian hospitality.  Tuscany’s natural wonders have always been a well of inspiration for arts and culture. Find out why as you explore the Italian countryside and coastline on bicycle."
                        }
                    },
                    {
                        "title": "Downhill Skiing in Jackson Hole, Wyoming",
                        "activity": "Skiing",
                        "price": null,
                        "tripLength": "2-3 days",
                        "description": {
                            "plaintext": "Experience wild untamed, rolling, wide-open terrain of Wyoming in the winter.\n\n\nThe spectacular Tetons of Wyoming provide a wonderous backdrop for your Jackson Hole ski vacation.  Jackson Hole is unlike anywhere else in the US.  A skiers paradise far from crowds and close to nature with terrain so vast it appears uncharted.  With 2,500 acres of legendary terrain, unmatched levels of snowfall each winter, and unparalleled backcountry access, Jackson Hole offers a truly unique skiing experience."
                        }
                    },
                    {
                        "title": "Gastronomic Marais Tour",
                        "activity": "Social",
                        "price": null,
                        "tripLength": "1 Day",
                        "description": {
                            "plaintext": "Take a VIP gastronomic tour through the vibrant Marais, one of the oldest, colorful and historical areas of Paris. Our Marais expert, Marie Bernard will take food lovers to the top food shops, patisseries and chocolate shops as you take in Marais' unique atmosphere."
                        }
                    },
                    {
                        "title": "Napa Wine Tasting",
                        "activity": "Social",
                        "price": null,
                        "tripLength": "1 Day",
                        "description": {
                            "plaintext": "Enjoy spectacular wine tasting in the Napa Valley\n\nNapa Valley is one of the most famous wine regions in the world. Located an hour north of San Francisco, Napa is renowned for their wine, pleasant temperatures and world class restaurants. This tasting will provide insider access to spectacular wineries and restaurants in Yountville, Calistoga and St. Helena."
                        }
                    },
                    {
                        "title": "Riverside Camping Australia",
                        "activity": "Camping",
                        "price": 100.0,
                        "tripLength": "3 Days",
                        "description": {
                            "plaintext": "Escape the hustle and bustle of city life and recharge with a couple of peaceful days and return with tons of memories of camping in the bush and experiences that will last a lifetime. Learn how to pitch a tent by the Siegel River, catch local cod, and spot unique Australian wildlife on this retreat. Or, you can sit back in the shade with a cool beverage and a book until it's too dark to read, then tell stories around a campfire.    "
                        }
                    },
                    {
                        "title": "Ski Touring Mont Blanc",
                        "activity": "Skiing",
                        "price": null,
                        "tripLength": "5 Days",
                        "description": {
                            "plaintext": "If you’re a slopes enthusiast, you know that one run in the backcountry is worth ten in the front country. This adventure includes 5 days of ski touring topped off with the ascent of Mont Blanc, the highest point in Western Europe. An acclimatization phase of the trip will prepare the team physically and mentally for a two-day summit attempt.  During this phase, some of the classic routes around Chamonix will be explored. The final two days we’ll take the summit of Mont Blanc via the Arete Royal and Dome Du Goute."
                        }
                    },
                    {
                        "title": "Surf Camp in Costa Rica",
                        "activity": "Surfing",
                        "price": null,
                        "tripLength": "5 Days",
                        "description": {
                            "plaintext": "Experience Surfer's Paradise in Costa Rica\n\nExperienced local surf guides will take care of all the logistics and find the best spots for you to experience the best surfing Costa Rica has to offer. If you are a novice, we can take you to the right spot for your skill and preference.  Costa Rica is the ideal location for a first surf trip. It is a safe place to travel and the locals are quite friendly and happy to see other surfers. Costa Rica is home to some incredible waves like Witch’s Rock, Ollies Point, Pavones, Playa Negra, Playa Hermosa, Salsa Brava and tons of lesser known world class waves."
                        }
                    },
                    {
                        "title": "Tahoe Skiing",
                        "activity": "Skiing",
                        "price": null,
                        "tripLength": "3-4 days",
                        "description": {
                            "plaintext": "Great weather, crystal clear lake water, and a relaxed California attitude make Lake Tahoe one of the most desirable ski destinations in the world. Few ski areas rival Lake Tahoe for its excellent snow conditions, challenging terrain and state-of-the-art lift chairs. Lake Tahoe is home to dozens of resorts and we'll be your guide for the best of them."
                        }
                    },
                    {
                        "title": "West Coast Cycling",
                        "activity": "Cycling",
                        "price": null,
                        "tripLength": "5 days",
                        "description": {
                            "plaintext": "Join us for this once in a lifetime bike trip traveling from San Francisco to Portland cycling along the Pacific Coast. Experience world class terrain as we head north through redwood forests, state parks, the Columbia river and the Pacific ocean."
                        }
                    },
                    {
                        "title": "Whistler Mountain Biking Adventure",
                        "activity": "Cycling",
                        "price": 1500.0,
                        "tripLength": "2 Days",
                        "description": {
                            "plaintext": "Explore Whistler's Epic Singletrack Trails\n\nWhistler is often considered North America’s preeminent mountain bike destination.  Let us show you why Whistler has earned that designation by guiding you through the hidden spider web of the most epic single-track you've ever conquered. Ride fast rolling trails or attempt some of the world famous logs and ladders."
                        }
                    },
                    {
                        "title": "Yosemite Backpacking",
                        "activity": "Camping",
                        "price": null,
                        "tripLength": "5 Days",
                        "description": {
                            "plaintext": "Yosemite National Park, designated a World Heritage Site in 1984, is best known for its granite cliffs, waterfalls and giant sequoias, but within its nearly 1,200 square miles, you can find deep valleys, grand meadows, glaciers and lakes. The majority of visitors spend their time in the Yosemite Valley, which we'll also explore, but on this trip we'll take you to the backcountry that inspired John Muir to lead a movement to have Congress establish Yosemite as we know it today."
                        }
                    }
                ]
            }
        }
    };

    const graphql_endpoint = "/content/cq:graphql/aem-demo-assets/endpoint.json";
    const all_adventures_graphql = `query {
      adventureList(
        filter: { activity: {_expressions: [{value: null, _operator: EQUALS_NOT}]}}
      ){
        items {
          title
          activity
          price
          tripLength
          description {
            plaintext
          }
        }
      }
    }`;

    const res = await fetch(graphql_endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({query: all_adventures_graphql})
    });

    if(res.status == 200) {
        allAdventuresJson = await res.json();
    }
}