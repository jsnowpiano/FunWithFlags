<template>
  <div id="app">
    <h1>Fun With Flags</h1>

    <!-- Room creation/joining -->
    <div v-if="!roomCode && !gameStarted" class="room-form">
      <div>
        <button @click="createRoom" class="room-button">Create Room</button>
      </div>
      <div>
        <input v-model="tempRoomCode" type="text" placeholder="Enter Room Code" class="room-input" />
        <button @click="joinRoom" class="room-button">Join Room</button>
      </div>
    </div>

    <!-- Waiting for game to start -->
    <div v-else-if="!gameStarted && !winner" class="waiting-room">
      <h2>Room Code: {{ roomCode }}</h2>
      <p>Players:</p>
      <ul>
        <li v-for="player in players" :key="player.username">{{ player.username }}: {{ player.score }}</li>
      </ul>
      <button v-if="isCreator" @click="startGame" class="start-button">Start Game</button>
      <p v-else>Waiting for the room creator to start the game...</p>
    </div>

    <!-- Win screen -->
    <div v-else-if="winner" class="win-screen">
      <h2>{{ winner }} has won the game!</h2>
      <button v-if="isCreator" @click="resetGame" class="reset-button">Continue</button>
    </div>

    <!-- Game content -->
    <div v-else class="game-container">
  <div class="players-list">
    <h3>Players</h3>
    <ul>
      <li v-for="player in players" :key="player.username">{{ player.username }}: {{ player.score }}</li>
    </ul>
  </div>
  <div class="flag-container" v-if="currentFlag">
    <h2>Guess the Country</h2>
    <img :src="currentFlag.url" alt="Flag" class="flag-image" />
    <div class="options">
      <button
        v-for="(option, index) in currentFlag.options"
        :key="index"
        @click="submitAnswer(option)"
        class="option-button"
        :disabled="answered"
      >
        {{ option }}
      </button>
    </div>
    <p v-if="feedback" class="feedback">{{ feedback }}</p>
  </div>
  <div v-else>
    <p>Waiting for the next flag...</p>
  </div>
</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ws: null,
      username: null,
      roomCode: null,
      tempRoomCode: '',
      players: [],
      isCreator: false,
      gameStarted: false,
      currentFlag: null,
      feedback: '',
      answered: false,
      winner: null // Track the winner
    };
  },
  methods: {
    setupWebSocket() {
      this.ws = new WebSocket('ws://localhost:3000');
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'roomCreated') {
          this.roomCode = data.roomCode;
          this.isCreator = true;
        } else if (data.type === 'roomJoined') {
          this.roomCode = data.roomCode;
        } else if (data.type === 'playersUpdate') {
          this.players = data.players;
        } else if (data.type === 'gameStarted') {
          this.gameStarted = true;
        } else if (data.type === 'newFlag') {
          this.currentFlag = data.flag;
          this.feedback = '';
          this.answered = false;
        } else if (data.type === 'gameWon') {
          this.winner = data.winner; // Set the winner
          this.gameStarted = false; // Stop the game
        } else if (data.type === 'gameReset') {
          this.players = data.players; // Reset player scores
          this.winner = null; // Clear the winner
          this.gameStarted = true; // Restart the game
        } else if (data.type === 'error') {
          alert(data.message);
        }
      };
    },
    createRoom() {
      if (!this.username) {
        this.username = prompt('Enter your username:');
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'createRoom', username: this.username }));
      } else {
        console.error('WebSocket is not connected.');
      }
    },
    joinRoom() {
      if (!this.username) {
        this.username = prompt('Enter your username:');
      }
      this.ws.send(JSON.stringify({ type: 'joinRoom', roomCode: this.tempRoomCode, username: this.username }));
    },
    startGame() {
      this.ws.send(JSON.stringify({ type: 'startGame' }));
    },
    submitAnswer(option) {
      this.answered = true;
      this.ws.send(JSON.stringify({ type: 'answer', answer: option }));
      if (option === this.currentFlag.country) {
        this.feedback = 'Correct!';
      } else {
        this.feedback = `Wrong! The correct answer was ${this.currentFlag.country}.`;
      }
    },
    resetGame() {
      this.ws.send(JSON.stringify({ type: 'resetGame' }));
    }
  },
  mounted() {
    this.setupWebSocket();
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }
};
</script>

<style>
/* General layout */
#app {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f4f4;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

/* Room creation/joining */
.room-form {
  text-align: center;
  margin-top: 50px;
}

.room-input {
  padding: 10px;
  font-size: 16px;
  margin-right: 10px;
}

.room-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.room-button:hover {
  background-color: #45a049;
}

/* Waiting room */
.waiting-room {
  text-align: center;
  margin-top: 50px;
}

.start-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.start-button:hover {
  background-color: #1976d2;
}

/* Win screen */
.win-screen {
  text-align: center;
  margin-top: 50px;
}

.reset-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #e68900;
}

/* Game layout */
.game-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.players-list {
  width: 20%;
  padding: 10px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.flag-container {
  flex: 1;
  padding: 10px;
  text-align: center;
}

.flag-image {
  max-width: 100%; /* Ensure the flag fits within the container */
  height: auto;
  max-height: 300px; /* Limit the height to ensure buttons are visible */
  margin-top: 20px;
  border: 2px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
}

.option-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 80%;
  max-width: 300px;
}

.option-button:hover {
  background-color: #45a049;
}

.feedback {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  .players-list {
    display: none; /* Hide the players list on mobile devices */
  }

  .flag-container {
    width: 100%; /* Make the flag container take the full width */
  }
}
</style>