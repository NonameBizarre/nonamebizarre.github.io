import Timer = Phaser.Timer;
import ArrayUtils = Phaser.ArrayUtils;
/**
 * Created by DEaDA on 5/31/17.
 */

class UITable extends Phaser.Group {

    private hands: UIHands;
    private tableHands: UIHand;
    private winCards: UIHand;
    private currentWin = 0;
    private token: UITokens;
    private bank: UIMoneyLabel;
    private balance: UIMoneyLabel;
    private hint: BitmapText;
    private isWin = false;
    private isReady;
    private timer: Timer;
    private logo: UILogo;
    private tableCardsBack: UIHand;
    private firstTime = true;
    private level: number = 0;
    private resultWindow: ResultWindow;
    private gameIsEnded = false;
    private startTime: number = 0;
    private timerEnd;
    private oval;

    constructor(game: Phaser.Game) {
        super(game);
        this.combinations = ArrayUtils.shuffle(this.combinations);
        let bg = new UITableBack(this.game);
        this.addChild(bg);
        let oval = this.game.add.image(0, 0, 'images', 'oval.png');
        this.addChild(oval);
        let bank = new UIMoneyLabel(this.game, true);
        this.addChild(bank);
        let tokens = new UITokens(this.game, 2, 10);
        this.addChild(tokens);
        let balance = new UIMoneyLabel(this.game);
        this.addChild(balance);
        let tableCardsBack = new UIHand(this.game, 5);
        this.addChild(tableCardsBack);
        let tableHands = new UIHand(this.game, 3);
        this.addChild(tableHands);
        let hands = new UIHands(this.game);
        this.addChild(hands);
        let hint = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.HINT[Lang.loc], 50);
        this.addChild(hint);
        let logo = new UILogo(this.game);
        this.addChild(logo);
        hint.anchor.set(0.5);

        this.tableCardsBack = tableCardsBack;
        this.hint = hint;
        this.bank = bank;
        this.oval = oval;
        this.balance = balance;
        this.token = tokens;
        this.hands = hands;
        this.tableHands = tableHands;
        this.timer = this.game.time.create(false);
        this.logo = logo;
        this.hands = hands;

        tableHands.setCards(this.combinations[this.level]["table"], true);
        hands.setCards(ArrayUtils.shuffle(this.combinations[this.level]["hands"]));
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            bg.width = 1280;
            bg.scale.y = bg.scale.x;

            oval.scale.set(0.85, 0.85);
            oval.x = 500;
            oval.y = 115;

            bank.x = oval.x + oval.width + 30;
            bank.y = oval.y + 10;

            tokens.x = oval.x + 4;
            tokens.y = oval.y - 5;

            balance.x = 1000 - 30;
            balance.y = oval.y + 50 + 100;

            tableCardsBack.x = (1280 - 500) / 2;
            tableCardsBack.y = 200;
            tableCardsBack.setCards(['', '', '', '', '']);

            tableHands.x = (1280 - 500) / 2;
            tableHands.y = 200;

            hands.x = 250;
            hands.y = 480;

            hint.tint = 0xffee28;
            hint.x = tableCardsBack.x + 250;
            hint.y = tableCardsBack.y + 190;

