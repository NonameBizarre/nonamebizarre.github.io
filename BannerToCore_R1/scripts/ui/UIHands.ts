/**
 * Created by DEaDA on 6/2/17.
 */
class UIHands extends Phaser.Group {

    private hands = [];
    private timer;

    constructor(game: Phaser.Game) {
        super(game);

        let hands = [];
        let hand;
        for (let i = 0; i < 3; i++) {
            hand = new UIHand(this.game);
            this.addChild(hand);

            if (Controller.Instance.orientation == Controller.LANDSCAPE)
                hand.x = 300 * i;
            else
                hand.x = 240 * i;

            hand.handID = i;
            hands[i] = hand;
        }
        this.hands = hands;
    }

    public startRound() {
        let hand: UIHand;
        for (let i = 0; i < 3; i++) {
            hand = this.hands[i];
            hand.startRound(100 + i * 200);
        }
    }

    public showSelectors() {
        let hand: UIHand;
        for (let i = 0; i < 3; i++) {
            hand = this.hands[i];
            hand.showSelector();
        }
    }

    public hideSelectors() {
        let hand: UIHand;
        for (let i = 0; i < 3; i++) {
            hand = this.hands[i];
            hand.hideSelectorInstant();
        }
    }

    public setCards(params, repos = false) {
        let hand: UIHand;
        for (let i = 0; i < 3; i++) {
            hand = this.hands[i];
            hand.init();
            hand.setCards(params[i], true, repos);
        }
    }

    public win(cards: Array < String >) {
        let hand: UIHand;
        let win = -1;
        for (let i = 0; i < 3; i++) {
            hand = this.hands[i];
            if (hand.isWin(cards)) {
                hand.win();
                win = i;
                this.bringToTop(hand);
            } else {
                hand.lose();
            }
        }
        return win;
    }
}
