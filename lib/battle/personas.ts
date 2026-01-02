export interface GymLeaderPersona {
    id: string;
    name: string;
    title: string;
    specialty: string;
    team: number[]; // Pokemon IDs
    dialogue: {
        start: string[];
        mid: string[];
        lowHp: string[];
        defeat: string[];
        win: string[];
    };
    strategy: string;
}

export const GYM_LEADERS: GymLeaderPersona[] = [
    {
        id: "brock",
        name: "Brock",
        title: "The Rock-Solid Pokémon Trainer",
        specialty: "Rock",
        team: [74, 95], // Geodude, Onix
        dialogue: {
            start: ["I believe in rock-hard defense and determination!", "My Rock-type Pokémon are as tough as they come!"],
            mid: ["Fuhaha! My Rock Pokémon can weather any storm!", "You're better than I thought. But can you break through my defense?"],
            lowHp: ["Not bad! But a rock-solid spirit never wavers!", "My Pokémon are still standing! Feel the pressure!"],
            defeat: ["I took you for granted. You've earned my respect.", "Your victory is as solid as a mountain. Well done."],
            win: ["It looks like your strategy was as soft as clay.", "Come back when you've hardened your spirit."]
        },
        strategy: "Focuses on high defense and physical moves. Vulnerable to Water and Grass types."
    },
    {
        id: "misty",
        name: "Misty",
        title: "The Tomboyish Mermaid",
        specialty: "Water",
        team: [120, 121], // Staryu, Starmie
        dialogue: {
            start: ["My policy is an all-out offensive with Water-type Pokémon!", "Get ready to be washed away!"],
            mid: ["How's that? My Water Pokémon are as fluid as they are strong!", "You're swimming against the tide now!"],
            lowHp: ["Don't think you've won yet! The tide can still turn!", "Ugh, my Pokémon are getting tired. But we won't give up!"],
            defeat: ["You really are a great trainer... I'm impressed!", "I guess I was the one who got washed away."],
            win: ["Looks like you're still a bit of a small fry.", "Maybe you should try a life vest next time!"]
        },
        strategy: "Uses fast and versatile Water-type moves. Watch out for high Special Attack."
    },
    {
        id: "surge",
        name: "Lt. Surge",
        title: "The Lightning American",
        specialty: "Electric",
        team: [100, 125, 26], // Voltorb, Pikachu, Raichu
        dialogue: {
            start: ["Ten-hut! You're about to experience a real shock!", "I'll zap you into submission!"],
            mid: ["You're pretty quick on your feet, kid!", "Mega-volt power! Feel the electricity!"],
            lowHp: ["Whoa! You've got some high-voltage spirit!", "Emergency power! We're not grounded yet!"],
            defeat: ["Whoa! You're the real deal, soldier!", "You outmaneuvered me. Dismissed!"],
            win: ["You just weren't fast enough! Zapped!", "Go back to boot camp, rookie!"]
        },
        strategy: "Relies on speed and paralysis. Ground-type Pokémon are your best bet."
    },
    {
        id: "cynthia",
        name: "Cynthia",
        title: "Sinnoh League Champion",
        specialty: "Balanced/Mixed",
        team: [442, 407, 448, 450, 350, 445], // Spiritomb, Roserade, Lucario, Hippowdon, Milotic, Garchomp
        dialogue: {
            start: ["I am Cynthia, the Champion. Let's see how much you've learned on your journey.", "The bond between you and your Pokémon... Show me its strength."],
            mid: ["You and your Pokémon... You've truly become one.", "A fascinating strategy. Let's see how you handle this."],
            lowHp: ["This pressure... It's what makes battles so exciting.", "My heart is racing. What a wonderful battle."],
            defeat: ["That was an excellent battle. You and your Pokémon truly shine.", "The new Champion... I pass the torch to you with pride."],
            win: ["You have talent, but there is still much for you to see in the world.", "Experience is the best teacher. Keep traveling."]
        },
        strategy: "Extremely balanced team with coverage for almost every type. Garchomp is her ace."
    },
    {
        id: "erika",
        name: "Erika",
        title: "The Nature-Loving Princess",
        specialty: "Grass",
        team: [71, 114, 45], // Victreebel, Tangela, Vileplume
        dialogue: {
            start: ["My name is Erika. I am the Leader of Celadon Gym.", "The weather is so lovely today, isn't it?"],
            mid: ["My Grass Pokémon are quite beautiful, don't you think?", "Nature's power is truly remarkable."],
            lowHp: ["Oh dear, my Pokémon seem to be wilting.", "We must persist, like a flower in the rain."],
            defeat: ["I concede defeat. You are remarkably strong.", "A truly marvelous battle. You have my admiration."],
            win: ["It seems you weren't prepared for the thorns.", "Please, come back when you've learned to appreciate nature."]
        },
        strategy: "Uses status moves like Sleep Powder and Stun Spore. Weak to Fire and Flying types."
    },
    {
        id: "sabrina",
        name: "Sabrina",
        title: "The Master of Psychic Pokémon",
        specialty: "Psychic",
        team: [64, 122, 49, 65], // Kadabra, Mr. Mime, Venomoth, Alakazam
        dialogue: {
            start: ["I had a vision of your arrival.", "Psychic power is much stronger than physical strength."],
            mid: ["I can see your next move before you even make it.", "Your Pokémon's thoughts are clear to me."],
            lowHp: ["This was not in my vision...", "My psychic focus is wavering!"],
            defeat: ["Your strength exceeded my predictions.", "I see a bright future for you as a trainer."],
            win: ["As I foresaw, you were no match for me.", "The future is set. You cannot change it."]
        },
        strategy: "High Special Attack and Speed. Use physical moves or Dark/Ghost/Bug types."
    },
    {
        id: "blaine",
        name: "Blaine",
        title: "The Hot-Headed Quiz Master",
        specialty: "Fire",
        team: [58, 77, 78, 59], // Growlithe, Ponyta, Rapidash, Arcanine
        dialogue: {
            start: ["Hah! You'd better have Burn Heal ready!", "I am Blaine! I am the Leader of Cinnabar Gym!"],
            mid: ["My Fire Pokémon are burning with passion!", "Can you handle the heat?"],
            lowHp: ["The fire is flickering... but it's not out yet!", "Just getting warmed up!"],
            defeat: ["I'm burnt out! You've extinguished my flame.", "That was a red-hot battle! You earned this."],
            win: ["You've been incinerated! Fuhaha!", "Come back when you're not so cold-blooded!"]
        },
        strategy: "Pure offensive power with high-speed Fire types. Water and Ground moves are essential."
    },
    {
        id: "giovanni",
        name: "Giovanni",
        title: "The Self-Proclaimed Greatest Trainer",
        specialty: "Ground",
        team: [111, 112, 31, 34], // Rhyhorn, Rhydon, Nidoqueen, Nidoking
        dialogue: {
            start: ["Welcome to my Gym. I hope you're ready for a real challenge.", "I am the leader of Team Rocket, and the strongest Gym Leader!"],
            mid: ["My Pokémon are trained for absolute power!", "Resistance is futile against the earth itself."],
            lowHp: ["Impossible... my ground-shaking power is failing?", "You will pay for this insolence!"],
            defeat: ["I have been bested... for now.", "You have potential. Don't let it go to waste."],
            win: ["You are weak, just like the rest of them.", "The world belongs to Team Rocket!"]
        },
        strategy: "Heavy hitters with high HP and Attack. Watch out for Earthquake. Water, Grass, and Ice are effective."
    }
];
