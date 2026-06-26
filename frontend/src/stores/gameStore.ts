import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
    const gameFrameRef = ref<HTMLIFrameElement | null>()

    const setGameFrame = (ref: HTMLIFrameElement | null) => gameFrameRef.value = ref

    return { gameFrameRef, setGameFrame }
})