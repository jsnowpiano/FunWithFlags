const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); 

const app = express();
app.use(cors()); 
app.use(express.static('public'));

const countries = [
    { code: 'af', name: 'Afghanistan' },
    { code: 'al', name: 'Albania' },
    { code: 'dz', name: 'Algeria' },
    { code: 'as', name: 'American Samoa' },
    { code: 'ad', name: 'Andorra' },
    { code: 'ao', name: 'Angola' },
    { code: 'ai', name: 'Anguilla' },
    { code: 'aq', name: 'Antarctica' },
    { code: 'ag', name: 'Antigua and Barbuda' },
    { code: 'ar', name: 'Argentina' },
    { code: 'am', name: 'Armenia' },
    { code: 'aw', name: 'Aruba' },
    { code: 'au', name: 'Australia' },
    { code: 'at', name: 'Austria' },
    { code: 'az', name: 'Azerbaijan' },
    { code: 'bs', name: 'Bahamas' },
    { code: 'bh', name: 'Bahrain' },
    { code: 'bd', name: 'Bangladesh' },
    { code: 'bb', name: 'Barbados' },
    { code: 'by', name: 'Belarus' },
    { code: 'be', name: 'Belgium' },
    { code: 'bz', name: 'Belize' },
    { code: 'bj', name: 'Benin' },
    { code: 'bm', name: 'Bermuda' },
    { code: 'bt', name: 'Bhutan' },
    { code: 'bo', name: 'Bolivia' },
    { code: 'ba', name: 'Bosnia and Herzegovina' },
    { code: 'bw', name: 'Botswana' },
    { code: 'br', name: 'Brazil' },
    { code: 'bn', name: 'Brunei' },
    { code: 'bg', name: 'Bulgaria' },
    { code: 'bf', name: 'Burkina Faso' },
    { code: 'bi', name: 'Burundi' },
    { code: 'kh', name: 'Cambodia' },
    { code: 'cm', name: 'Cameroon' },
    { code: 'ca', name: 'Canada' },
    { code: 'cv', name: 'Cape Verde' },
    { code: 'cf', name: 'Central African Republic' },
    { code: 'td', name: 'Chad' },
    { code: 'cl', name: 'Chile' },
    { code: 'cn', name: 'China' },
    { code: 'co', name: 'Colombia' },
    { code: 'km', name: 'Comoros' },
    { code: 'cg', name: 'Congo' },
    { code: 'cd', name: 'Congo (DRC)' },
    { code: 'cr', name: 'Costa Rica' },
    { code: 'ci', name: 'Côte d’Ivoire' },
    { code: 'hr', name: 'Croatia' },
    { code: 'cu', name: 'Cuba' },
    { code: 'cy', name: 'Cyprus' },
    { code: 'cz', name: 'Czech Republic' },
    { code: 'dk', name: 'Denmark' },
    { code: 'dj', name: 'Djibouti' },
    { code: 'dm', name: 'Dominica' },
    { code: 'do', name: 'Dominican Republic' },
    { code: 'ec', name: 'Ecuador' },
    { code: 'eg', name: 'Egypt' },
    { code: 'sv', name: 'El Salvador' },
    { code: 'gq', name: 'Equatorial Guinea' },
    { code: 'er', name: 'Eritrea' },
    { code: 'ee', name: 'Estonia' },
    { code: 'sz', name: 'Eswatini' },
    { code: 'et', name: 'Ethiopia' },
    { code: 'fj', name: 'Fiji' },
    { code: 'fi', name: 'Finland' },
    { code: 'fr', name: 'France' },
    { code: 'ga', name: 'Gabon' },
    { code: 'gm', name: 'Gambia' },
    { code: 'ge', name: 'Georgia' },
    { code: 'de', name: 'Germany' },
    { code: 'gh', name: 'Ghana' },
    { code: 'gr', name: 'Greece' },
    { code: 'gd', name: 'Grenada' },
    { code: 'gu', name: 'Guam' },
    { code: 'gt', name: 'Guatemala' },
    { code: 'gn', name: 'Guinea' },
    { code: 'gw', name: 'Guinea-Bissau' },
    { code: 'gy', name: 'Guyana' },
    { code: 'ht', name: 'Haiti' },
    { code: 'hn', name: 'Honduras' },
    { code: 'hu', name: 'Hungary' },
    { code: 'is', name: 'Iceland' },
    { code: 'in', name: 'India' },
    { code: 'id', name: 'Indonesia' },
    { code: 'ir', name: 'Iran' },
    { code: 'iq', name: 'Iraq' },
    { code: 'ie', name: 'Ireland' },
    { code: 'il', name: 'Israel' },
    { code: 'it', name: 'Italy' },
    { code: 'jm', name: 'Jamaica' },
    { code: 'jp', name: 'Japan' },
    { code: 'jo', name: 'Jordan' },
    { code: 'kz', name: 'Kazakhstan' },
    { code: 'ke', name: 'Kenya' },
    { code: 'ki', name: 'Kiribati' },
    { code: 'kp', name: 'North Korea' },
    { code: 'kr', name: 'South Korea' },
    { code: 'kw', name: 'Kuwait' },
    { code: 'kg', name: 'Kyrgyzstan' },
    { code: 'la', name: 'Laos' },
    { code: 'lv', name: 'Latvia' },
    { code: 'lb', name: 'Lebanon' },
    { code: 'ls', name: 'Lesotho' },
    { code: 'lr', name: 'Liberia' },
    { code: 'ly', name: 'Libya' },
    { code: 'li', name: 'Liechtenstein' },
    { code: 'lt', name: 'Lithuania' },
    { code: 'lu', name: 'Luxembourg' },
    { code: 'mg', name: 'Madagascar' },
    { code: 'mw', name: 'Malawi' },
    { code: 'my', name: 'Malaysia' },
    { code: 'mv', name: 'Maldives' },
    { code: 'ml', name: 'Mali' },
    { code: 'mt', name: 'Malta' },
    { code: 'mh', name: 'Marshall Islands' },
    { code: 'mr', name: 'Mauritania' },
    { code: 'mu', name: 'Mauritius' },
    { code: 'mx', name: 'Mexico' },
    { code: 'fm', name: 'Micronesia' },
    { code: 'md', name: 'Moldova' },
    { code: 'mc', name: 'Monaco' },
    { code: 'mn', name: 'Mongolia' },
    { code: 'me', name: 'Montenegro' },
    { code: 'ma', name: 'Morocco' },
    { code: 'mz', name: 'Mozambique' },
    { code: 'mm', name: 'Myanmar' },
    { code: 'na', name: 'Namibia' },
    { code: 'nr', name: 'Nauru' },
    { code: 'np', name: 'Nepal' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'nz', name: 'New Zealand' },
    { code: 'ni', name: 'Nicaragua' },
    { code: 'ne', name: 'Niger' },
    { code: 'ng', name: 'Nigeria' },
    { code: 'mk', name: 'North Macedonia' },
    { code: 'no', name: 'Norway' },
    { code: 'om', name: 'Oman' },
    { code: 'pk', name: 'Pakistan' },
    { code: 'pw', name: 'Palau' },
    { code: 'pa', name: 'Panama' },
    { code: 'pg', name: 'Papua New Guinea' },
    { code: 'py', name: 'Paraguay' },
    { code: 'pe', name: 'Peru' },
    { code: 'ph', name: 'Philippines' },
    { code: 'pl', name: 'Poland' },
    { code: 'pt', name: 'Portugal' },
    { code: 'qa', name: 'Qatar' },
    { code: 'ro', name: 'Romania' },
    { code: 'ru', name: 'Russia' },
    { code: 'rw', name: 'Rwanda' },
    { code: 'ws', name: 'Samoa' },
    { code: 'sm', name: 'San Marino' },
    { code: 'st', name: 'Sao Tome and Principe' },
    { code: 'sa', name: 'Saudi Arabia' },
    { code: 'sn', name: 'Senegal' },
    { code: 'rs', name: 'Serbia' },
    { code: 'sc', name: 'Seychelles' },
    { code: 'sl', name: 'Sierra Leone' },
    { code: 'sg', name: 'Singapore' },
    { code: 'sk', name: 'Slovakia' },
    { code: 'si', name: 'Slovenia' },
    { code: 'sb', name: 'Solomon Islands' },
    { code: 'so', name: 'Somalia' },
    { code: 'za', name: 'South Africa' },
    { code: 'ss', name: 'South Sudan' },
    { code: 'es', name: 'Spain' },
    { code: 'lk', name: 'Sri Lanka' },
    { code: 'sd', name: 'Sudan' },
    { code: 'sr', name: 'Suriname' },
    { code: 'se', name: 'Sweden' },
    { code: 'ch', name: 'Switzerland' },
    { code: 'sy', name: 'Syria' },
    { code: 'tw', name: 'Taiwan' },
    { code: 'tj', name: 'Tajikistan' },
    { code: 'tz', name: 'Tanzania' },
    { code: 'th', name: 'Thailand' },
    { code: 'tl', name: 'Timor-Leste' },
    { code: 'tg', name: 'Togo' },
    { code: 'to', name: 'Tonga' },
    { code: 'tt', name: 'Trinidad and Tobago' },
    { code: 'tn', name: 'Tunisia' },
    { code: 'tr', name: 'Turkey' },
    { code: 'tm', name: 'Turkmenistan' },
    { code: 'tv', name: 'Tuvalu' },
    { code: 'ug', name: 'Uganda' },
    { code: 'ua', name: 'Ukraine' },
    { code: 'ae', name: 'United Arab Emirates' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'us', name: 'United States' },
    { code: 'uy', name: 'Uruguay' },
    { code: 'uz', name: 'Uzbekistan' },
    { code: 'vu', name: 'Vanuatu' },
    { code: 've', name: 'Venezuela' },
    { code: 'vn', name: 'Vietnam' },
    { code: 'ye', name: 'Yemen' },
    { code: 'zm', name: 'Zambia' },
    { code: 'zw', name: 'Zimbabwe' }
];


