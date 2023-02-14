interface UserInfo {
  name: string | undefined;
  color: string | undefined;
}

export default class Chat {
  private ws!: WebSocket;
  private el!: Element;
  private elCreateUser!: HTMLFormElement | null;
  private elMessage!: Element | null;
  private elUserName!: Element | null;
  private elMessageList!: Element | null;
  private elChatField!: HTMLFormElement | null;
  // private userName!: string | undefined;
  private user!: UserInfo;

  constructor(mainEl: Element, url: string) {
    console.log(url);
    this.ws = new WebSocket(url);
    this.el = mainEl;
    this.elCreateUser = mainEl.querySelector('.chat-user');
    this.elMessage = mainEl.querySelector('.chat-message');
    this.elUserName = mainEl.querySelector('.chat-message__user');
    this.elMessageList = mainEl.querySelector('.chat-message-list');
    this.elChatField = mainEl.querySelector('.chat-field');
    this.user = {
      name: undefined,
      color: undefined
    };

    this.init();
  }

  get randomColor(): string {
    return '#' + `${Math.random().toString(16)}000000`.substring(2, 8);
  }

  private init(): void {
    this.ws.addEventListener('open', () => {
      console.log('начать подключение')
    });
    this.ws.addEventListener('message', (res: MessageEvent) => {
      const data = JSON.parse(res.data);
      console.log(data);
      const template = require('../components/chat/chat-message-item.pug')(data);
      
      this.elChatField?.reset();
      this.elMessageList!.innerHTML += template;
    });
    this.ws.addEventListener('error', () => {
      console.log('ошибка');
    });
    this.ws.addEventListener('close', () => {
      console.log('закрыто');
    });
    this.elCreateUser?.addEventListener('submit', this.createUser.bind(this));
    this.elChatField?.addEventListener('submit', this.sendMessage.bind(this))
  }

  private createUser(event: SubmitEvent): void {
    event.preventDefault();
    const body = new FormData(this.elCreateUser || undefined);
    this.user.name = body.get('userName')?.toString();
    this.user.color = this.randomColor;
    this.elCreateUser?.classList.remove('active');
    this.elMessage?.classList.add('active');
    this.elUserName?.append(this.user.name || '');
  }
  public sendMessage(event: SubmitEvent): void {
    event.preventDefault();
    const body = new FormData(this.elChatField || undefined);
    this.ws.send(JSON.stringify({
      data: {
        ...this.user,
        message: body.get('message')
      }
    }));
  }
}