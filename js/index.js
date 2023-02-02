class Unit {
    constructor(name, hitPoints, damageRange, armor, attackSpeed, icon, mainImg) {
        this.name = name;
        this.maxHitPoints = hitPoints;
        this.hitPoints = hitPoints;
        this.damageRange = damageRange;
        this.armor = armor;
        this.attackSpeed = attackSpeed;
        const oneSecond = 1000;
        const numberToRound = 2;
        this.attackRate = Number((oneSecond / attackSpeed).toFixed(numberToRound));
        this.icon = icon;
        this.mainImg = mainImg;
    }

    dealDamage(enemy) {
        const sixPercent = 0.06;
        const dmgReduction = enemy.armor * sixPercent / (1 + enemy.armor * sixPercent);
        const hitDamage = Math.floor(Math.random() * (this.damageRange[1] - this.damageRange[0] + 1))
            + this.damageRange[0];
        const hitDamageDueToArmor = Number(((1 - dmgReduction) * hitDamage).toFixed(0));
        const hpAfterHit = Number((enemy.hitPoints - hitDamageDueToArmor).toFixed(0));
        enemy.hitPoints = hpAfterHit >= 0 ? hpAfterHit : 0;

        Display.updateBattleField(enemy);
    }

    setSpeed() {
        return new Promise(resolve => setTimeout(resolve, this.attackSpeed));
    }
}

class Display {
    static addCharacterToList(unit) {
        let characterContainer = document.createElement('div');
        let charactersList = document.querySelector('.characters-list');
        charactersList.appendChild(characterContainer);

        let characterIcon = document.createElement('img');
        characterIcon.src = unit.icon;
        characterContainer.appendChild(characterIcon);

        let characterName = document.createElement('h2');
        characterName.textContent = unit.name;
        characterContainer.appendChild(characterName);
    }

    static showCharactersList(unitsToShow) {
        alert('Choose your fighter');
        unitsToShow.forEach(unit => this.addCharacterToList(unit));
        let startBtn = document.querySelector('.start');
        startBtn.classList.add('hidden');
    }

    static clearCharactersList() {
        let charactersList = document.querySelector('.characters-list');
        charactersList.textContent = '';
    }

    static createBattleCard(character) {
        let characterContainer = document.createElement('div');
        characterContainer.classList.add('battle-character');

        let characterImg = document.createElement('img');
        characterImg.src = character.icon;

        let characterHealthInfo = document.createElement('div');
        let characterHealthBar = document.createElement('div');
        characterHealthBar.classList.add('hp-bar');
        let characterHealthPoints = document.createElement('p');
        characterHealthPoints.textContent = character.hitPoints;
        characterHealthInfo.append(characterHealthBar, characterHealthPoints);

        let characterInfo = document.createElement('div');
        characterInfo.classList.add('character-info');
        let characterDMG = document.createElement('p');
        characterDMG.innerHTML = `<span>Damage range:</span> ${character.damageRange[0]} - ${character.damageRange[1]}`;
        let characterArmor = document.createElement('p');
        characterArmor.innerHTML = `<span>Armor:</span> ${character.armor}`;
        let characterAtkRate = document.createElement('p');
        characterAtkRate.innerHTML = `<span>Attack rate:</span> ${character.attackRate}`;
        characterInfo.append(characterDMG, characterArmor, characterAtkRate);
        
        characterContainer.append(characterImg, characterHealthInfo, characterInfo);
        return characterContainer;
    }

    static showBattleFiled(character, enemy) {
        let characterCard = this.createBattleCard(character);
        let enemyCard = this.createBattleCard(enemy);

        let cardsContainer = document.createElement('div');
        cardsContainer.classList.add('cards-container');
        cardsContainer.append(characterCard, enemyCard);

        let battleField = document.querySelector('.battle-field');
        battleField.appendChild(cardsContainer);
    }

    static updateBattleField(character) {
        let battleField = document.querySelector('.battle-field');
        let characterImg = battleField.querySelector(`img[src='${character.mainImg}']`);
        let characterContainer = characterImg.parentElement;
        let healthBar = characterContainer.querySelector(`.hp-bar`);
        let healthPoints = healthBar.parentElement.querySelector('p');
        const maxHpPercentage = 100;
        let hpPercentage = character.hitPoints * maxHpPercentage / character.maxHitPoints;
        healthBar.style.width = `${hpPercentage}%`;
        healthPoints.textContent = character.hitPoints;
    }

    static setUnitImg(unit, rotate) {
        let battleField = document.querySelector('.battle-field');
        let unitImg = battleField.querySelector(`img[src='${unit.icon}']`);
        unitImg.src = unit.mainImg;
        if (rotate) {
            unitImg.style.transform = 'rotateY(180deg)';
        }
    }
}

