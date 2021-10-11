/*const frequencies = [
      25, 31, 40, 50, 63, 80, 100, 125, 160, 200,
      250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000,
      2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000
    ];*/
const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
var filters = null;
var inputs = [];
var filterOut = null;

function filterReset(typeChange) {
    if (filters) {
        filters.forEach((c, i) => {
            c.gain.value = 0;
            // if (typeChange) {
            //     c.type = 'allpass';
            // }
            inputs[i].value = 0;
        });
        $('.knob1, .knob2').val(1).trigger('change');
        document.querySelector('label#Q-value').innerText = 1;
        document.querySelector('label#Vol-value').innerText = 100 + "%";
        inputNode.gain.value = 1;
    }
};

function initEQM() {
    audioContext = audioContext ? audioContext : new AudioContext();
    audioDOM = audioDOM ? audioDOM : document.getElementById('my-audio');
    sourceNode = sourceNode ? sourceNode : audioContext.createMediaElementSource(audioDOM);
    inputNode = inputNode ? inputNode : audioContext.createGain();
    sourceNode.connect(inputNode);
};

function gendomV2() {
    let eqW = document.createElement('div');
    eqW.className = 'equalizer';
    let eq_container = document.createElement('div');
    eq_container.id = 'eq';
    eqW.appendChild(eq_container);
    document.body.appendChild(eqW);

    let table = document.createElement('table');
    let controler = document.createElement('tr');
    controler.className = 'controler';
    let desc = document.createElement('tr');
    desc.className = 'desc';

    frequencies.forEach(function (f) {
        td = document.createElement('td');
        var input = document.createElement('input');
        Object.assign(input, {
            type: 'range',
            min: -10,
            max: 10,
            value: 0,
            step: 0.1,
            title: f
        });
        td.appendChild(input);
        controler.appendChild(td);
        info = document.createElement('td');
        info.id = 'hz';
        info.innerText = (f >= 1e3 ? (f / 1e3) + 'k' : f) + 'hz';
        desc.appendChild(info);
        inputs.push(input);
    });
    let master = document.createElement('td');
    master.id = 'master';
    master.rowSpan = 2;
    master.colSpan = 2;
    let m0 = document.createElement('tr');
    m0_td1 = document.createElement('td');
    m0_td2 = document.createElement('td');
    let a = document.createElement('a');
    a.id = 'Q';
    a.innerText = 'Q';
    a.href = 'https://en.wikipedia.org/wiki/Q_factor';
    a.target = '_blank';
    m0_td1.appendChild(a);
    let m1 = document.createElement('tr');
    let m2 = document.createElement('tr');
    let m3 = document.createElement('tr');
    let m4 = document.createElement('tr');
    btn = document.createElement('button');
    btn.innerText = 'R';
    btn.id = 'reset';
    btn.onclick = () => filterReset();
    m4.appendChild(btn);
    let kdisp1 = document.createElement('label');
    kdisp1.id = 'Q-value';
    kdisp1.innerText = 1;
    m0_td2.appendChild(kdisp1);
    m0.append(m0_td1, m0_td2);

    vol = () => {
        m2_td1 = document.createElement('td');
        m2_td2 = document.createElement('td');
        let a = document.createElement('a');
        a.id = 'Vol';
        a.innerText = 'Vol';
        a.href = 'https://en.wikipedia.org/wiki/Loudness';
        a.target = '_blank';
        m2_td1.appendChild(a);

        let kdisp2 = document.createElement('label');
        kdisp2.id = 'Vol-value';
        kdisp2.innerText = 1;
        m2_td2.appendChild(kdisp2);
        m2.append(m2_td1, m2_td2);

    }
    vol();
    m1.title = 'Set Q factor of EQ';
    m3.title = 'set Volume(Loudness) of Master';
    m4.title = 'Reset EQ';

    let knob1 = document.createElement('input');
    knob1.type = 'text';
    knob1.value = 1;
    knob1.className = 'knob1';
    m1.appendChild(knob1);

    let knob2 = document.createElement('input');
    knob2.type = 'text';
    knob2.value = 1;
    knob2.className = 'knob2';
    m3.appendChild(knob2);
    master.append(m0, m1, m2, m3, m4);
    controler.append(master);
    table.append(controler, desc);

    eq_container.appendChild(table);
    setup = {
        step: 0.1,
        max: 10,
        min: 1,
        width: 50,
        height: 50,
        fgColor:'#44BFA3'
    }
    setup.change = (v) => {
        filters.forEach(k => {
            k.Q.value = v;
        });
        document.querySelector('#master #Q-value').innerText = parseInt(v);
    }
    $(".knob1").knob(setup);
    setup.max = 1;
    setup.min = 0;
    setup.change = (v) => {
        inputNode.gain.value = v;
        document.querySelector('#master #Vol-value').innerText = parseInt(v * 100)+1 + '%';
    }
    
    $(".knob2").knob(setup);
    coverOn(eq_container, 'click the Play Button');
}
function connect(cbf) {
    console.log('EQ on')
    filters = frequencies.map((frequency, index, array) => {
        const filterNode = audioContext.createBiquadFilter();
        filterNode.gain.value = 0;
        filterNode.Q.value = 1;
        filterNode.frequency.setValueAtTime(frequency, audioContext.currentTime);

        if (index === 0) {
            filterNode.type = 'lowshelf';
        }
        else if (index === array.length - 1) {
            filterNode.type = 'highshelf';
        }
        else {
            filterNode.type = 'peaking';
        }

        return filterNode;
    });


    filters.reduce((prev, current, i) => {
        console.log('EQ Channel connecting...', (i + 1) * 10 + '%')
        prev.connect(current);
        return current;
    }, inputNode);
    filterOut = sourceNode.context.createGain();
    filters[filters.length - 1].connect(filterOut);
    cbf(filterOut);

    var onChange = function (e) {
        filters[frequencies.indexOf(parseInt(e.target.title))].gain.value = parseInt(e.target.value);
    };
    document.querySelector('#eq').childNodes.forEach((input) => {
        input.addEventListener('input', onChange);
        input.addEventListener('change', onChange);
    });
}
function eqBtnClick(){
  document.querySelector('#eq #cover').remove();
  sourceNode.disconnect(analyser);
  connect((node) => {
    node.connect(analyser);
  });
}