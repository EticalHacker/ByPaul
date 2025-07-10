class SurpriseCard {
  constructor() {
    this.envelope = document.getElementById("envelope")
    this.cardContent = document.getElementById("cardContent")
    this.closeBtn = document.getElementById("closeBtn")
    this.playBtn = document.getElementById("playBtn")
    this.prevBtn = document.getElementById("prevBtn")
    this.nextBtn = document.getElementById("nextBtn")
    this.progress = document.getElementById("progress")
    this.currentTimeDisplay = document.getElementById("currentTime")
    this.lyrics = document.getElementById("lyrics")
    this.audioPlayer = document.getElementById("audioPlayer")

    this.isPlaying = false
    this.duration = 455 // 7:35 en segundos (se actualizará con el audio real)

    this.init()
  }

  init() {
    this.envelope.addEventListener("click", () => this.openCard())
    this.closeBtn.addEventListener("click", () => this.closeCard())
    this.playBtn.addEventListener("click", () => this.togglePlay())
    this.prevBtn.addEventListener("click", () => this.previousTrack())
    this.nextBtn.addEventListener("click", () => this.nextTrack())

    // Event listeners para el audio
    this.audioPlayer.addEventListener("loadedmetadata", () => {
      this.duration = Math.floor(this.audioPlayer.duration)
      this.updateDurationDisplay()
    })

    this.audioPlayer.addEventListener("timeupdate", () => {
      this.updateProgress()
      this.updateLyrics()
    })

    this.audioPlayer.addEventListener("ended", () => {
      this.pause()
      this.audioPlayer.currentTime = 0
    })

    this.audioPlayer.addEventListener("error", (e) => {
      console.log("Error de audio:", e)
      this.showAudioError()
    })

    // Crear efectos de partículas
    this.createSparkles()

    // Inicializar letras
    this.initLyrics()

    // Event listeners para el audio
    this.audioPlayer.addEventListener("loadedmetadata", () => {
      this.duration = Math.floor(this.audioPlayer.duration)
    })

    this.audioPlayer.addEventListener("timeupdate", () => {
      const currentTime = this.audioPlayer.currentTime
      const progressPercent = (currentTime / this.duration) * 100
      this.progress.style.width = `${progressPercent}%`

      const minutes = Math.floor(currentTime / 60)
      const seconds = Math.floor(currentTime % 60)
      this.currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
    })

    this.audioPlayer.addEventListener("ended", () => {
      this.pause()
      this.audioPlayer.currentTime = 0
    })

    // Hacer la barra de progreso clickeable
    this.makeProgressClickable()
  }

  openCard() {
    this.envelope.style.display = "none"
    this.cardContent.style.display = "block"

    // Efecto de confeti
    this.createConfetti()

    // Sonido de apertura (simulado con vibración en móviles)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
  }

  closeCard() {
    this.cardContent.style.display = "none"
    this.envelope.style.display = "block"
    this.pause()
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  async play() {
    try {
      await this.audioPlayer.play()
      this.isPlaying = true
      this.playBtn.innerHTML = "⏸"
      this.playBtn.style.background = "linear-gradient(135deg, rgb(255, 0, 100), rgb(255, 100, 0))"

      const albumArt = document.querySelector(".album-art")
      albumArt.style.animationPlayState = "running"
    } catch (error) {
      console.log("Error al reproducir:", error)
      this.showPlayError()
    }
  }

  pause() {
    this.audioPlayer.pause()
    this.isPlaying = false
    this.playBtn.innerHTML = "▶"
    this.playBtn.style.background = "linear-gradient(135deg, rgb(255, 0, 150), rgb(255, 154, 0))"

    const albumArt = document.querySelector(".album-art")
    albumArt.style.animationPlayState = "paused"
  }

  previousTrack() {
    this.audioPlayer.currentTime = Math.max(0, this.audioPlayer.currentTime - 10)

    this.prevBtn.style.transform = "scale(0.8)"
    setTimeout(() => {
      this.prevBtn.style.transform = "scale(1)"
    }, 150)
  }

  nextTrack() {
    this.audioPlayer.currentTime = Math.min(this.duration, this.audioPlayer.currentTime + 10)

    this.nextBtn.style.transform = "scale(0.8)"
    setTimeout(() => {
      this.nextBtn.style.transform = "scale(1)"
    }, 150)
  }

  updateProgress() {
    const currentTime = this.audioPlayer.currentTime
    const progressPercent = (currentTime / this.duration) * 100
    this.progress.style.width = `${progressPercent}%`

    const minutes = Math.floor(currentTime / 60)
    const seconds = Math.floor(currentTime % 60)
    this.currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  updateDurationDisplay() {
    const minutes = Math.floor(this.duration / 60)
    const seconds = this.duration % 60
    const durationDisplay = document.querySelector(".time-display span:last-child")
    if (durationDisplay) {
      durationDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
  }

  makeProgressClickable() {
    const progressBar = document.querySelector(".progress-bar")
    progressBar.addEventListener("click", (e) => {
      const rect = progressBar.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const progressPercent = clickX / rect.width
      this.audioPlayer.currentTime = progressPercent * this.duration
    })

    progressBar.style.cursor = "pointer"
  }

  initLyrics() {
    const lyricLines = document.querySelectorAll(".lyric-line")
    lyricLines.forEach((line) => {
      line.addEventListener("click", () => {
        const time = Number.parseInt(line.dataset.time)
        this.audioPlayer.currentTime = time
      })
      line.style.cursor = "pointer"
    })
  }

  updateLyrics() {
    const currentTime = this.audioPlayer.currentTime
    const lyricLines = document.querySelectorAll(".lyric-line")
    let activeLine = null

    lyricLines.forEach((line) => {
      const lineTime = Number.parseInt(line.dataset.time)
      line.classList.remove("active")

      if (currentTime >= lineTime) {
        activeLine = line
      }
    })

    if (activeLine) {
      activeLine.classList.add("active")
      activeLine.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  showAudioError() {
    const errorMsg = document.createElement("div")
    errorMsg.innerHTML = `
      <div style="background: rgba(255, 0, 0, 0.1); border: 1px solid rgb(255, 0, 100); 
                  border-radius: 10px; padding: 15px; margin: 10px 0; text-align: center;">
        <p style="color: rgb(255, 0, 100); font-weight: bold;">
          ⚠️ No se pudo cargar el audio
        </p>
        <p style="color: rgb(100, 100, 100); font-size: 0.9rem; margin-top: 5px;">
          Agrega el archivo "lover-days-cuco.mp3" en la carpeta "audio/"
        </p>
      </div>
    `
    const musicPlayer = document.querySelector(".music-player")
    musicPlayer.insertBefore(errorMsg, musicPlayer.firstChild)
  }

  showPlayError() {
    // Mostrar mensaje temporal
    const playBtn = this.playBtn
    const originalText = playBtn.innerHTML
    playBtn.innerHTML = "❌"
    playBtn.style.background = "linear-gradient(135deg, rgb(255, 100, 100), rgb(255, 150, 150))"

    setTimeout(() => {
      playBtn.innerHTML = originalText
      playBtn.style.background = "linear-gradient(135deg, rgb(255, 0, 150), rgb(255, 154, 0))"
    }, 1000)
  }

  createSparkles() {
    const envelope = this.envelope

    setInterval(() => {
      if (envelope.style.display !== "none") {
        const sparkle = document.createElement("div")
        sparkle.innerHTML = "✨"
        sparkle.style.position = "absolute"
        sparkle.style.left = Math.random() * 100 + "%"
        sparkle.style.top = Math.random() * 100 + "%"
        sparkle.style.fontSize = "12px"
        sparkle.style.pointerEvents = "none"
        sparkle.style.animation = "sparkle 2s ease-out forwards"
        sparkle.style.zIndex = "1000"

        envelope.appendChild(sparkle)

        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle)
          }
        }, 2000)
      }
    }, 1000)
  }

  createConfetti() {
    const colors = [
      "rgb(255, 0, 150)",
      "rgb(255, 154, 0)",
      "rgb(255, 206, 84)",
      "rgb(0, 255, 136)",
      "rgb(0, 204, 255)",
      "rgb(114, 0, 255)",
    ]

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div")
        confetti.style.position = "fixed"
        confetti.style.left = Math.random() * 100 + "vw"
        confetti.style.top = "-10px"
        confetti.style.width = "10px"
        confetti.style.height = "10px"
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.borderRadius = "50%"
        confetti.style.pointerEvents = "none"
        confetti.style.zIndex = "10000"
        confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s ease-out forwards`

        document.body.appendChild(confetti)

        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti)
          }
        }, 5000)
      }, i * 100)
    }

    // Agregar animación de confeti
    const style = document.createElement("style")
    style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `
    document.head.appendChild(style)
  }
}

// Inicializar la carta cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  new SurpriseCard()
})

// Efectos adicionales de teclado
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault()
    const playBtn = document.getElementById("playBtn")
    if (playBtn) {
      playBtn.click()
    }
  }
})
