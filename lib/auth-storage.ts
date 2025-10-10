// Enhanced authentication storage with both localStorage and secure cookies
export interface AuthStorage {
  setItem(key: string, value: string): void
  getItem(key: string): string | null
  removeItem(key: string): void
  clear(): void
}

// localStorage implementation
export class LocalStorageAuth implements AuthStorage {
  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  }

  getItem(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  }
}

// Cookie implementation
export class CookieAuth implements AuthStorage {
  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      const expires = new Date()
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days
      document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
    }
  }

  getItem(key: string): string | null {
    if (typeof window !== 'undefined') {
      const nameEQ = key + "="
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
      }
    }
    return null
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
    }
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(";")
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
      }
    }
  }
}

// Dual storage implementation (localStorage + cookies for redundancy)
export class DualAuthStorage implements AuthStorage {
  private localStorage: LocalStorageAuth
  private cookieStorage: CookieAuth

  constructor() {
    this.localStorage = new LocalStorageAuth()
    this.cookieStorage = new CookieAuth()
  }

  setItem(key: string, value: string): void {
    this.localStorage.setItem(key, value)
    this.cookieStorage.setItem(key, value)
  }

  getItem(key: string): string | null {
    // Try localStorage first, then cookies
    const localValue = this.localStorage.getItem(key)
    
    if (localValue) {
      // Sync to cookie if localStorage has it but cookie doesn't
      const cookieValue = this.cookieStorage.getItem(key)
      
      if (!cookieValue) {
        this.cookieStorage.setItem(key, localValue)
      }
      return localValue
    }
    
    // Try cookie if localStorage is empty
    const cookieValue = this.cookieStorage.getItem(key)
    
    if (cookieValue) {
      // Sync to localStorage if cookie has it but localStorage doesn't
      this.localStorage.setItem(key, cookieValue)
      return cookieValue
    }
    
    return null
  }

  removeItem(key: string): void {
    this.localStorage.removeItem(key)
    this.cookieStorage.removeItem(key)
  }

  clear(): void {
    this.localStorage.clear()
    this.cookieStorage.clear()
  }
}

// Default storage instance
export const authStorage = new DualAuthStorage()

// Convenience functions
export const setSpotifyUserId = (userId: string) => {
  authStorage.setItem('spotify_user_id', userId)
}

export const getSpotifyUserId = (): string | null => {
  return authStorage.getItem('spotify_user_id')
}

export const removeSpotifyUserId = () => {
  authStorage.removeItem('spotify_user_id')
}

export const clearAuthData = () => {
  authStorage.clear()
}