app.get('/api/flags', (req, res) => {
    const flags = countries.map(country => ({
        country: country.name,
        url: `https://flagcdn.com/w2560/${country.code}.png`
    }));
    res.json(flags);
});


const rooms = {};


const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const wss = new WebSocket.Server({ server });

const broadcastToRoom = (roomCode, message) => {
    const room = rooms[roomCode];
    if (room) {
        room.clients.forEach(client => {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
            }
        });
    } else {
        console.error(`Error joining room`);
    }
};
const sendRandomFlag = (roomCode) => {
    const room = rooms[roomCode];
    if (room) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const correctAnswer = randomCountry.name;
        const incorrectOptions = countries
            .filter(country => country.name !== correctAnswer)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(country => country.name);

        const options = [...incorrectOptions, correctAnswer].sort(() => 0.5 - Math.random());

        room.currentFlag = {
            country: correctAnswer,
            url: `https://flagcdn.com/w2560/${randomCountry.code}.png`,
            options
        };

        room.answeredPlayers = [];
        broadcastToRoom(roomCode, { type: 'newFlag', flag: room.currentFlag });
    } else {
        console.error(`Room with code ${roomCode} does not exist.`);
    }
};

wss.on('connection', (ws) => {
    let currentRoom = null;
    let userId = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'createRoom') {
                const roomCode = crypto.randomBytes(4).toString('hex').slice(0, 7).toUpperCase();
                rooms[roomCode] = {
                    creator: data.nickname,
                    clients: [{ ws, nickname: data.nickname, score: 0 }],
                    gameStarted: false,
                    currentFlag: null,
                    answeredPlayers: []
                };
                currentRoom = roomCode;
                userId = data.nickname;
            

                ws.send(JSON.stringify({ type: 'roomCreated', roomCode }));
            
                broadcastToRoom(roomCode, { type: 'playersUpdate', players: rooms[roomCode].clients.map(c => ({ nickname: c.nickname, score: c.score })) });
            } else if (data.type === 'joinRoom') {
                const room = rooms[data.roomCode];
                if (room) {
                    room.clients.push({ ws, nickname: data.nickname, score: 0 });
                    currentRoom = data.roomCode;
                    userId = data.nickname;
                    ws.send(JSON.stringify({ type: 'roomJoined', roomCode: data.roomCode }));
                    broadcastToRoom(data.roomCode, { type: 'playersUpdate', players: room.clients.map(c => ({ nickname: c.nickname, score: c.score })) });
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                }
            } else if (data.type === 'startGame') {
                const room = rooms[currentRoom];
                if (room && room.creator === userId) {
                    room.gameStarted = true;
                    broadcastToRoom(currentRoom, { type: 'gameStarted' });
                    sendRandomFlag(currentRoom); 
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Only the room creator can start the game' }));
                }
            } else if (data.type === 'answer') {
                const room = rooms[currentRoom];
                if (room && room.currentFlag) {
                    const player = room.clients.find(c => c.nickname === userId);
                    if (!room.answeredPlayers.includes(userId)) {
                        room.answeredPlayers.push(userId);
            
                        if (data.answer === room.currentFlag.country) {
                            if (room.answeredPlayers.length === 1) {
                                player.score += 100; 
                            } else {
                                player.score += 50; 
                            }
                        }
            
                        broadcastToRoom(currentRoom, { type: 'playersUpdate', players: room.clients.map(c => ({ nickname: c.nickname, score: c.score })) });
            
                        if (player.score >= 1000) {
                            console.log(`${player.nickname} has won the game with ${player.score} points.`);
                            broadcastToRoom(currentRoom, { type: 'gameWon', winner: player.nickname });
                            return;
                        }
            
                        if (room.answeredPlayers.length === room.clients.length) {
                            setTimeout(() => sendRandomFlag(currentRoom), 3000);
                        }
                    }
                }
            } else if (data.type === 'resetGame') {
                const room = rooms[currentRoom];
                if (room && room.creator === userId) {
                    room.clients.forEach(client => {
                        client.score = 0;
                    });
                    broadcastToRoom(currentRoom, { type: 'gameReset', players: room.clients.map(c => ({ nickname: c.nickname, score: c.score })) });
                    sendRandomFlag(currentRoom); 
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        if (currentRoom) {
            const room = rooms[currentRoom];
            if (room) {
                room.clients = room.clients.filter(client => client.ws !== ws);
                if (room.clients.length === 0) {
                    delete rooms[currentRoom];
                } else {
                    broadcastToRoom(currentRoom, { type: 'playersUpdate', players: room.clients.map(c => ({ nickname: c.nickname, score: c.score })) });
                }
            }
        }
    });
});