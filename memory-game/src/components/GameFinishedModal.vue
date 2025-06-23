<script lang="ts" setup>
import { formatTime } from '@/game/formatTime'
import { useRouter } from 'vue-router'

export interface VModalProps {
  isOpen: boolean
  totalTime: number;
  totalMoves:number;
}
withDefaults(defineProps<VModalProps>(),{
  totalMoves:0,
  totalTime:0
})
defineEmits(['close', 'click'])

const router = useRouter()
function goBack() {
  router.replace('/')
}

</script>
<template>
  <Teleport to="body">
    <Transition name="scale">
      <div
        v-if="isOpen"
        class="modal-mask flex scale flex-center"
   
        @click.self="$emit('close')"
      >
        <div class="close-icon" @click.stop="$emit('close')" >&#10005</div>
          <div class="modalContainer flex-center">
            <h1>You win !</h1>
            <p>Total time: {{ formatTime(totalTime) }}</p>
            <p>Total moves: {{ totalMoves }}</p>
            <button type="button" class="button" @click="goBack"> Go back</button>
          </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  padding:4px;
  transition: opacity 0.2s ease;
  align-items: center;
  justify-content: center;
}
.button{
  background-color: #11998e;
  color:white;
  border: none;;
  padding: 15px 30px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 70px;

}
.modalContainer{
  width: 400px;
  height: fit-content;
  background-color: aliceblue;
  padding: 50px 30px;
  border-radius: 8px;
  flex-direction: column;
  h1{
    margin-bottom: 60px;
  }
  p{
    margin:10px;
  }


}
.flex-center{
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-icon {
  position: fixed !important;
  z-index: 3;
  top: 30px;
  right: 50px;
  margin: 8px;
  color:white;
  cursor: pointer;

}
.modal-wrapper {
  height: fit-content;
  transition: transform 0.3s ease-out;
  z-index: 2;
}

.scale-enter-from,
.scaleZero-leave-to {
  opacity: 0;
}

.scale-enter-from .modal-wrapper,
.scale-leave-to .modal-wrapper {
  transform: scale(0);
}

</style>
