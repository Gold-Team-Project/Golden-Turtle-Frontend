<template>
  <aside class="sidebar-wrapper">

    <div>
      <div class="card-panel timer-panel">
        <div class="timer-text">{{ timer }}</div>

        <div class="button-row">
          <CommonButton
              :buttonClass="isGameActive ? 'btn-disabled' : 'btn-green'"
              :disabled="isGameActive"
              @click="!isGameActive && startGame()"
          >
            시작
          </CommonButton>
          <CommonButton
              :buttonClass="isGameActive ? 'btn-red' : 'btn-disabled'"
              :disabled="!isGameActive"
              @click="emitEnd"
          >
            종료
          </CommonButton>

        </div>
      </div>

      <p class="section-title-bold">잔고</p>
      <div class="card-panel balance-panel">
        $10,000
      </div>
    </div>

    <div class="sidebar-middle">
      <p class="section-title-bold">보유 현황</p>

      <div class="card-panel holding-panel">
        <div class="holding-header">
          <span>종목명</span>
          <span>수량</span>
          <span>평균단가</span>
        </div>

        <div
            v-for="item in holdings"
            :key="item.id"
            class="holding-row"
        >
          <div>
            <p class="holding-name">{{ item.name }}</p>
            <p class="holding-ticker">{{ item.ticker }}</p>
          </div>

          <p class="holding-mid">{{ item.quantity }}</p>
          <p class="holding-price-final">$ {{ item.avgPrice }}</p>
        </div>
      </div>
    </div>

    <div>
      <p class="section-title-bold">현재 순위</p>

      <div class="card-panel ranking-panel">
        <div
            v-for="rank in ranking.slice(0, 3)"
            :key="rank.rank"
            class="rank-item"
        >
          <div>
            <span v-if="rank.rank === 1">🥇</span>
            <span v-else-if="rank.rank === 2">🥈</span>
            <span v-else-if="rank.rank === 3">🥉</span>
            <span>{{ rank.nickname }}</span>
          </div>

          <div class="rank-money">
            $ {{ rank.total }}
          </div>
        </div>

        <div class="rank-dots">•••</div>

        <div
            v-for="rank in ranking.slice(3)"
            :key="rank.rank"
            class="rank-item rank-low"
        >
          <p>{{ rank.rank }}등 {{ rank.nickname }}</p>
          <p>$ {{ rank.total }}</p>
        </div>
      </div>
    </div>

  </aside>
</template>

<script setup>
import { ref } from "vue"
import CommonButton from "@/components/common/button/CommonButton.vue"
import "@/assets/sidebar/Sidebar.css"
import api from "@/api/axios";
const emit = defineEmits(["open-modal"])
const isGameActive = ref(false)
const userId = 1;

// ========= TIMER ==========
const totalSeconds = ref(600); // 10분 = 600초
const timer = ref("00 : 10 : 00");
let timerInterval = null;

const formatTime = (sec) => {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h} : ${m} : ${s}`;
}

const startCountdown = () => {
  if (timerInterval) return; // 중복 방지

  timerInterval = setInterval(() => {
    if (totalSeconds.value <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      endGame(); // 시간 끝나면 자동 종료
      return;
    }

    totalSeconds.value--;
    timer.value = formatTime(totalSeconds.value);
  }, 1000);
};


// ========= START GAME ==========
const startGame = async () => {
  try {
    const res = await api.post(`/api/v1/game-session/start`)
    console.log("게임 시작 성공, sessionId:", res.data)

    isGameActive.value = true  // 🔥 시작 버튼 비활성화
    totalSeconds.value = 600
    timer.value = formatTime(600)
    startCountdown()

  } catch (e) {
    console.error("게임 시작 실패", e)
  }
}
// ========= END GAME (API 호출) ==========
const endGame = async () => {
  try {
    const res = await api.post(`/api/v1/game-session/end`)
    console.log("게임 종료 응답:", res.data)

    const result = res.data.data;

    clearInterval(timerInterval)
    timerInterval = null

    totalSeconds.value = 600
    timer.value = formatTime(600)

    isGameActive.value = false  // 🔥 시작 버튼 다시 활성화

    emit("open-modal", result)

  } catch (e) {
    console.error("게임 종료 실패", e)
  }
}

// 종료 버튼 클릭 시
const emitEnd = () => {
  endGame();
};

// Mock 화면용 데이터
const holdings = ref([
  { id: 1, name: "엔비디아", ticker: "NVDA", quantity: 20, avgPrice: "172.80" },
  { id: 2, name: "엔비디아", ticker: "NVDA", quantity: 20, avgPrice: "172.80" }
])

const ranking = ref([
  { rank: 1, nickname: "최지원", total: "11,350,000" },
  { rank: 2, nickname: "박규진", total: "11,340,000" },
  { rank: 3, nickname: "김진", total: "9,340,000" },
  { rank: 455, nickname: "강성현", total: "340,000" },
  { rank: 456, nickname: "정동욱", total: "240,000" },
  { rank: 457, nickname: "야무께", total: "140,000" },
])
</script>


<style scoped>
</style>
