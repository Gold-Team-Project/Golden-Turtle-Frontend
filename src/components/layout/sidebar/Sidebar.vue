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

    <!-- 보유 현황 -->
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

    <!-- 현재 순위 -->
    <div>
      <p class="section-title-bold">현재 순위</p>

      <div class="card-panel ranking-panel">

        <div
            v-for="rankItem in rankStore.getDisplayRanking"
            :key="rankItem.sessionId"
        >

          <!-- rankItem은 separator가 없음 → 바로 출력 -->
          <div
              class="rank-item"
              :class="{
              'rank-low': rankItem.rank > 3,
              [rankStore.rankAnimation]:
                rankStore.mySessionId &&
                rankItem.sessionId === rankStore.mySessionId
            }"
          >
            <div class="rank-left-col">
              <span v-if="rankItem.rank === 1">🥇</span>
              <span v-else-if="rankItem.rank === 2">🥈</span>
              <span v-else-if="rankItem.rank === 3">🥉</span>
              <span v-else class="rank-number">{{ rankItem.rank }}등</span>

              <span class="rank-nickname">
                {{ rankItem.nickname }}

                <span
                    v-if="rankItem.isMe"
                    class="me-badge"
                    style="color: #2ecc71; font-weight: bold; margin-left: 5px;"
                >
                  (나)
                </span>
              </span>
            </div>

            <div class="rank-money">
              $ {{ formatNumber(rankItem.totalAsset) }}
            </div>
          </div>

        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CommonButton from "@/components/common/button/CommonButton.vue";
import "@/assets/sidebar/Sidebar.css";
import api from "@/api/axios";
import { useRankStore } from "@/stores/rank.js";

const emit = defineEmits(["open-modal"]);
const rankStore = useRankStore();

const isGameActive = ref(false);
const sessionId = ref(null);

const formatNumber = (n) => n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? "0";

// 타이머
const totalSeconds = ref(600);
const timer = ref("00 : 10 : 00");
let timerInterval = null;

const formatTime = (sec) =>
    `${String(Math.floor(sec / 3600)).padStart(2, "0")} : ` +
    `${String(Math.floor((sec % 3600) / 60)).padStart(2, "0")} : ` +
    `${String(sec % 60).padStart(2, "0")}`;

const startCountdown = () => {
  timerInterval = setInterval(() => {
    if (totalSeconds.value <= 0) {
      clearInterval(timerInterval);
      endGame();
      return;
    }
    totalSeconds.value--;
    timer.value = formatTime(totalSeconds.value);
  }, 1000);
};

const startGame = async () => {
  try {
    const res = await api.post(`/api/v1/game-session/start`);
    sessionId.value = res.data.data;
    console.log("세션 ID 발급:", sessionId.value);

    isGameActive.value = true;
    totalSeconds.value = 600;
    timer.value = formatTime(600);
    startCountdown();

    // STOMP 연결 + 내 sessionId 설정
    rankStore.connectStomp(sessionId.value);

  } catch (e) {
    console.error("게임 시작 실패", e);
  }
};

const endGame = async () => {
  try {
    const res = await api.post(`/api/v1/game-session/end`);
    emit("open-modal", res.data.data);

    clearInterval(timerInterval);
    totalSeconds.value = 600;
    timer.value = formatTime(600);
    isGameActive.value = false;
  } catch (e) {
    console.error("게임 종료 실패", e);
  }
};

const emitEnd = () => endGame();

// 더미 데이터 (API 완성 시 제거)
const holdings = ref([
  { id: 1, name: "엔비디아", ticker: "NVDA", quantity: 20, avgPrice: "172.80" },
  { id: 2, name: "엔비디아", ticker: "NVDA", quantity: 20, avgPrice: "172.80" },
]);

onMounted(() => {
  rankStore.loadRanking(api);
});
</script>
