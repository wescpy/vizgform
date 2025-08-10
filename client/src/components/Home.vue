<template>
  <div class="container">
    <div class="card">
      <h2>Welcome to Google Sheets Viewer</h2>
      <p>Connect your Google account to view and explore your spreadsheets in a more readable format.</p>
      
      <div v-if="!authState.isSignedIn" class="auth-section">
        <button @click="handleSignIn" :disabled="isLoading" class="btn">
          {{ isLoading ? 'Loading...' : '🔐 Sign in with Google' }}
        </button>
      </div>

      <div v-else class="content-section">
        <div class="user-actions">
          <button @click="handleSignOut" class="btn btn-secondary">Sign Out</button>
        </div>
        
        <h3>Your Spreadsheets</h3>
        
        <div v-if="isLoadingFiles" class="loading">
          <div class="spinner"></div>
          <span>Loading your spreadsheets...</span>
        </div>
        
        <div v-else-if="error" class="error">
          {{ error }}
        </div>
        
        <div v-else-if="spreadsheets.length === 0" class="no-files">
          <p>No spreadsheets found in your Google Drive.</p>
        </div>
        
        <div v-else class="spreadsheets-grid">
          <div 
            v-for="file in spreadsheets" 
            :key="file.id"
            @click="openSpreadsheet(file.id)"
            class="spreadsheet-card"
          >
            <div class="file-icon">📊</div>
            <div class="file-info">
              <h4>{{ file.name }}</h4>
              <p class="file-date">Modified: {{ formatDate(file.modifiedTime) }}</p>
            </div>
            <div class="file-actions">
              <button class="btn-small">View →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loadGoogleAPIs, signIn, signOut, authState } from '../services/auth'
import { listSpreadsheets, type DriveFile } from '../services/google-api'

const router = useRouter()
const isLoading = ref(false)
const isLoadingFiles = ref(false)
const error = ref('')
const spreadsheets = ref<DriveFile[]>([])

onMounted(async () => {
  isLoading.value = true
  try {
    await loadGoogleAPIs()
    // If user is already signed in, load their spreadsheets
    if (authState.isSignedIn && authState.accessToken) {
      await loadSpreadsheets()
    }
  } catch (err) {
    error.value = 'Failed to load Google APIs'
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

async function handleSignIn() {
  isLoading.value = true
  error.value = ''
  try {
    await signIn()
    await loadSpreadsheets()
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

function handleSignOut() {
  signOut()
  spreadsheets.value = []
}

async function loadSpreadsheets() {
  isLoadingFiles.value = true
  error.value = ''
  try {
    spreadsheets.value = await listSpreadsheets()
  } catch (err: any) {
    error.value = err.message || 'Failed to load spreadsheets'
    console.error(err)
  } finally {
    isLoadingFiles.value = false
  }
}

function openSpreadsheet(fileId: string) {
  router.push(`/sheet/${fileId}`)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.auth-section {
  text-align: center;
  margin: 32px 0;
}

.content-section {
  margin-top: 24px;
}

.user-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #5a6268;
}

.spreadsheets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.spreadsheet-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.spreadsheet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #4285f4;
}

.file-icon {
  font-size: 24px;
  width: 40px;
  text-align: center;
}

.file-info {
  flex: 1;
}

.file-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #333;
}

.file-date {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.btn-small {
  background: #4285f4;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.no-files {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.loading {
  gap: 12px;
}
</style>