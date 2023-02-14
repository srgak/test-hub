
import Chat from './scripts/Chat';
import GamepadController from './scripts/Gamepad';

import './styles/styles.less';
import './components/menu/menu.less';
import './components/chat/chat.less';

document.addEventListener('DOMContentLoaded', () => {
  const elChat = document.querySelector('.chat');

  if(elChat) {
    const chat = new Chat(elChat, 'ws://localhost:9000');
  }

  const gamepad = new GamepadController();
});