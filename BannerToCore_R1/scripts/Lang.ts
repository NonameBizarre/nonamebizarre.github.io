/**
 * Created by DEaDA on 6/9/17.
 */

module mygame {
    export class Lang {
        private static instance: Lang;

        private constructor() {
        }

        static get Instance() {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Lang();
            }
            return this.instance;
        }
        public static loc:string = 'ru';

        public CHOOSE: Object = {en: 'CHOOSE', ru: 'ВЫБРАТЬ'};
        public HINT: Object = {en: 'CHOOSE THE BEST COMBINATION:', ru: 'ВЫБЕРИТЕ ЛУЧШУЮ КОМБИНАЦИЮ:'};
        public POT: Object = {en: 'POT:', ru: 'БАНК:'};
        public BALANCE: Object = {en: 'BALANCE:', ru: 'ВАШ БАЛАНС:'};
        public YOU_WIN: Object = {en: 'YOU WIN', ru: 'ВЫ ВЫИГРАЛИ'};

        public STRAIGHT: Object = {en: 'STRAIGHT', ru: 'СТРИТ'};
        public FLUSH_ROYAL: Object = {en: 'FLUSH ROYAL', ru: 'РОЯЛ-ФЛЕШ'};
        public THREE_OF_A_KIND: Object = {en: 'THREE OF A KIND', ru: 'СЕТ'};
        public FULL_HOUSE: Object = {en: 'FULL HOUSE', ru: 'ФУЛЛ-ХАУС'};
        public STRAIGHT_FLUSH: Object = {en: 'STRAIGHT FLUSH', ru: 'СТРИТ-ФЛЕШ'};
        public FLUSH: Object = {en: 'FLUSH', ru: 'ФЛЕШ'};
        public PAIR: Object = {en: 'PAIR', ru: 'ПАРА'};
        public FOUR_OF_A_KIND: Object = {en: 'FOUR OF A KIND', ru: 'КАРЕ'};

        public PLAYHINT: Object = {en: 'PLAY', ru: 'ИГРАТЬ'};
        public LIKE: Object = {en: 'LIKE POKER?', ru: 'НРАВИТСЯ ПОКЕР?'};
        public GETAPP: Object = {
            en: 'GET ON A NEW LEVEL WITH THIS APP!',
            ru: 'ЛУЧШИЙ ПОКЕР В МИРЕ!'
        };
        public GAMENAME: Object = {
            en: 'Pokerist: Texas Holdem Poker Online!',
            ru: 'Pokerist: Техасский Покер Онлайн!'
        };
        public COPYRIGHT: Object = {en: 'By KamaGames', ru: 'KamaGames'};


    }
}
