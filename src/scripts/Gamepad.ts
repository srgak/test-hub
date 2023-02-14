import { BehaviorSubject, debounce, debounceTime, delay, filter, map, multicast, pairwise, share, shareReplay, Subject, Subscription, tap } from "rxjs";

interface BtnData extends GamepadButton {
  code: number;
}
interface StickCoor {
  x: number;
  y: number;
}

export default class GamepadController {
  private gamepadIndex!: number;
  private animationId!: number;
  private buttonTouch!: BehaviorSubject<BtnData | undefined>;
  private buttonPress!: BehaviorSubject<BtnData | undefined>;
  public onUp!: Subject<BtnData>;
  public onDown!: Subject<BtnData>;
  public onPress!: Subject<BtnData>;
  private moveStick!: Subject<number[]>;
  public onMoveStickLeft!: Subject<number[]>;
  public onMoveStickRight!: Subject<number[]>;

  private subs!: Subscription;

  constructor() {
    this.init();
  }

  get gamepad(): Gamepad | null {
    return navigator.getGamepads()![this.gamepadIndex];
  }
  
  private init() {
    this.buttonTouch = new BehaviorSubject<BtnData | undefined>(undefined);
    this.buttonPress = new BehaviorSubject<BtnData | undefined>(undefined);
    this.onUp = new Subject<BtnData>();
    this.onDown = new Subject<BtnData>();
    this.onPress = new Subject<BtnData>();
    this.moveStick = new Subject<any>();
    this.onMoveStickLeft = new Subject<number[]>();
    this.onMoveStickRight = new Subject<number[]>();

    addEventListener('gamepadconnected', (event: GamepadEvent) => {
      console.log('соединение есть');
      this.gamepadIndex = event.gamepad.index;
      this.start();
    });
    addEventListener('gamepaddisconnected', (event: GamepadEvent) => {
      console.log('разрыв соединения');
      cancelAnimationFrame(this.animationId);
      this.subs.unsubscribe();
    });
    this.subs = new Subscription();

    this.subs.add(
      this.buttonTouch
        .pipe(
          pairwise(),
          filter(val => val[0]?.value !== val[1]?.value)
        )
        .subscribe(val => {
          if(val[0]?.value! < val[1]?.value!) {
            console.log('событие down');
            this.onDown.next(val[0]!);
          }
          if(val[0]?.value! > val[1]?.value!) {
            console.log('событие up');
            this.onUp.next(val[1]!);
          }
          if(val[1]?.value === 1) {
            console.log('событие press');
            this.onPress.next(val[1]);
          }
        })
    );
    // this.buttonPress
    //     .pipe(
    //       pairwise(),
    //       filter(val => val[0]?.value !== val[1]?.value)
    //     )
    this.onMoveStickLeft
      .pipe(
        pairwise(),
        filter(val => !!val[0].find((coor, index) => coor !== val[1][index])),
        map(val => val[1])
      )
  }

  private start() {
    const {buttons} = this.gamepad!;
    const {axes} = this.gamepad!;
    const targetBtnIndex = buttons.findIndex(btn => btn.touched);
    const targetBtn = buttons[targetBtnIndex];
    const axesLeftStick = [+axes[0].toFixed(1), +axes[1].toFixed(1)];
    const axesRightStick = [+axes[2].toFixed(1), +axes[3].toFixed(1)];
    const buttonData = {
      pressed: targetBtn?.pressed,
      touched: targetBtn?.touched,
      value: targetBtn?.value,
      code: targetBtnIndex
    };

    // console.log(targetBtn);
    
    this.buttonTouch.next(buttonData);
    // this.buttonPress.next(buttonData);
    // this.moveStick.next(axesLeftStick.concat(axesRightStick));
    this.onMoveStickLeft.next(axesLeftStick);

    this.animationId = requestAnimationFrame(this.start.bind(this));
  }
}