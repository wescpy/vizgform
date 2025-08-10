<template>
  <div class="container">
    <div class="card">
      <div class="header-section">
        <button @click="$router.go(-1)" class="btn btn-secondary">← Back</button>
        <h2>{{ sheetTitle || 'Loading...' }}</h2>
      </div>
      
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <span>Loading spreadsheet data...</span>
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else-if="sheetData" class="sheet-content">
        <div class="sheet-info">
          <p><strong>Rows:</strong> {{ sheetData.values.length }}</p>
          <p><strong>Columns:</strong> {{ headers.length }}</p>
        </div>
        
        <div class="data-display">
          <div v-for="(row, index) in dataRows" :key="index" class="data-row">
            <div class="row-number">{{ index + 1 }}</div>
            <div class="row-content">
              <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="data-cell">
                <label class="cell-label">{{ headers[cellIndex] || `Column ${cellIndex + 1}` }}</label>
                <div class="cell-value">{{ cell || '—' }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="dataRows.length === 0" class="no-data">
          <p>No data found in this spreadsheet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getSheetData, getSheetMetadata, type SheetData } from '../services/google-api'
import { authState } from '../services/auth'

const props = defineProps<{
  fileId: string
}>()

const isLoading = ref(true)
const error = ref('')
const sheetData = ref<SheetData | null>(null)
const sheetTitle = ref('')

const headers = computed(() => {
  if (!sheetData.value?.values || sheetData.value.values.length === 0) {
    return []
  }
  return sheetData.value.values[0] || []
})

const dataRows = computed(() => {
  if (!sheetData.value?.values || sheetData.value.values.length <= 1) {
    return []
  }
  return sheetData.value.values.slice(1)
})

onMounted(async () => {
  if (!authState.isSignedIn) {
    error.value = 'Please sign in to view spreadsheets'
    isLoading.value = false
    return
  }
  
  await loadSheetData()
})

async function loadSheetData() {
  isLoading.value = true
  error.value = ''
  
  try {
    const [data, metadata] = await Promise.all([
      getSheetData(props.fileId),
      getSheetMetadata(props.fileId)
    ])
    
    sheetData.value = data
    sheetTitle.value = metadata.sheets?.[0]?.properties?.title || 'Untitled Sheet'
  } catch (err: any) {
    error.value = err.message || 'Failed to load spreadsheet data'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.header-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.sheet-info {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.sheet-info p {
  margin: 0;
  color: #666;
}

.data-display {
  max-height: 70vh;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.data-row {
  display: flex;
  border-bottom: 1px solid #f1f3f4;
  transition: background-color 0.2s ease;
}

.data-row:hover {
  background-color: #f8f9fa;
}

.data-row:last-child {
  border-bottom: none;
}

.row-number {
  min-width: 60px;
  padding: 16px 12px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  font-weight: 600;
  color: #666;
  text-align: center;
  font-size: 14px;
}

.row-content {
  flex: 1;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.data-cell {
  min-height: 60px;
}

.cell-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #4285f4;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cell-value {
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  word-break: break-word;
  min-height: 20px;
  padding: 8px 0;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading {
  gap: 12px;
  padding: 60px 20px;
}

@media (max-width: 768px) {
  .row-content {
    grid-template-columns: 1fr;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sheet-info {
    flex-direction: column;
    gap: 8px;
  }
}
</style>