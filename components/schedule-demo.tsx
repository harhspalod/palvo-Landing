"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Video, CalendarDays, Clock, CheckCircle2, Mail, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isWeekend, isBefore, startOfToday } from "date-fns"

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
]

export function ScheduleDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isBooked, setIsBooked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfToday()) || isWeekend(date)
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const canBook = selectedDate && selectedTime && email && isValidEmail(email) && name

  const handleBooking = async () => {
    if (!canBook) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/schedule-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate?.toISOString(),
          time: selectedTime,
          email,
          name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule demo")
      }

      setIsBooked(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetBooking = () => {
    setSelectedDate(undefined)
    setSelectedTime("")
    setEmail("")
    setName("")
    setIsBooked(false)
    setError(null)
  }

  return (
    <section id="schedule-demo" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="glass-panel rounded-[3rem] p-8 md:p-16 border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
          {/* Decorative mesh */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto relative z-10 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-8"
            >
              <Video className="w-8 h-8 text-accent" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Schedule a Demo
            </h2>
            <p className="text-muted-foreground text-lg">
              Pick a time that works for you and get a personalized walkthrough of Palvo.
            </p>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {!isBooked ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto"
              >
                {/* Date & Time Selection */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Calendar */}
                  <div className="p-8 rounded-3xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Select Date</h3>
                        <p className="text-sm text-muted-foreground">Choose your preferred day</p>
                      </div>
                    </div>

                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={isDateDisabled}
                      className="rounded-xl w-full"
                      classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4 w-full",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-8 w-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors border border-white/10",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse",
                        head_row: "flex",
                        head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] flex-1 text-center",
                        row: "flex w-full mt-2",
                        cell: "flex-1 text-center text-sm p-0 relative",
                        day: "h-10 w-10 mx-auto p-0 font-normal rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer",
                        day_selected: "bg-white text-black hover:bg-white/90 font-semibold",
                        day_today: "bg-accent/20 text-accent font-semibold",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
                      }}
                    />
                  </div>

                  {/* Time Slots */}
                  <div className="p-8 rounded-3xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Select Time</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedDate
                            ? format(selectedDate, "EEEE, MMM d")
                            : "Pick a date first"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "grid grid-cols-3 gap-3",
                        !selectedDate && "opacity-40 pointer-events-none"
                      )}
                    >
                      {timeSlots.map((time) => (
                        <motion.button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          disabled={!selectedDate}
                          className={cn(
                            "py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                            selectedTime === time
                              ? "bg-white text-black border-white"
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                          )}
                          whileHover={{ scale: selectedDate ? 1.03 : 1 }}
                          whileTap={{ scale: selectedDate ? 0.97 : 1 }}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>

                    {/* Selected Summary */}
                    {selectedDate && selectedTime && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20"
                      >
                        <p className="text-sm text-accent font-medium mb-1">Your Selection</p>
                        <p className="text-white font-semibold">
                          {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-white/70">at {selectedTime}</p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Email Input Section */}
                {selectedDate && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl mx-auto p-8 rounded-3xl bg-black/40 border border-white/5"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Your Details</h3>
                        <p className="text-sm text-muted-foreground">We&apos;ll send the meeting link here</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white/80">
                          Your Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-accent/50 placeholder:text-white/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/80">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-accent/50 placeholder:text-white/30"
                        />
                        {email && !isValidEmail(email) && (
                          <p className="text-sm text-red-400">Please enter a valid email address</p>
                        )}
                      </div>
                    </div>

                    {error && (
                      <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Book Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex justify-center mt-10"
                >
                  <Button
                    onClick={handleBooking}
                    disabled={!canBook || isLoading}
                    size="lg"
                    className="rounded-full bg-white text-black hover:bg-white/90 px-12 h-14 text-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      "Book Demo"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-lg mx-auto"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle2 className="w-10 h-10 text-black" />
                </motion.div>

                <h3 className="text-3xl font-bold mb-4">Demo Scheduled!</h3>
                <p className="text-muted-foreground text-lg mb-8">
                  We&apos;ve sent a Google Meet link to <span className="text-white font-medium">{email}</span>
                </p>

                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Video className="w-5 h-5 text-accent" />
                    <span className="font-medium">Meeting Details</span>
                  </div>
                  <p className="text-white text-xl font-semibold">
                    {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-muted-foreground text-lg">{selectedTime}</p>
                  <p className="text-sm text-white/40 mt-2">30 minute demo</p>
                </div>

                <Button
                  onClick={resetBooking}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/20 hover:bg-white/10 px-8 h-12"
                >
                  Schedule Another
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScheduleDemo