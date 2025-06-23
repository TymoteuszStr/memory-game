<script setup lang="ts">
import { formatTime } from '@/game/formatTime'
import type { GameRecord } from '@/game/types'

defineProps<{
  records: GameRecord[]
}>()
</script>

<template>
  <div class="records">
    <h2 class="title">Games records</h2>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>

          <th>Time</th>
          <th>Moves</th>
          <th>Difficulty</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in records" :key="record.date">
          <td>{{ index + 1 }}</td>
          <td>{{ formatTime(record.elapsed) }}</td>
          <td>{{ record.moves }}</td>
          <td class="capitalize">{{ record.difficulty }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.records {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.table {
  width: 100%;
  font-size: 0.95rem;

  thead {
    tr {
      display: grid;
      grid-template-columns: 2rem 1fr 4rem 4rem; // dostosuj szerokość kolumn
      column-gap: 1rem;
      margin-bottom: 0.5rem;
    }
    th {
      padding: 0.5rem 0;
      color: #aaa;
      font-weight: 600;
      text-transform: uppercase;
      border: none;
    }
  }

  tbody {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    tr {
      display: grid;
      grid-template-columns: 2rem 1fr 4rem 4rem;
      column-gap: 1rem;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.03);
      padding: 0.75rem 1rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: background 0.2s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.06);
      }

      td {
        padding: 0.25rem 0;
        color: #fff;
        text-align: center;
      }

      .capitalize {
        text-transform: capitalize;
      }
    }
  }
}
</style>
