function sdvx() {
    function constructer() {
        this.mein = { body: null, ele: null, userIOEle: null };
        this.controller = {};
        this.audios = {};
        this.sub = { eles: null };
        this.status = {};
    };

    constructer.prototype.init = function () {
        let self = this;
        self.mein.body = document.body;
        self.mein.ele = document.querySelector('body div.mein');
        self.mein.ele.children[0].remove();
        self.audios.music = document.querySelector('div.player div.right div.bottom > audio');
        self.audios.sfxBseFolder = './sfx/';
        self.audios.musicBseFolder = './musics/';
        self.audios.music.src = self.audios.musicBseFolder + 'title_bgm.mp3';
        self.audios.music.loop = true;
        self.audios.sfx = document.createElement('audio');
        self.audios.sfx.autoplay = true;
        self.mein.body.appendChild(self.audios.sfx);
        self.status.log = [];
        self.status.log.push('scrOK');
        self.initDom();
    }
    constructer.prototype.initDom = function () {
        let self = this;
        self.mein.ele.classList.add('afterInit');
        let _meinImg = document.createElement('img');
        _meinImg.src = './imgs/standby.jpg';
        _meinImg.alt = "standby";

        let _selecter = document.createElement('div');
        _selecter.className = 'selecter';
        let _selecterImg = document.createElement('img');
        _selecterImg.src = './imgs/standby_cur.png';
        _selecterImg.alt = "standby_cur";
        _selecterImg.id = 'cur';
        _selecterImg.dataset.index = 0;
        _selecter.appendChild(_selecterImg);

        //controller_Sdvx
        self.mein.userIOEle = document.createElement('div');
        self.mein.userIOEle.className = 'controller_Sdvx';
        let list = ['top', 'mid', 'bott'];
        let items = [['knobL', 'st', 'knobR'], ['S', 'D', 'K', 'L'], ['L', 'R']]
        list.forEach((e, i) => {
            table = document.createElement('table');
            table.className = 'controller_' + e;
            tr = document.createElement('tr');
            if (items[i]) {

                for (let j = 0; j < items[i].length; j++) {
                    td = document.createElement('td');
                    inp = document.createElement('input');
                    switch (j) {
                        case 0:
                            if (i == 0) {
                                inp.type = 'text';
                                inp.className = items[i][j];
                            } else if (i == 1) {
                                inp = document.createElement('button');
                                inp.innerText = items[i][j];
                                inp.id = items[i][j];
                                inp.className = 'chip';
                            } else if (i == 2) {
                                inp = document.createElement('button');
                                inp.innerText = items[i][j];
                                inp.className = 'bar';
                            }

                            break;
                        case 1:
                            inp = document.createElement('button');
                            if (i == 0) {

                                inp.innerText = items[i][j];
                                inp.className = items[i][j];
                            } else if (i == 1) {
                                inp.innerText = items[i][j];
                                inp.id = items[i][j];
                                inp.className = 'chip';

                            } else if (i == 2) {
                                inp.innerText = items[i][j];
                                inp.className = 'bar';
                            }
                            break;
                        case 2:
                            if (i == 0) {
                                inp = document.createElement('input');
                                inp.type = 'text';
                                inp.className = items[i][j];
                            } else if (i == 1) {
                                inp = document.createElement('button');
                                inp.innerText = items[i][j];
                                inp.id = items[i][j];
                                inp.className = 'chip';
                            }
                            break;
                        case 3:
                            inp = document.createElement('button');
                            if (i == 1) {
                                inp.innerText = items[i][j];
                                inp.id = items[i][j];
                                inp.className = 'chip';
                            }
                    }
                    td.appendChild(inp);
                    tr.appendChild(td)
                }


            }

            table.appendChild(tr);
            self.mein.userIOEle.appendChild(table);
        });
        self.status.log.push('keyOK');
        let _knobsetup = {
            "width": 65,
            "height": 65,
            "fgColor": "#FFFFFF",
            "bgColor": '#9AF6FD',
            "cursor": 20,
            "displayInput": false,
            "thickness": 0.3,
        }
        $(SDVXModule.mein.userIOEle).find("input.knobL").knob(_knobsetup);
        _knobsetup.bgColor = '#FE8DB7';
        $(SDVXModule.mein.userIOEle).find("input.knobR").knob(_knobsetup);
        //dom init done;
        self.mein.ele.append(_meinImg, _selecter);
        self.mein.ele.insertAdjacentElement(insertAdjacentElePos[3], self.mein.userIOEle)
        self.sub.eles = [];
        self.sub.eles.push(_selecterImg);
        self.status.now = 'title';

        let pressKnob = (LR) => {
            //0 : L, 1: R 
            if (self.status.now == 'title') {
                self.audios.sfx.src = self.audios.sfxBseFolder + 'title_sel.mp3';
            }
        };
        $(SDVXModule.mein.userIOEle).find("input.knobL").on("pressL", () => pressKnob(0));
        $(SDVXModule.mein.userIOEle).find("input.knobL").on("pressR", () => pressKnob(1));
        $(SDVXModule.mein.userIOEle).find("input.knobR").on("pressL", () => pressKnob(0));
        $(SDVXModule.mein.userIOEle).find("input.knobR").on("pressR", () => pressKnob(1));

        document.querySelector("div.controller_Sdvx button.st").onclick = () => {
            if (self.status.now == 'title') {
                self.audios.sfx.src = self.audios.sfxBseFolder + 'title_enter.mp3';
            }
        };
        ['s', 'd', 'k', 'l'].forEach((e, i) => {
            document.querySelector("div.controller_Sdvx button.chip#" + e.toUpperCase()).onclick = () => {
                if (self.status.now == 'title') {
                    self.audios.sfx.src = self.audios.sfxBseFolder + 'tick.mp3';
                }
            }
        });
        self.status.log.push('keyEventRdy');
        self.initApp();
    };
    constructer.prototype.initApp = function () {
        let self = this;

        window.addEventListener("keydown", e => self.onkeypress(e));
    };

    constructer.prototype.onkeypress = function (e) {
        let self = this;
        switch (e.key) {
            case 'Enter':
                $(SDVXModule.mein.userIOEle).find("button.st").click()
                break;
            /* knobs */
            //L
            case 'o':
                $(SDVXModule.mein.userIOEle).find("input.knobR").trigger('pressL');
                break;
            case 'p':
                $(SDVXModule.mein.userIOEle).find("input.knobR").trigger('pressR');
                break;
            //R
            case 'q':
                $(SDVXModule.mein.userIOEle).find("input.knobL").trigger('pressL');
                break;
            case 'w':
                $(SDVXModule.mein.userIOEle).find("input.knobL").trigger('pressR');
                break;
            /* buttons */
            case 's':
                $(SDVXModule.mein.userIOEle).find("button.chip#S").click()
                break;
            case 'd':
                $(SDVXModule.mein.userIOEle).find("button.chip#D").click()
                break;
            case 'k':
                $(SDVXModule.mein.userIOEle).find("button.chip#K").click()
                break;
            case 'l':
                $(SDVXModule.mein.userIOEle).find("button.chip#L").click()
                break;
            default:
                console.log(e);
                break;
        }
        //const key = document.getElementById(e.key);
        //if (key) key.classList.add('pressed');

    }
    return constructer;
}