'use client'

import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, MapPin, Users, Heart } from 'lucide-react'

const highlights = [
  {
    title: 'CBSE Curriculum',
    description: 'Standardized, high-quality education for national-level opportunities.',
    icon: BookOpen,
    position: 'top',
  },
  {
    title: 'Up to 10th Standard',
    description: 'A strong foundational journey built on holistic learning.',
    icon: GraduationCap,
    position: 'bottom',
  },
  {
    title: 'Serene Kargil Campus',
    description: 'Peaceful learning environment in Goma, just 3km from main town.',
    icon: MapPin,
    position: 'top',
  },
  {
    title: 'Dedicated Educators',
    description: 'Passionate teachers committed to personal mentorship.',
    icon: Users,
    position: 'bottom',
  },
  {
    title: 'Inspiring Community',
    description: 'A welcoming, safe haven where every child belongs.',
    icon: Heart,
    position: 'top',
  },
]

export function SchoolTimeline() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#0a3871] via-[#082a56] to-[#04152d]">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 md:mb-32">
          <h3 className="text-[#cfa861] text-sm font-bold tracking-[0.25em] uppercase mb-4">Why Choose Us</h3>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-lora)' }}>
            Nurturing Excellence in Goma Kargil
          </h2>
        </div>

        {/* Desktop Timeline (Hidden on small screens) */}
        <div className="hidden lg:block relative max-w-6xl mx-auto h-[400px]">
          {/* Main Horizontal Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/30 -translate-y-1/2" />
          
          <div className="flex justify-between relative h-full">
            {highlights.map((item, index) => {
              const isTop = item.position === 'top'
              const delay = index * 0.15

              return (
                <div key={index} className="relative w-1/5 flex justify-center">
                  {/* Central Node */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: delay + 0.3, type: 'spring' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0a3871] border-[3px] border-white z-20 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  />

                  {/* Vertical Connecting Line */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: delay + 0.1, duration: 0.4 }}
                    className={`absolute left-1/2 -translate-x-1/2 w-[1px] bg-white/40 origin-${isTop ? 'bottom' : 'top'}`}
                    style={{
                      top: isTop ? 'auto' : '50%',
                      bottom: isTop ? '50%' : 'auto',
                      height: '100px'
                    }}
                  />

                  {/* Content Container */}
                  <motion.div
                    initial={{ opacity: 0, y: isTop ? -20 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: delay + 0.4, duration: 0.5 }}
                    className={`absolute flex flex-col items-center text-center w-64 ${
                      isTop ? 'bottom-[calc(50%+100px)]' : 'top-[calc(50%+100px)]'
                    }`}
                  >
                    {isTop ? (
                      <>
                        <div className="relative mb-6">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0a3871] shadow-xl relative z-10">
                            <item.icon size={32} strokeWidth={1.5} />
                          </div>
                          {/* Downward Triangle */}
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 z-0" />
                        </div>
                        <h4 className="text-white font-bold text-xl mb-2 drop-shadow-md">{item.title}</h4>
                        <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
                      </>
                    ) : (
                      <>
                        <h4 className="text-white font-bold text-xl mb-2 drop-shadow-md">{item.title}</h4>
                        <p className="text-white/80 text-sm leading-relaxed mb-6">{item.description}</p>
                        <div className="relative">
                          {/* Upward Triangle */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 z-0" />
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0a3871] shadow-xl relative z-10">
                            <item.icon size={32} strokeWidth={1.5} />
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile/Tablet View (Vertical layout) */}
        <div className="lg:hidden flex flex-col gap-12 relative">
          <div className="absolute top-0 bottom-0 left-8 w-[2px] bg-white/30" />
          {highlights.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-8 relative z-10"
            >
              <div className="relative shrink-0">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0a3871] shadow-xl relative z-10">
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                {/* Horizontal Triangle pointing right */}
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 z-0" />
              </div>
              <div className="pt-2">
                <h4 className="text-white font-bold text-xl mb-2">{item.title}</h4>
                <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
