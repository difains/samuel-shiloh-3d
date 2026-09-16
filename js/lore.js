/**
 * Ancient Shiloh 3D - Biblical Lore & Scripture Dialogue Manager
 * Integrates verbatim texts from Korean Revised Version (개역개정 성경: 삼상 1-4장, 삿 21장)
 * into 6 interactive landmark dialogue cards.
 */

export class LoreManager {
  constructor(controller, player) {
    this.controller = controller;
    this.player = player;

    this.landmarks = [
      {
        id: 0,
        name: '실로 성막 본전 (언약궤와 꺼지지 않은 등불)',
        verse: '사무엘상 3:3-10',
        x: 0,
        z: -6.5,
        radius: 4.8,
        title: '하나님의 등불과 여호와의 궤 앞',
        quote: '“하나님의 등불은 아직 꺼지지 아니하였으며 사무엘은 하나님의 궤 있는 여호와의 전 안에 누웠더니 여호와께서 사무엘을 부르시는지라 그가 대답하되 내가 여기 있나이다 하고” (삼상 3:3-4)',
        dialogues: [
          { speaker: '여호와 하나님', text: '사무엘아, 사무엘아!' },
          { speaker: '어린 사무엘', text: '내가 여기 있나이다... (엘리 제사장에게 달려가며) 당신이 나를 부르셨기로 내가 여기 왔나이다.' },
          { speaker: '어린 사무엘 (세 번째 부르심 후)', text: '말씀하옵소서, 주의 종이 듣겠나이다!' },
          { speaker: '여호와 하나님', text: '보라, 내가 이스라엘 중에 한 일을 행하리니 그것을 듣는 자마다 두 귀가 울리리라. 내가 엘리의 집에 대하여 말한 것을 처음부터 끝까지 그에게 다 이루리라.' }
        ],
        meditation: '모두가 잠든 어두운 밤, 하나님의 등불이 아직 꺼지지 않은 성막 안에서 하나님은 눈먼 대제사장이 아닌, 말씀 앞에 정결하게 깨어 엎드린 어린 소년 사무엘을 찾아와 부르셨습니다.'
      },
      {
        id: 1,
        name: '대제사장 엘리의 처소',
        verse: '사무엘상 3:2, 8-9, 4:18',
        x: -18.5,
        z: 14.0,
        radius: 4.8,
        title: '늙은 대제사장 엘리의 침소',
        quote: '“엘리의 눈이 점점 어두워 가서 잘 보지 못하는 그때에 그가 자기 처소에 누웠고... 엘리가 이에 여호와께서 이 아이를 부르시는 줄을 깨닫고 사무엘에게 이르되 가서 누웠다가 그가 너를 부르시거든 네가 말하기를 여호와여 말씀하옵소서 주의 종이 듣겠나이다 하라” (삼상 3:2, 8-9)',
        dialogues: [
          { speaker: '어린 사무엘', text: '제사장님, 부르셨습니까? 제가 여기 있나이다.' },
          { speaker: '대제사장 엘리', text: '내 아들아, 내가 너를 부르지 아니하였으니 다시 가서 누우라.' },
          { speaker: '대제사장 엘리 (깨달은 후)', text: '여호와께서 너를 부르시는구나. 가서 누웠다가 다시 음성이 들리거든 "여호와여 말씀하옵소서, 주의 종이 듣겠나이다" 하라.' }
        ],
        meditation: '비록 육신의 눈과 영적 감각이 어두워져 가던 늙은 엘리였지만, 세 번째에는 하나님의 섭리를 깨닫고 어린 사무엘이 하나님의 음성을 바르게 청종할 수 있도록 안내해 주었습니다.'
      },
      {
        id: 2,
        name: '한나의 서원 기도 터 (성막 문설주)',
        verse: '사무엘상 1:9-20, 2:1-2',
        x: 6.0,
        z: 22.5,
        radius: 3.8,
        title: '어머니 한나의 눈물의 서원 기도 터',
        quote: '“한나가 마음이 괴로워서 여호와께 기도하고 통곡하며 서원하여 이르되 만군의 여호와여 만일 주의 여종의 고통을 돌보시고 나를 기억하사 아들을 주시면 내가 그의 평생에 그를 여호와께 드리고 삭도를 그의 머리에 대지 아니하겠나이다” (삼상 1:10-11)',
        dialogues: [
          { speaker: '어머니 한나', text: '나는 마음이 슬픈 여자라... 여호와 앞에 내 심정을 통한 것뿐이오니, 주의 여종을 악한 여자로 여기지 마옵소서.' },
          { speaker: '대제사장 엘리', text: '평안히 가라. 이스라엘의 하나님이 네가 기도하여 구한 것을 허락하시기를 원하노라.' },
          { speaker: '한나의 찬양 (삼상 2:1-2)', text: '내 마음이 여호와로 말미암아 즐거워하며... 여호와와 같이 거룩하신 이가 없으시니 이는 주 밖에 다른 이가 없고 우리 하나님 같은 반석도 없으심이니이다.' }
        ],
        meditation: '고통과 모멸 속에서도 사람과 싸우지 않고 성막 문설주 앞에서 하나님께 모든 심정을 쏟아부었던 한나의 기도가 이스라엘의 시대를 바꾼 위대한 선지자 사무엘을 잉태케 하였습니다.'
      },
      {
        id: 3,
        name: '성막 뜰 놋 번제단과 물두멍',
        verse: '사무엘상 2:12-19',
        x: 0,
        z: 8.5,
        radius: 4.5,
        title: '성막 뜰의 놋 번제단과 세마포 에봇',
        quote: '“사무엘은 어렸을 때에 세마포 에봇을 입고 여호와 앞에서 섬겼더라 그의 어머니가 매년 드리는 제사를 드리러 그의 남편과 함께 올라올 때마다 작은 겉옷을 지어다가 그에게 주었더니” (삼상 2:18-19)',
        dialogues: [
          { speaker: '홉니와 비느하스', text: '제사장에게 구워 드릴 고기를 내라! 네가 즐겨 주지 아니하면 내가 억지로 빼앗으리라!' },
          { speaker: '성경의 증언', text: '이 소년들의 죄가 여호와 앞에 심히 큼은 그들이 여호와의 제사를 멸시함이었더라. 그러나 아이 사무엘은 세마포 에봇을 입고 여호와 앞에서 섬겼더라.' },
          { speaker: '어머니 한나', text: '사무엘아, 올 한 해도 여호와 앞에서 성결하였느냐? 네게 꼭 맞도록 정성으로 지은 작은 겉옷을 입어보아라.' }
        ],
        meditation: '엘리의 아들들이 탐욕으로 여호와의 제사를 짓밟던 그 같은 뜰에서, 어린 사무엘은 어머니가 지어준 겉옷과 순백의 세마포 에봇을 입고 거룩함을 구별하여 여호와를 섬겼습니다.'
      },
      {
        id: 4,
        name: '실로 성문과 남쪽 망루',
        verse: '사무엘상 3:19-21, 4:13',
        x: 0,
        z: 38.0,
        radius: 6.0,
        title: '실로 성문과 온 이스라엘의 선지자',
        quote: '“사무엘이 자라매 여호와께서 그와 함께 계셔서 그의 말이 하나도 땅에 떨어지지 않게 하시니 단에서부터 브엘세바까지의 온 이스라엘이 사무엘은 여호와의 선지자로 세우심을 입은 줄을 알았더라” (삼상 3:19-20)',
        dialogues: [
          { speaker: '에브라임 산지의 파수꾼', text: '보라! 벧엘과 세겜을 잇는 길을 따라 온 이스라엘 백성들이 여호와의 말씀을 듣고자 실로로 모여들고 있다!' },
          { speaker: '성경의 증언', text: '여호와의 말씀이 희귀하여 이상이 흔히 보이지 않던 시대가 끝나고, 여호와께서 실로에서 말씀으로 자기를 나타내셨더라.' }
        ],
        meditation: '성문 너머 펼쳐진 에브라임의 구릉과 황톳길을 따라, 닫혀 있던 하늘의 문이 열리고 사무엘의 말이 하나도 땅에 떨어지지 아니하는 권능의 시대가 시작되었습니다.'
      },
      {
        id: 5,
        name: '북쪽 올리브 과원과 포도원',
        verse: '사사기 21:19-21',
        x: 22.0,
        z: -26.0,
        radius: 6.0,
        title: '실로의 축제와 평화로운 올리브 언덕',
        quote: '“또 이르되 보라 벧엘 북쪽 르보나 남쪽 벧엘에서 세겜으로 올라가는 큰 길 동쪽 실로에 매년 여호와의 명절이 있도다 하고... 실로의 여자들이 춤을 추러 나오거든 너희는 포도원에서 나와서...” (삿 21:19-21)',
        dialogues: [
          { speaker: '실로의 순례자', text: '올리브 기름을 짜고 포도를 수확하는 명절마다 실로의 언덕은 기쁨의 찬양으로 물듭니다.' },
          { speaker: '어린 사무엘', text: '여호와의 성막에 바칠 가장 정결한 올리브 기름을 이 과원에서 등잔에 채웁니다. 하나님의 등불은 꺼져서는 안 되기 때문입니다.' }
        ],
        meditation: '가나안 산지의 따사로운 햇살을 머금은 올리브 열매는 으깨어져 성막을 밝히는 순결한 등불 기름이 됩니다. 하나님 앞에 자신을 온전히 드린 어린 사무엘의 삶과 같습니다.'
      }
    ];

    this.activeLandmark = null;
    this.promptEl = document.getElementById('interaction-prompt');
    this.promptNameEl = document.getElementById('prompt-target-name');
    this.locTextEl = document.getElementById('current-location-text');
    this.modalEl = document.getElementById('dialogue-modal');
    this.isModalOpen = false;

    this.initModalEvents();
  }