class Game {
    constructor() {
        // eslint-disable-next-line no-magic-numbers
        this.footman = new Unit('Footman', 420, [12, 13], 2, 1350,
            'https://static.wikia.nocookie.net/wowpedia/images/3/3a/BTNFootman-Reforged.png',
            'https://static.wikia.nocookie.net/wowpedia/images/1/16/Footman.gif');
        // eslint-disable-next-line no-magic-numbers
        this.trollHeadhunter = new Unit('Troll Headhunter', 375, [23, 27], 0, 2310,
            'https://static.wikia.nocookie.net/wowpedia/images/c/c6/BTNHeadhunter-Reforged.png',
            'https://static.wikia.nocookie.net/wowpedia/images/c/c1/TrollHeadhunter.gif');
        // eslint-disable-next-line no-magic-numbers
        this.knight = new Unit('Knight', 885, [30, 38], 5, 1400,
            'https://static.wikia.nocookie.net/wowpedia/images/3/38/BTNKnight-Reforged.png',
            'https://static.wikia.nocookie.net/wowpedia/images/0/09/Wc3Knight.gif');
        // eslint-disable-next-line no-magic-numbers
        this.abomination = new Unit('Abomination', 1175, [33, 39], 2, 1900,
            'https://static.wikia.nocookie.net/wowpedia/images/f/f7/BTNAbomination-Reforged.png',
            'https://static.wikia.nocookie.net/wowpedia/images/0/0b/Abomination.gif');
        // eslint-disable-next-line no-magic-numbers
        this.treant = new Unit('Treant', 300, [15, 17], 0, 1750,
            'https://static.wikia.nocookie.net/wowpedia/images/c/c7/BTNEnt-Reforged.png',
            'https://static.wikia.nocookie.net/wowpedia/images/7/7f/Ent.gif');
        // eslint-disable-next-line no-magic-numbers
        this.keeperOfTheGrove = new Unit('Keeper of the Grove', 500, [20, 26], 3, 1680,
            'https://static.wikia.nocookie.net/wowpedia/images/4/42/BTNKeeperOfTheGrove-Reforged.png',
            'https://static.wikia.nocookie.net/wowpedia/images/a/a8/KGWC3.jpg');
        // eslint-disable-next-line no-magic-numbers
        this.goblinShredder = new Unit('Goblin Shredder ', 600, [34, 61], 3, 1400,
            'https://static.wikia.nocookie.net/wowpedia/images/2/26/BTNGoblinShredder-Reforged.png',
            'https://static.wikia.nocookie.net/wowpedia/images/4/4f/WC3shredder.gif');
        // eslint-disable-next-line no-magic-numbers
        this.hippogryph = new Unit('Hippogryph', 525, [50, 57], 0, 1050,
            'https://static.wikia.nocookie.net/wowpedia/images/1/12/BTNHippogriff-Reforged.png',
            'https://static.wikia.nocookie.net/wowpedia/images/f/f3/Hippogryph.gif');
        // eslint-disable-next-line no-magic-numbers
        this.phoenix = new Unit('Phoenix', 1250, [61, 75], 1, 1400,
            'https://static.wikia.nocookie.net/wowpedia/images/2/2b/BTNPhoenix.png',
            'https://static.wikia.nocookie.net/wowpedia/images/6/62/Phoenix_warcraft_III.gif');

        this.allCharacters = [this.footman, this.trollHeadhunter, this.knight, this.abomination, this.treant,
            this.keeperOfTheGrove, this.goblinShredder, this.hippogryph, this.phoenix];
    }

    async generateMoves(character, enemy) {
        while (enemy.hitPoints > 0 && character.hitPoints > 0) {
            await character.dealDamage(enemy);
            if (enemy.hitPoints > 0 && character.hitPoints > 0) {
                await character.setSpeed();
            }
        }
        return character;
    }

    startFight() {
        Display.setUnitImg(this.usersCharacter, false);
        Display.setUnitImg(this.randomCharacter, true);

        let fightBtn = document.querySelector('.fight');
        fightBtn.classList.add('hidden');

        const oneSecond = 1000;
        setTimeout(() => {
            Promise.all([this.generateMoves(this.usersCharacter, this.randomCharacter),
                this.generateMoves(this.randomCharacter, this.usersCharacter)]).then((characters) => {
                    characters.forEach(character => {
                        if (character.hitPoints > 0) {
                            alert(`${character.name} win!`);
                        }
                    });
                    window.location.reload();
                });
        }, oneSecond);
    }

    setBattleUnits() {
        let charactersList = document.querySelector('.characters-list');
        [...charactersList.childNodes].forEach(unit => {
            unit.addEventListener('click', () => {
                let selectedCharacter = unit;
                this.usersCharacter = this.allCharacters.filter(character =>
                    character.name === selectedCharacter.getElementsByTagName('h2')[0].innerHTML)[0];
                let charactersLeft = this.allCharacters.filter(character =>
                    character.name !== this.usersCharacter.name);
                this.randomCharacter = charactersLeft[Math.floor(Math.random() * charactersLeft.length)];
                Display.clearCharactersList();
                let fightBtn = document.querySelector('.fight');
                fightBtn.classList.remove('hidden');
                Display.showBattleFiled(this.usersCharacter, this.randomCharacter);
            });
        });
    }

    startGame() {
        let startBtn = document.querySelector('.start');
        startBtn.addEventListener('click', () => {
            Display.showCharactersList(this.allCharacters);
            this.setBattleUnits();
        });
        let fightBtn = document.querySelector('.fight');
        fightBtn.addEventListener('click', () => this.startFight());
    }
}

let newGame = new Game();
newGame.startGame();