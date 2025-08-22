"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  BookOpen,
  Edit3,
  History,
  TrendingUp,
  Moon,
  Sun,
  Settings,
  MessageSquare,
  Info,
  Send,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { Confetti } from "@/components/confetti"
import { Separator } from "@/components/ui/separator"

interface Book {
  id: string
  title: string
  author: string
  totalPages: number
  currentPage: number
  dateAdded: string
  completed: boolean
  completedDate?: string
  displayStyle: "percentage" | "circular" | "bar"
  pinned?: boolean
}

interface DailyProgress {
  date: string
  pagesRead: number
}

function CircularProgress({ value, size = 60 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-muted/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-300 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-foreground">{Math.round(value)}%</span>
      </div>
    </div>
  )
}

function ContributionChart({ dailyProgress }: { dailyProgress: DailyProgress[] }) {
  const today = new Date()
  const days = []

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    days.push(date.toISOString().split("T")[0])
  }

  const getIntensityLevel = (pagesRead: number): number => {
    if (pagesRead === 0) return 0
    if (pagesRead <= 2) return 1
    if (pagesRead <= 4) return 2
    if (pagesRead <= 6) return 3
    if (pagesRead <= 8) return 4
    return 5
  }

  const getOpacityClass = (level: number): string => {
    switch (level) {
      case 0:
        return "bg-muted/20"
      case 1:
        return "bg-primary/20"
      case 2:
        return "bg-primary/40"
      case 3:
        return "bg-primary/60"
      case 4:
        return "bg-primary/80"
      case 5:
        return "bg-primary"
      default:
        return "bg-muted/20"
    }
  }

  const progressMap = dailyProgress.reduce(
    (acc, day) => {
      acc[day.date] = day.pagesRead
      return acc
    },
    {} as Record<string, number>,
  )

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Reading Habit Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Daily pages read over the past year</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <div
              className="grid gap-1 min-w-0"
              style={{ gridTemplateColumns: `repeat(${Math.min(weeks.length, 53)}, minmax(12px, 1fr))` }}
            >
              {weeks.slice(0, 53).map((week, weekIndex) => (
                <div key={weekIndex} className="grid gap-1 grid-rows-7">
                  {week.map((day) => {
                    const pagesRead = progressMap[day] || 0
                    const level = getIntensityLevel(pagesRead)
                    return (
                      <div
                        key={day}
                        className={`w-3 h-3 rounded-sm ${getOpacityClass(level)} transition-colors`}
                        title={`${day}: ${pagesRead} pages`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <div key={level} className={`w-3 h-3 rounded-sm ${getOpacityClass(level)}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SettingsDialog() {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme()
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const accentColors = [
    { name: "Blue", value: "blue" as const, color: "bg-blue-500" },
    { name: "Red", value: "red" as const, color: "bg-red-500" },
    { name: "Yellow", value: "yellow" as const, color: "bg-yellow-500" },
    { name: "Green", value: "green" as const, color: "bg-green-500" },
  ]

  const handleFeedbackSubmit = () => {
    // In a real app, this would send feedback to a server
    setFeedbackSubmitted(true)
    setFeedbackText("")
    setTimeout(() => setFeedbackSubmitted(false), 3000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-4 max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="about" className="text-xs">
              <Info className="h-3 w-3 mr-1" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Theme</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Accent Color</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {accentColors.map((color) => (
                    <Button
                      key={color.value}
                      variant={accentColor === color.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAccentColor(color.value)}
                      className="flex items-center gap-2 justify-start"
                    >
                      <div className={`w-3 h-3 rounded-full ${color.color}`} />
                      {color.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedback" className="text-sm font-medium">
                  Share your feedback
                </Label>
                <p className="text-xs text-muted-foreground mt-1">Help us improve the Book Progress Tracker</p>
              </div>

              <Textarea
                id="feedback"
                placeholder="Tell us what you think, report bugs, or suggest new features..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[100px]"
              />

              <Button
                onClick={handleFeedbackSubmit}
                disabled={!feedbackText.trim() || feedbackSubmitted}
                className="w-full"
              >
                {feedbackSubmitted ? (
                  "Thank you for your feedback!"
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">📚</div>
                <h3 className="text-lg font-semibold text-foreground">Book Progress Tracker</h3>
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Features</h4>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>• Track multiple books simultaneously</li>
                    <li>• Multiple progress display styles</li>
                    <li>• Reading history and statistics</li>
                    <li>• GitHub-style contribution chart</li>
                    <li>• Dark and light themes</li>
                    <li>• Celebration effects</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-1">Privacy</h4>
                  <p className="text-muted-foreground text-xs">
                    All your data is stored locally on your device. No account required, no data collection.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-1">Open Source</h4>
                  <p className="text-muted-foreground text-xs">
                    Built with Next.js, Tailwind CSS, and shadcn/ui components.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default function BookTracker() {
  const [books, setBooks] = useState<Book[]>([])
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [activeTab, setActiveTab] = useState("reading")
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedBookTitle, setCompletedBookTitle] = useState("")
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    totalPages: "",
    currentPage: "0",
  })

  const { theme, setTheme, accentColor, setAccentColor } = useTheme()

  useEffect(() => {
    const savedBooks = localStorage.getItem("bookTracker_books")
    if (savedBooks) {
      const parsedBooks = JSON.parse(savedBooks)
      const migratedBooks = parsedBooks.map((book: any) => ({
        ...book,
        displayStyle: book.displayStyle || "bar",
      }))
      setBooks(migratedBooks)
    }

    const savedProgress = localStorage.getItem("bookTracker_dailyProgress")
    if (savedProgress) {
      setDailyProgress(JSON.parse(savedProgress))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("bookTracker_books", JSON.stringify(books))
  }, [books])

  useEffect(() => {
    localStorage.setItem("bookTracker_dailyProgress", JSON.stringify(dailyProgress))
  }, [dailyProgress])

  const addBook = () => {
    if (!newBook.title || !newBook.author || !newBook.totalPages) return

    const book: Book = {
      id: Date.now().toString(),
      title: newBook.title,
      author: newBook.author,
      totalPages: Number.parseInt(newBook.totalPages),
      currentPage: Number.parseInt(newBook.currentPage) || 0,
      dateAdded: new Date().toISOString(),
      completed: false,
      displayStyle: "bar",
    }

    setBooks((prev) => [...prev, book])
    setNewBook({ title: "", author: "", totalPages: "", currentPage: "0" })
    setIsAddDialogOpen(false)
  }

  const updateProgress = (bookId: string, newCurrentPage: number) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id === bookId) {
          const oldPage = book.currentPage
          const pagesRead = Math.max(0, newCurrentPage - oldPage)
          const completed = newCurrentPage >= book.totalPages
          const justCompleted = completed && !book.completed

          if (pagesRead > 0) {
            const today = new Date().toISOString().split("T")[0]
            setDailyProgress((prevProgress) => {
              const existingDay = prevProgress.find((p) => p.date === today)
              if (existingDay) {
                return prevProgress.map((p) => (p.date === today ? { ...p, pagesRead: p.pagesRead + pagesRead } : p))
              } else {
                return [...prevProgress, { date: today, pagesRead }]
              }
            })
          }

          if (justCompleted) {
            setCompletedBookTitle(book.title)
            setShowCelebration(true)
          }

          return {
            ...book,
            currentPage: newCurrentPage,
            completed,
            completedDate: completed && !book.completed ? new Date().toISOString() : book.completedDate,
          }
        }
        return book
      }),
    )
  }

  const updateDisplayStyle = (bookId: string, displayStyle: "percentage" | "circular" | "bar") => {
    setBooks((prev) => prev.map((book) => (book.id === bookId ? { ...book, displayStyle } : book)))
  }

  const deleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId))
  }

  const togglePin = (bookId: string) => {
    setBooks((prev) => prev.map((book) => (book.id === bookId ? { ...book, pinned: !book.pinned } : book)))
  }

  const currentBooks = books
    .filter((book) => !book.completed)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    })
  const completedBooks = books.filter((book) => book.completed)

  const totalBooksCompleted = completedBooks.length
  const totalPagesRead =
    completedBooks.reduce((sum, book) => sum + book.totalPages, 0) +
    currentBooks.reduce((sum, book) => sum + book.currentPage, 0)
  const averageCompletionRate =
    currentBooks.length > 0
      ? Math.round(
          currentBooks.reduce((sum, book) => sum + (book.currentPage / book.totalPages) * 100, 0) / currentBooks.length,
        )
      : 0

  return (
    <div className="min-h-screen bg-background">
      <Confetti active={showCelebration} onComplete={() => setShowCelebration(false)} />
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-card border rounded-lg shadow-lg p-6 mx-4 max-w-sm text-center animate-in zoom-in-95 duration-300">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Congratulations!</h3>
            <p className="text-sm text-muted-foreground">
              You completed <span className="font-medium text-primary">"{completedBookTitle}"</span>
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Books</h1>
            <p className="text-sm text-muted-foreground">Track your reading progress</p>
          </div>

          <div className="flex items-center gap-2">
            <SettingsDialog />

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4">
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Book Title</Label>
                    <Input
                      id="title"
                      value={newBook.title}
                      onChange={(e) => setNewBook((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter book title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={newBook.author}
                      onChange={(e) => setNewBook((prev) => ({ ...prev, author: e.target.value }))}
                      placeholder="Enter author name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalPages">Total Pages</Label>
                    <Input
                      id="totalPages"
                      type="number"
                      value={newBook.totalPages}
                      onChange={(e) => setNewBook((prev) => ({ ...prev, totalPages: e.target.value }))}
                      placeholder="Enter total pages"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentPage">Current Page (Optional)</Label>
                    <Input
                      id="currentPage"
                      type="number"
                      value={newBook.currentPage}
                      onChange={(e) => setNewBook((prev) => ({ ...prev, currentPage: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <Button onClick={addBook} className="w-full">
                    Add Book
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reading" className="text-xs">
              <BookOpen className="h-4 w-4 mr-1" />
              Reading
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              <History className="h-4 w-4 mr-1" />
              History
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">
              <TrendingUp className="h-4 w-4 mr-1" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reading" className="mt-6">
            <div className="space-y-4">
              {currentBooks.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No books yet</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Add your first book to start tracking your reading progress
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Book
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                currentBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onUpdateProgress={updateProgress}
                    onEdit={setEditingBook}
                    onUpdateDisplayStyle={updateDisplayStyle}
                    onDelete={deleteBook}
                    onTogglePin={togglePin}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="space-y-4">
              {completedBooks.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <History className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No completed books</h3>
                    <p className="text-sm text-muted-foreground text-center">Completed books will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                completedBooks.map((book) => (
                  <Card key={book.id} className="transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-medium text-foreground truncate">{book.title}</CardTitle>
                          <p className="text-sm text-muted-foreground truncate">by {book.author}</p>
                          {book.completedDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Completed {new Date(book.completedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="ml-2 text-right">
                          <div className="text-sm font-medium text-primary">100%</div>
                          <div className="text-xs text-muted-foreground">{book.totalPages} pages</div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{totalBooksCompleted}</div>
                    <div className="text-sm text-muted-foreground">Books Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{totalPagesRead.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Pages Read</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{averageCompletionRate}%</div>
                  <div className="text-sm text-muted-foreground">Average Progress</div>
                  <div className="text-xs text-muted-foreground mt-1">Current books</div>
                </CardContent>
              </Card>

              <ContributionChart dailyProgress={dailyProgress} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface BookCardProps {
  book: Book
  onUpdateProgress: (bookId: string, newCurrentPage: number) => void
  onEdit: (book: Book) => void
  onUpdateDisplayStyle: (bookId: string, displayStyle: "percentage" | "circular" | "bar") => void
  onDelete: (bookId: string) => void
  onTogglePin: (bookId: string) => void
}

function BookCard({ book, onUpdateProgress, onEdit, onUpdateDisplayStyle, onDelete, onTogglePin }: BookCardProps) {
  const [currentPage, setCurrentPage] = useState(book.currentPage.toString())
  const [isEditing, setIsEditing] = useState(false)

  const progress = Math.round((book.currentPage / book.totalPages) * 100)

  const cycleDisplayStyle = () => {
    const nextStyle =
      book.displayStyle === "percentage" ? "circular" : book.displayStyle === "circular" ? "bar" : "percentage"
    onUpdateDisplayStyle(book.id, nextStyle)
  }

  const handleUpdateProgress = () => {
    const newPage = Number.parseInt(currentPage) || 0
    const clampedPage = Math.min(Math.max(0, newPage), book.totalPages)
    onUpdateProgress(book.id, clampedPage)
    setCurrentPage(clampedPage.toString())
    setIsEditing(false)
  }

  const incrementPage = () => {
    const newPage = Math.min(book.currentPage + 1, book.totalPages)
    onUpdateProgress(book.id, newPage)
    setCurrentPage(newPage.toString())
  }

  const decrementPage = () => {
    const newPage = Math.max(book.currentPage - 1, 0)
    onUpdateProgress(book.id, newPage)
    setCurrentPage(newPage.toString())
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateProgress()
    }
    if (e.key === "Escape") {
      setCurrentPage(book.currentPage.toString())
      setIsEditing(false)
    }
  }

  const renderProgressDisplay = () => {
    switch (book.displayStyle) {
      case "percentage":
        return (
          <button
            onClick={cycleDisplayStyle}
            className="flex items-center justify-center py-4 w-full hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
            title="Click to change display style"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{progress}%</div>
              <div className="text-sm text-muted-foreground">complete</div>
            </div>
          </button>
        )

      case "circular":
        return (
          <button
            onClick={cycleDisplayStyle}
            className="flex items-center justify-center py-4 w-full hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
            title="Click to change display style"
          >
            <CircularProgress value={progress} size={80} />
          </button>
        )

      case "bar":
      default:
        return (
          <button
            onClick={cycleDisplayStyle}
            className="space-y-2 w-full p-2 hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
            title="Click to change display style"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </button>
        )
    }
  }

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${book.pinned ? "ring-2 ring-primary/20 bg-primary/5" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-medium text-foreground truncate">{book.title}</CardTitle>
              {book.pinned && <div className="text-primary text-xs">📌</div>}
            </div>
            <p className="text-sm text-muted-foreground truncate">by {book.author}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePin(book.id)}
              className="h-8 w-8 p-0"
              title={book.pinned ? "Unpin book" : "Pin book"}
            >
              <div className={`text-sm ${book.pinned ? "text-primary" : "text-muted-foreground"}`}>📌</div>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-8 w-8 p-0">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(book.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Delete book"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {renderProgressDisplay()}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pages</span>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decrementPage}
                    disabled={book.currentPage <= 0}
                    className="h-8 w-8 p-0 bg-transparent"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </Button>
                  <Input
                    type="number"
                    value={currentPage}
                    onChange={(e) => setCurrentPage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={handleUpdateProgress}
                    className="w-16 h-8 text-sm text-center"
                    min="0"
                    max={book.totalPages}
                    autoFocus
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={incrementPage}
                    disabled={book.currentPage >= book.totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                  <span className="text-sm text-muted-foreground">/ {book.totalPages}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decrementPage}
                    disabled={book.currentPage <= 0}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </Button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2"
                  >
                    {book.currentPage} / {book.totalPages}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={incrementPage}
                    disabled={book.currentPage >= book.totalPages}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
