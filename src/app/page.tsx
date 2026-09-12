import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { SchoolTimeline } from "@/components/SchoolTimeline";
import { CommunityVoices } from "@/components/CommunityVoices";
import { StoriesSection } from "@/components/StoriesSection";
import { HomeGallery } from "@/components/HomeGallery";
import { ComplianceGrid } from "@/components/ComplianceGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* 1. Hero Section */}
      <Hero />

      {/* 1.5 About & Vision Section */}
      <AboutSection />

      {/* Timeline Section */}
      <SchoolTimeline />

      {/* 1.5 Stories & Highlights Section */}
      <StoriesSection />

      {/* Gallery Showcase */}
      <HomeGallery />

      {/* 2. Public Documents Section */}
      <section id="documents" className="py-24 px-6 bg-gray-50 dark:bg-[#0a0f16] border-y border-gray-100 dark:border-white/5 transition-colors">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#cfa861] text-xs font-bold tracking-[0.25em] uppercase mb-4 block">Transparency</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2a3644] dark:text-white mb-6" style={{ fontFamily: 'var(--font-lora)' }}>
              Public Documents
            </h2>
            <p className="text-[#556372] dark:text-gray-400 text-lg">
              Easily access school policies, affiliation certificates, and important public records.
            </p>
          </div>
          <ComplianceGrid />
        </div>
      </section>

      {/* 3. Campus & Infrastructure Showcase */}
      {/* <CampusShowcase /> */}

      {/* 4. Announcements & Notifications */}
      {/* <Announcements /> */}

      {/* Community Voices (Includes Headmaster, Councillor, etc) */}
      <CommunityVoices />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
