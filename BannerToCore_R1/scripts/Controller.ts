/**
 * Created by User on 5/21/2017.
 */
module mygame {
    export class Controller {
        private static instance: Controller;
        public balance: number = 500;
        public dealTime: number = 5;
        public playerMoney: number = 3000;
        private game;
        public soundsEnabled = true;
        public width: number = 1280;
        public height: number = 720;
        private table: UITable;

        public static LANDSCAPE: String = "landscape";
        public static PORTRAIT: String = "portrait";

        public orientation: String = Controller.LANDSCAPE;

        private constructor() {
        }

        static get Instance() {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Controller();
            }
            return this.instance;
        }

        playSound(soundName) {
            if (this.soundsEnabled) {
            }
        }

        public addTable(game, table) {
            this.game = game;
            this.table = table;
        }

        public reset(){
            this.balance = 500;
            this.playerMoney = 3000;

        }

        public selectHand(id) {
            this.table.selectTable(id);
        }
    }
}