            logo.x = 30;
            logo.y = 30;

        }
        else {
            bg.width = 720;
            bg.scale.y = bg.scale.x;
            bg.y = 100;

            oval.scale.set(0.85, 0.85);
            oval.x = 210;
            oval.y = 280;

            tokens.x = oval.x + 4;
            tokens.y = oval.y - 5;

            bank.x = oval.x + oval.width + 30;
            bank.y = oval.y + 10;

            balance.x = 320 + 50;
            balance.y = 700;

            tableCardsBack.x = (720 - 290) / 2;
            tableCardsBack.y = 370;
            tableCardsBack.setCards(['', '', '', '', '']);

            tableHands.x = (720 - 290) / 2;
            tableHands.y = 370;

            hands.x = 20;
            hands.y = 1050;

            hint.tint = 0xffee28;
            hint.x = 720 / 2;
            hint.y = hands.y - 45;

            logo.scale.set(1);
            logo.x = 180;
            logo.y = 30;
        }

        this.timerEnd = this.game.time.create(false);
        let endGameTimer = window["endGameTimer"];
        if (endGameTimer == null)
            endGameTimer = 45000;
        this.timerEnd.add(endGameTimer, this.endGame, this);
        this.timerEnd.start();
        //   this.startTime = new Date().getTime();
        this.startRound();

        // this.resultWindow = new ResultWindow(this.game);
        // this.addChild(this.resultWindow);
    }

    startRound() {
        //  console.log("round time:", new Date().getTime() - this.startTime);
        //this.startTime = new Date().getTime();
        if (!this.gameIsEnded) {
            if (this.winCards != null)
                this.remove(this.winCards, true);
            let winCards = new UIHand(this.game, 5);
            winCards.setCards(this.combinations[this.level]["win"], true, false);
            this.addChild(winCards);
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                winCards.x = (1280 - 500) / 2;
                winCards.y = 200;
            } else {
                winCards.x = (720 - 290) / 2;
                winCards.y = 370;
            }
            winCards.visible = false;
            this.winCards = winCards;

            let tokens = new UITokens(this.game, 2, this.token.tokensBalance.length);
            this.addChild(tokens);
            tokens.x = this.token.x;
            tokens.y = this.token.y;

            this.remove(this.token, true);
            this.token = tokens;

            this.hands.visible = true;
            this.currentWin = this.combinations[this.level]["winHand"];
            this.hint.visible = false;

            this.bank.setValue(0);
            this.balance.setValue(Controller.Instance.balance);

            this.timer.add(400, this.newBankValue, this);
            this.timer.start();

            this.token.prepare(0, this.firstTime);
            this.tableHands.prepare(0);
            this.hands.startRound();
            this.bringToTop(this.hands);
            this.game.sound.play('flop');
        }
    }

    newBankValue() {
        if (!this.gameIsEnded) {
            this.tableHands.startRound();
            this.timer.add(750, this.newBankValue2, this);
        }
    }

    newBankValue2() {
        if (!this.gameIsEnded) {
            this.token.startRound();
            this.bank.setValue(100);
            this.game.add.tween(this.bank).to({alpha: 1}, 200, Phaser.Easing.Sinusoidal.In, true);
            this.bank.visible = true;
            this.timer.add(750, this.newBankValue3, this);
        }
    }

    newBankValue3() {
        if (!this.gameIsEnded) {
            this.bank.setValue(200);
            Controller.Instance.balance -= 100;
            this.balance.setValue(Controller.Instance.balance);
            this.hint.visible = true;
            if (this.firstTime) {
                this.hands.showSelectors();
                this.timer.add(1000, this.ready, this);
            } else
                this.ready();
        }
    }

    ready() {
        this.firstTime = false;
        this.isReady = true;
        //  this.selectTable(0);
    }


    public selectTable(id) {
        if (!this.gameIsEnded) {
            this.game.add.tween(this.hint).to({alpha: 0}, 200, Phaser.Easing.Sinusoidal.In, true);
            if (this.isReady) {
                this.hands.hideSelectors();
                this.isReady = false;
                this.game.sound.play('choose');
                this.currentWin = this.hands.win(this.combinations[this.level]["winHand"]);
                this.timer.add(1200, this.showResult, this);
                this.timer.start();
                if (this.currentWin == id && this.currentWin >= 0) {
                    this.isWin = true;
                } else {
                    this.isWin = false;
                }
            }
        }
    }

    showResult() {
        if (!this.gameIsEnded) {
            this.tableHands.visible = false;
            this.hands.visible = false;
            this.winCards.visible = true;
            let posX = this.winCards.x;
            let posY = this.winCards.y;

            this.tableCardsBack.visible = false;

            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                this.game.add.tween(this.winCards.scale).to({
                    x: 1.2,
                    y: 1.2
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 200);
                this.game.add.tween(this.winCards).to({
                    x: posX - 48,
                    y: posY - 10
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 200);
            } else {
                this.game.add.tween(this.winCards.scale).to({
                    x: 1.2,
                    y: 1.2
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 200);
                this.game.add.tween(this.winCards).to({
                    x: posX - 24,
                    y: posY - 10
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 200);
            }

            this.game.sound.play('win');
            this.winCards.playFX();
            this.hint.text = this.combinations[this.level]["name"];
            this.hint.alpha = 0;
            this.hint.visible = true;
            this.game.add.tween(this.hint).to({alpha: 1}, 500, Phaser.Easing.Sinusoidal.InOut, true);
            this.timer.add(1000, this.showWinToken, this);
            this.timer.start();
        }
    }

    showWinToken() {
        if (!this.gameIsEnded) {
            this.token.showWin(this.isWin);
            if (this.isWin)
                Controller.Instance.balance += 200;
            this.bank.setValue(0);
            this.game.add.tween(this.bank).to({alpha: 0}, 200, Phaser.Easing.Sinusoidal.In, true);
            this.balance.setValue(Controller.Instance.balance);

            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                if (Controller.Instance.balance > 400)
                    this.game.add.tween(this.balance).to({x: 1000 - 30 - 60}, 200, Phaser.Easing.Sinusoidal.In, true);
                else
                    this.game.add.tween(this.balance).to({x: 1000 - 30 - 30}, 200, Phaser.Easing.Sinusoidal.In, true);
            }

            this.timer.add(500, this.newRound, this);
            this.timer.start();
        }
    }

    newRound() {
        if (!this.gameIsEnded) {

            this.tableCardsBack.visible = true;
            this.game.add.tween(this.hint).to({alpha: 0}, 500, Phaser.Easing.Sinusoidal.InOut, true);
            this.winCards.hide();

            this.level++;
            if (this.level >= this.combinations.length)
                this.level = 0;
            this.hint.visible = false;
            this.tableHands.setCards(this.combinations[this.level]["table"], true);
            this.hint.text = Lang.Instance.HINT["en"];
            this.hands.setCards(ArrayUtils.shuffle(this.combinations[this.level]["hands"]), true);

            if (!this.gameIsEnded)
                this.bringToTop(this.hands);

            if (Controller.Instance.balance >= 100) {
                this.timer.add(500, this.startRound, this);
                this.timer.start()
            } else {
                this.endGame()
            }
        }
    }

    private endGame() {
        this.timerEnd.stop();
        this.gameIsEnded = true;
        this.hands.visible = false;
        let bg = new UITableBack(this.game);
        this.addChild(bg);
        bg.alpha = 0;
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            bg.width = 1280;
            bg.scale.y = bg.scale.x;
        }
        else {
            bg.width = 720;
            bg.scale.y = bg.scale.x;
            bg.y = 100;
        }
        this.game.add.tween(bg).to({alpha: 1}, 200, Phaser.Easing.Sinusoidal.In, true);
        this.resultWindow = new ResultWindow(this.game);
        this.addChild(this.resultWindow);
        this.bringToTop(this.logo);
    }

    private combinations: Array < Object > = [
        {
            win: ['ks', 'kh', 'kd', 'kc', 'as'],
            table: ['ks', 'kh', 'kd'],
            hands: [['kc', 'as'], ['qc', 'jh'], ['qh', 'jc']],
            name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
            winHand: ['kc', 'as']
        },
        {
            win: ['qs', 'qh', 'ts', 'qc', 'qd'],
            table: ['qs', 'qh', 'ts'],
            hands: [['qc', 'qd'], ['th', 'tc'], ['as', '5h']],
            name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
            winHand: ['qc', 'qd']
        },
        {
            win: ['jc', '2s', 'js', 'jh', 'jd'],
            table: ['jc', '2s', 'js'],
            hands: [['jh', 'jd'], ['kd', 'ad'], ['ks', 'as']],
            name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
            winHand: ['jh', 'jd']
        },
        {
            win: ['7d', 'ad', 'ac', 'ah', 'as'],
            table: ['7d', 'ad', 'ac'],
            hands: [['ah', 'as'], ['2c', '5h'], ['kc', 'kd']],
            name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
            winHand: ['ah', 'as']
        },
        {
            win: ['7d', '7s', '7h', 'ks', '7c'],
            table: ['7d', '7s', '7h'],
            hands: [['ks', '7c'], ['2d', '2h'], ['as', 'ah']],
            name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
            winHand: ['ks', '7c']
        },
        {
            win: ['3d', '3s', '3h', 'ks', 'kc'],
            table: ['3d', '3s', '3h'],
            hands: [['ks', 'kc'], ['ts', 'tc'], ['2h', '4d']],
            name: Lang.Instance.FULL_HOUSE[Lang.loc],
            winHand: ['ks', 'kc']
        },
        {
            win: ['7c', '7h', '7s', '3s', '3c'],
            table: ['7c', '7h', '7s'],
            hands: [['3s', '3c'], ['5h', '2d'], ['ks', 'ac']],
            name: Lang.Instance.FULL_HOUSE[Lang.loc],
            winHand: ['3s', '3c']
        },
        {
            win: ['qd', 'qs', '3h', 'qh', '3c'],
            table: ['qd', 'qs', '3h'],
            hands: [['qh', '3c'], ['3d', 'as'], ['9d', 'tc']],
            name: Lang.Instance.FULL_HOUSE[Lang.loc],
            winHand: ['qh', '3c']
        },
        {
            win: ['tc', '5h', '5d', 'th', 'ts'],
            table: ['tc', '5h', '5d'],
            hands: [['th', 'ts'], ['5c', 'td'], ['3h', '3h']],
            name: Lang.Instance.FULL_HOUSE[Lang.loc],
            winHand: ['th', 'ts']
        },
        {
            win: ['ah', 'as', 'ad', 'ks', 'kc'],
            table: ['ah', 'as', 'ad'],
            hands: [['ks', 'kc'], ['qh', 'qd'], ['3s', '7c']],
            name: Lang.Instance.FULL_HOUSE[Lang.loc],
            winHand: ['ks', 'kc']
        },

        {
            win: ['2s', '5s', 'as', 'ks', '3s'],
            table: ['2s', '5s', 'as'],
            hands: [['ks', '3s'], ['qs', '2d'], ['3s', '3c']],
            name: Lang.Instance.FLUSH[Lang.loc],
            winHand: ['ks', '3s']
        },
        {
            win: ['9h', 'th', 'qh', '2h', '5h'],
            table: ['9h', 'th', 'qh'],
            hands: [['2h', '5h'], ['kh', 'jd'], ['3s', '7c']],
            name: Lang.Instance.FLUSH[Lang.loc],
            winHand: ['2h', '5h']
        },
        {
            win: ['td', 'qd', '7d', '2d', '3d'],
            table: ['td', 'qd', '7d'],
            hands: [['2d', '3d'], ['7s', '7c'], ['ah', 'ac']],
            name: Lang.Instance.FLUSH[Lang.loc],
            winHand: ['2d', '3d']
        },
        {
            win: ['jc', 'qc', 'ac', '2c', '3c'],
            table: ['jc', 'qc', 'ac'],
            hands: [['2c', '3c'], ['qs', 'as'], ['ad', 'ah']],
            name: Lang.Instance.FLUSH[Lang.loc],
            winHand: ['2c', '3c']
        },
        {
            win: ['qs', 'ks', 'as', 'ts', 'js'],
            table: ['qs', 'ks', 'as'],
            hands: [['ts', 'js'], ['ad', 'ac'], ['kd', 'ah']],
            name: Lang.Instance.FLUSH_ROYAL[Lang.loc],
            winHand: ['ts', 'js']
        },

        {
            win: ['4s', '5d', '6c', '7s', '8h'],
            table: ['4s', '5d', '6c'],
            hands: [['7s', '8h'], ['3d', '7c'], ['ah', 'kh']],
            name: Lang.Instance.STRAIGHT[Lang.loc],
            winHand: ['7s', '8h']
        },
        {
            win: ['js', 'kc', 'qs', 'ad', 'th'],
            table: ['js', 'kc', 'qs'],
            hands: [['ad', 'th'], ['5c', '7d'], ['as', 'ks']],
            name: Lang.Instance.STRAIGHT[Lang.loc],
            winHand: ['ad', 'th']
        },
        {
            win: ['5c', '6d', '7d', '8c', '9c'],
            table: ['5c', '6d', '7d'],
            hands: [['8c', '9c'], ['9d', 'td'], ['kd', 'ad']],
            name: Lang.Instance.STRAIGHT[Lang.loc],
            winHand: ['8c', '9c']
        },
        {
            win: ['th', 'jh', 'qh', 'ks', 'as'],
            table: ['th', 'jh', 'qh'],
            hands: [['ks', 'as'], ['ah', '7s'], ['kc', '3c']],
            name: Lang.Instance.STRAIGHT[Lang.loc],
            winHand: ['ks', 'as']
        },
        {
            win: ['2h', '3h', '4h', 'ah', '5h'],
            table: ['2h', '3h', '4h'],
            hands: [['ah', '5h'], ['5s', '6s'], ['kc', '3c']],
            name: Lang.Instance.STRAIGHT_FLUSH[Lang.loc],
            winHand: ['ah', '5h']
        },
        {
            win: ['as', 'ad', 'kc', 'ah', '7d'],
            table: ['as', 'ad', 'kc'],
            hands: [['ah', '7d'], ['ks', '8c'], ['qs', '2c']],
            name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
            winHand: ['ah', '7d']
        },
        {
            win: ['as', 'kh', 'kc', '5c', 'kd'],
            table: ['as', 'kh', 'kc'],
            hands: [['5c', 'kd'], ['qs', '3s'], ['js', '2s']],
            name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
            winHand: ['5c', 'kd']
        },
        {
            win: ['qs', '2c', '3d', 'qd', 'qc'],
            table: ['qs', '2c', '3d'],
            hands: [['qd', 'qc'], ['2s', '3s'], ['ac', 'kc']],
            name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
            winHand: ['qd', 'qc']
        },
        {
            win: ['as', '7c', 'td', 'ac', 'ad'],
            table: ['as', '7c', 'td'],
            hands: [['ac', 'ad'], ['5d', 'tc'], ['2h', 'js']],
            name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
            winHand: ['ac', 'ad']
        },
        {
            win: ['2h', '2c', 'ad', '2c', 'ac'],
            table: ['2h', '2c', 'ad'],
            hands: [['2c', 'ac'], ['qh', '3s'], ['5c', '7d']],
            name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
            winHand: ['2c', 'ac']
        }
    ]
}