  initModalEvents() {
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
  }

  update() {
    const px = this.controller.position.x;
    const pz = this.controller.position.z;

    let nearest = null;
    let minDist = Infinity;

    for (let i = 0; i < this.landmarks.length; i++) {
      const lm = this.landmarks[i];
      const dx = px - lm.x;
      const dz = pz - lm.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < lm.radius && dist < minDist) {
        nearest = lm;
        minDist = dist;
      }
    }

    if (nearest !== this.activeLandmark) {
      this.activeLandmark = nearest;
      if (nearest) {
        if (this.promptEl) this.promptEl.classList.remove('hidden');
        if (this.promptNameEl) this.promptNameEl.textContent = nearest.name;
        if (this.locTextEl) this.locTextEl.textContent = nearest.name;
      } else {
        if (this.promptEl) this.promptEl.classList.add('hidden');
        if (this.locTextEl) this.locTextEl.textContent = '실로 회막 경내 탐험 중';
      }
    }
  }

  interact() {
    if (this.isModalOpen) {
      this.closeModal();
      return;
    }

    if (this.activeLandmark) {
      this.openModal(this.activeLandmark);
    }
  }

  openModal(lm) {
    this.isModalOpen = true;
    document.getElementById('modal-verse-tag').textContent = lm.verse;
    document.getElementById('modal-title').textContent = lm.title;
    document.getElementById('modal-quote').textContent = lm.quote;

    const bodyEl = document.getElementById('modal-body');
    bodyEl.innerHTML = '';
    lm.dialogues.forEach(d => {
      const block = document.createElement('div');
      block.className = 'dialogue-speaker-block';
      block.innerHTML = `
        <div class="speaker-name">${d.speaker}</div>
        <div class="speaker-dialogue">${d.text}</div>
      `;
      bodyEl.appendChild(block);
    });

    document.getElementById('modal-meditation').textContent = lm.meditation;
    this.modalEl.classList.remove('hidden');
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalEl.classList.add('hidden');
  }
}
