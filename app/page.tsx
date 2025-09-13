"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Play, Download, Mic, Music, MessageSquare, Volume2, Copy, Sparkles } from "lucide-react"

// Tabs
const tabs = [
  { id: "text-to-speech", label: "TEXT TO SPEECH", icon: Mic },
  { id: "agents", label: "AGENTS", icon: MessageSquare },
  { id: "music", label: "MUSIC", icon: Music },
  { id: "speech-to-text", label: "SPEECH TO TEXT", icon: Volume2 },
  { id: "dubbing", label: "DUBBING", icon: Copy },
  { id: "voice-cloning", label: "VOICE CLONING", icon: Volume2 },
  { id: "elevenreader", label: "ELEVENREADER", icon: Sparkles },
]

export default function ElevenLabsClone() {
  const [activeTab, setActiveTab] = useState("text-to-speech")
  const [languages, setLanguages] = useState<{ code: string; name: string; flag: string }[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [sampleText, setSampleText] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Fetch languages from backend
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/languages`)
      .then((res) => res.json())
      .then((data) => setLanguages(data))
      .catch((err) => console.error("Error fetching languages:", err))
  }, [])

  // Fetch audio whenever language changes
  useEffect(() => {
    if (selectedLanguage) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audio/${selectedLanguage}`)
        .then((res) => res.json())
        .then((data) => {
          setSampleText(data.text)
          setAudioUrl(data.audio_url)
          if (audioRef.current) {
            audioRef.current.src = data.audio_url
          }
        })
        .catch((err) => console.error("Error fetching audio:", err))
    }
  }, [selectedLanguage])

  const handlePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.error("Error playing audio:", error)
        }
      }
    }
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a")
      link.href = audioUrl
      link.download = `${selectedLanguage}.mp3`
      link.click()
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className="
          relative z-50
          grid grid-cols-[1fr_auto_1fr]
          items-center
          min-h-16
          px-4 sm:px-8
        "
      >
        {/* Left Section */}
        <div className="flex items-center col-start-1">
          <div className="text-xl font-bold tracking-tight ml-0 sm:ml-4">IIElevenLabs</div>
        </div>

        {/* Center Links */}
        <div className="hidden lg:flex items-center justify-center space-x-8 col-start-2">
          <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-600">
            <span className="text-sm font-normal">Creative Platform</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-600">
            <span className="text-sm font-normal">Agents Platform</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-600">
            <span className="text-sm font-normal">Developers</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-600">
            <span className="text-sm font-normal">Resources</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <span className="text-sm font-normal cursor-pointer hover:text-gray-600">Enterprise</span>
          <span className="text-sm font-normal cursor-pointer hover:text-gray-600">Pricing</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end col-start-3 mr-0 sm:mr-4 space-x-3">
          <Button variant="ghost" size="sm" className="text-sm font-normal">
            Log in
          </Button>
          <Button
            size="sm"
            className="bg-black text-white hover:bg-gray-800 rounded-full px-4 sm:px-6 text-sm font-normal"
          >
            Sign up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="
          order-1
          grid-column-span-8
          col-start-3
          text-center 
          py-12 sm:py-20 
          px-4 sm:px-6 
          max-w-7xl 
          mx-auto
        "
        style={{
          gridColumn: "span 8 / span 8",
          gridColumnStart: 3,
        }}
      >
        <h1 className="font-waldenburg text-4xl sm:text-5xl font-normal leading-[110%] tracking-[-0.03em] text-center mb-6 sm:mb-8 max-w-5xl mx-auto">
          The most realistic voice AI platform
        </h1>

        <p className="font-waldenburg whitespace-pre-wrap text-center text-base sm:text-lg font-normal leading-[140%] tracking-[0.01em] mt-4 mb-8 sm:mb-12 max-w-5xl mx-auto -mx-1">
          AI voice models and products powering millions of developers, creators, and enterprises. From low-latency
          conversational agents to the leading AI voice generator for voiceovers and audiobooks.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row flex-wrap justify-center gap-3 items-center">
          <Button className="font-waldenburg-ht text-sm leading-[110%] tracking-[0.05em] uppercase inline-flex h-10 w-full sm:w-fit min-w-20 items-center justify-center whitespace-nowrap rounded-full bg-black px-4 text-white transition-all duration-300 ease-[cubic-bezier(0.31,0.325,0,0.92)] outline-offset-0 outline-2 outline-transparent">
            SIGN UP
          </Button>
          <Button className="font-waldenburg-ht text-sm leading-[110%] tracking-[0.05em] uppercase inline-flex h-10 w-full sm:w-fit min-w-20 items-center justify-center whitespace-nowrap rounded-full bg-neutral-50 px-4 text-black transition-all duration-300 ease-[cubic-bezier(0.31,0.325,0,0.92)] outline-offset-0 outline-2 outline-transparent hover:bg-neutral-50 hover:text-black hover:shadow-none">
            CONTACT SALES
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-gray-200 text-black border-black"
                    : "bg-gray-100 text-gray-700 border-transparent hover:border-black hover:bg-gray-100"
                }`}
              >
                {tab.id === "text-to-speech" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="shrink-0">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M1 2.5c0-.828.672-1.5 1.5-1.5h6.5c.828 0 1.5.672 1.5 1.5v3.013a.5.5 0 1 1-1 0V2.5a.5.5 0 0 0-.5-.5H2.5a.5.5 0 0 0-.5.5v6.5c0 .276.224.5.5.5h3a.5.5 0 1 1 0 1h-3A1.5 1.5 0 0 1 1 9z"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M5.244 4.5H4.25a.25.25 0 0 1-.25-.25v-.5c0-.138.112-.25.25-.25h3c.138 0 .25.112.25.25v.5c0 .138-.112.25-.25.25H6.244v2.75c0 .138-.112.25-.25.25h-.5a.25.25 0 0 1-.25-.25zM12.258 5.613a.5.5 0 0 1 .704.07 6.8 6.8 0 0 1 1.538 4.317 6.8 6.8 0 0 1-1.538 4.317.5.5 0 0 1-.774-.634A5.792 5.792 0 0 0 13.5 10a5.792 5.792 0 0 0-1.312-3.683.5.5 0 0 1 .07-.704"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M10.634 6.663a.5.5 0 0 1 .704.07A5.144 5.144 0 0 1 12.5 10a5.144 5.144 0 0 1-1.163 3.267.5.5 0 0 1-.773-.633A4.144 4.144 0 0 0 11.5 10a4.144 4.144 0 0 0-.936-2.634.5.5 0 0 1 .07-.703"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M8.984 7.638a.5.5 0 0 1 .704.072A3.616 3.616 0 0 1 10.5 10a3.616 3.616 0 0 1-.812 2.29.5.5 0 1 1-.776-.632A2.616 2.616 0 0 0 9.5 10c0-.632-.225-1.21-.588-1.658a.5.5 0 0 1 .072-.704M7.361 8.686a.5.5 0 0 1 .703.074c.273.338.436.77.436 1.24s-.163.902-.436 1.24a.5.5 0 0 1-.777-.628c.127-.157.213-.386.213-.612s-.086-.455-.213-.612a.5.5 0 0 1 .074-.702"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <Icon className="w-4 h-4 shrink-0" />
                )}
                <span className="whitespace-nowrap font-bold hidden sm:inline">{tab.label}</span>
                <span className="whitespace-nowrap font-bold sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {activeTab === "text-to-speech" ? (
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-6">
              {/* Text Editor */}
              <Textarea
                value={sampleText}
                readOnly
                className="font-waldenburg w-full h-[250px] sm:h-[300px] resize-none border-0 rounded-lg p-0
             text-base sm:text-lg leading-relaxed bg-white text-gray-800 
             focus:ring-0 focus:outline-none"
              />

              {/* Voice Buttons */}
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pt-3 pb-2">
                {/* Samara */}
                <button className="bg-white hover:bg-gray-50 group flex flex-shrink-0 items-center gap-1.5 sm:gap-2 rounded-lg p-1.5 sm:p-2 pr-2 sm:pr-3 text-black border border-gray-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center">
                      <div className="rounded-full overflow-hidden w-4 sm:w-5 h-4 sm:h-5 group-hover:border-gray-400 bg-gray-300">
                        <img src="/gray.webp" alt="Samara" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-black">Samara</span>
                  </div>
                  <div className="bg-gray-600 h-3 w-px"></div>
                  <div className="text-xs font-bold text-black hidden sm:inline">Narrate a story</div>
                  <div className="text-xs font-bold text-black sm:hidden">Narrate</div>
                </button>

                {/* 2 speakers */}
                <button className="bg-white hover:bg-gray-50 group flex flex-shrink-0 items-center gap-1.5 sm:gap-2 rounded-lg p-1.5 sm:p-2 pr-2 sm:pr-3 text-black border border-gray-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center">
                      <div className="rounded-full overflow-hidden w-4 sm:w-5 h-4 sm:h-5 group-hover:border-gray-400 relative z-10 bg-pink-200">
                        <img src="/jessica.webp" alt="Speaker 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="rounded-full overflow-hidden w-4 sm:w-5 h-4 sm:h-5 group-hover:border-gray-400 -ml-1.5 sm:-ml-2 relative z-0">
                        <img src="/liam.webp" alt="Speaker 2" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-black">2 speakers</span>
                  </div>
                  <div className="bg-gray-600 h-3 w-px"></div>
                  <div className="text-xs font-bold text-black hidden sm:inline">Create a dialogue</div>
                  <div className="text-xs font-bold text-black sm:hidden">Dialogue</div>
                </button>

                {/* Announcer */}
                <button className="bg-white hover:bg-gray-50 group flex flex-shrink-0 items-center gap-1.5 sm:gap-2 rounded-lg p-1.5 sm:p-2 pr-2 sm:pr-3 text-black border border-gray-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center">
                      <div className="rounded-full overflow-hidden w-4 sm:w-5 h-4 sm:h-5 group-hover:border-gray-400 bg-green-300">
                        <img src="/green.webp" alt="Announcer" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-black">Announcer</span>
                  </div>
                  <div className="bg-gray-600 h-3 w-px"></div>
                  <div className="text-xs font-bold text-black hidden sm:inline">Voiceover a game</div>
                  <div className="text-xs font-bold text-black sm:hidden">Voiceover</div>
                </button>

                {/* Sergeant */}
                <button className="bg-white hover:bg-gray-50 group flex flex-shrink-0 items-center gap-1.5 sm:gap-2 rounded-lg p-1.5 sm:p-2 pr-2 sm:pr-3 text-black border border-gray-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center">
                      <div className="rounded-full overflow-hidden w-4 sm:w-5 h-4 sm:h-5 group-hover:border-gray-400 bg-purple-300">
                        <img src="/purple.webp" alt="Sergeant" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-black">Sergeant</span>
                  </div>
                  <div className="bg-gray-600 h-3 w-px"></div>
                  <div className="text-xs font-bold text-black hidden sm:inline">Play a drill sergeant</div>
                  <div className="text-xs font-bold text-black sm:hidden">Drill</div>
                </button>

                {/* Spuds */}
                <button className="bg-white hover:bg-gray-50 group flex flex-shrink-0 items-center gap-1.5 sm:gap-2 rounded-lg p-1.5 sm:p-2 pr-2 sm:pr-3 text-black border border-gray-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center">
                      <div className="rounded-full overflow-hidden w-4 sm:w-5 h-4 sm:h-5 group-hover:border-gray-400 bg-blue-800">
                        <img src="/darkblue.webp" alt="Spuds" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-black">Spuds</span>
                  </div>
                  <div className="bg-gray-600 h-3 w-px"></div>
                  <div className="text-xs font-bold text-black hidden sm:inline">Recount an old story</div>
                  <div className="text-xs font-bold text-black sm:hidden">Recount</div>
                </button>

                {/* Jessica */}
                <button className="bg-white hover:bg-gray-50 group flex flex-shrink-0 items-center gap-1.5 sm:gap-2 rounded-lg p-1.5 sm:p-2 pr-2 sm:pr-3 text-black border border-gray-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center">
                      <div className="rounded-full overflow-hidden w-4 sm:w-5 h-4 sm:h-5 group-hover:border-gray-400 bg-pink-200">
                        <img src="/jessica.webp" alt="Jessica" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-black">Jessica</span>
                  </div>
                  <div className="bg-gray-600 h-3 w-px"></div>
                  <div className="text-xs font-bold text-black hidden sm:inline">Provide customer support</div>
                  <div className="text-xs font-bold text-black sm:hidden">Support</div>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Bottom Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-32 font-bold border border-gray-200 bg-white rounded-full text-xs font-medium h-10 px-3 flex items-center gap-2">
                      <span>{selectedLanguage === "arabic" ? "🇸🇦" : "🇺🇸"}</span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english" className="font-bold">
                        ENGLISH
                      </SelectItem>
                      <SelectItem value="arabic" className="font-bold">
                        ARABIC
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePlay}
                    className="bg-black text-white hover:bg-gray-800 rounded-full px-4 py-2 text-xs font-medium h-10"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    PLAY
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full bg-white border-gray-200 p-2 h-10 w-10"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Powered by */}
            <div
              className="relative z-8 px-4 sm:px-8 py-4 text-center rounded-b-xl -mx-2 -mb-2"
              style={{
                background:
                  "linear-gradient(100deg, rgba(243, 244, 246, 1) 0%, rgba(243, 244, 246, 1) 50%, rgba(175, 250, 255, 0.7) 65%, rgba(215, 167, 255, 0.8) 80%, rgba(253, 115, 54, 0.9) 95%, rgba(253, 115, 54, 1) 100%)",
              }}
            >
              <h2 className="text-sm font-bold text-black">Powered by Eleven v3 (alpha)</h2>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center bg-gray-50 rounded-2xl">
            <div className="text-gray-500">
              <div className="text-lg font-medium mb-2">{tabs.find((tab) => tab.id === activeTab)?.label}</div>
              <p>This tab content is not implemented yet.</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <p className="font-bold text-sm uppercase tracking-wide">EXPERIENCE THE FULL AUDIO AI PLATFORM</p>
            <button className="inline-flex h-10 min-w-24 items-center justify-center whitespace-nowrap rounded-full bg-black px-4 text-sm uppercase text-white transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              SIGN UP
            </button>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />
    </div>
  )
}
