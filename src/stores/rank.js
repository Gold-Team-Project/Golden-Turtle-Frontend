import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "./auth"; // auth 스토어 임포트


export const useRankStore = defineStore("rank", () => {
    const ranking = ref([]);
    const lastRank = ref(null);
    const rankAnimation = ref("");

    // 고유 ID — 닉네임 대신 sessionId로 나를 식별
    const mySessionId = ref(null);

    let stompClient = null;

    // 화면 출력용 Getter (정렬만!)
    const getDisplayRanking = computed(() => {
        if (!ranking.value || ranking.value.length === 0) return [];
        return [...ranking.value].sort((a, b) => a.rank - b.rank);
    });

    // 실시간 랭킹 적용 (백엔드 조합 리스트 그대로 사용)
    const applyRealtimeRank = (dataList) => {
        if (!Array.isArray(dataList)) {
            console.error("[RANK] 배열이 아닌 데이터:", dataList);
            return;
        }

        // 애니메이션 처리 — newItem 중 isMe만 체크
        const myData = dataList.find((r) => r.sessionId === mySessionId.value);
        if (myData) {
            animateRankChange(myData.rank);
        }

        // 백엔드가 이미 정렬된 완성 리스트를 보내므로 그대로 사용
        ranking.value = dataList;
    };

    // 애니메이션 처리
    const animateRankChange = (newRank) => {
        if (lastRank.value === null) {
            lastRank.value = newRank;
            return;
        }
        if (newRank < lastRank.value) {
            rankAnimation.value = "rank-up-animation";
        } else if (newRank > lastRank.value) {
            rankAnimation.value = "rank-down-animation";
        }

        setTimeout(() => {
            rankAnimation.value = "";
        }, 1000);

        lastRank.value = newRank;
    };

    // STOMP 연결
    const connectStomp = (sessionId) => {
        mySessionId.value = sessionId;
        console.log("🔑 [RANK] 내 식별 세션 ID:", mySessionId.value);

        if (stompClient) {
            stompClient.deactivate();
        }

        const authStore = useAuthStore();
        if (!authStore.accessToken) {
            console.error("[STOMP] 랭킹 소켓 연결 실패: 인증 토큰이 없습니다.");
            // TODO: 로그인 페이지로 리다이렉트하거나 사용자에게 로그인 요청
            return;
        }

        const socket = new SockJS("http://localhost:8080/ranking", null, {
            headers: { // <-- 여기에 SockJS 초기 연결 헤더 추가
                Authorization: `Bearer ${authStore.accessToken}`,
            }
        });
        stompClient = new StompJs.Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
            reconnectDelay: 5000,
            debug: () => {},
        });

        stompClient.onConnect = () => {
            console.log("%c[STOMP] 랭킹 소켓 연결 성공!", "color:#00ff00;font-weight:bold;");

            const topic = `/topic/my-rank/${sessionId}`;
            stompClient.subscribe(topic, (msg) => {
                if (!msg.body) return;

                try {
                    const parsed = JSON.parse(msg.body);
                    if (Array.isArray(parsed)) {
                        applyRealtimeRank(parsed);
                    }
                } catch (e) {
                    console.error("[STOMP] JSON 파싱 오류:", e);
                }
            });
        };

        stompClient.activate();
    };

    // 초기 전체 랭킹 조회
    const loadRanking = async (api) => {
        try {
            const res = await api.get("/api/v1/ranking");

            if (res.data && res.data.data && Array.isArray(res.data.data.content)) {
                ranking.value = res.data.data.content;
            } else if (Array.isArray(res.data.data)) {
                ranking.value = res.data.data;
            }

            console.log(`[RANK] 초기 랭킹 로드 완료 (${ranking.value.length}명)`);

        } catch (e) {
            console.error("❌ [RANK] 초기 랭킹 조회 실패:", e);
        }
    };

    return {
        ranking,
        mySessionId,
        rankAnimation,
        getDisplayRanking,
        connectStomp,
        loadRanking,
    };
});
