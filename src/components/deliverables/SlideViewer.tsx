"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  PanelRight,
  PanelRightClose,
  ArrowLeft,
} from "lucide-react";
import type { SlideContent } from "@/types";
import SlideRenderer from "@/components/deliverables/SlideRenderer";
import { SlideProgress } from "./SlideProgress";
import { SlideThumbnails } from "./SlideThumbnails";

interface SlideViewerProps {
  slides: SlideContent[];
  title: string;
  brandPrimary: string;
  slug: string;
}

export function SlideViewer({
  slides,
  title,
  brandPrimary,
  slug,
}: SlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSlides = slides.length;

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
    },
    [totalSlides]
  );

  // Fullscreen API
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        // Fullscreen not supported or denied
      }
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes (e.g. user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "t":
          e.preventDefault();
          setShowThumbnails((prev) => !prev);
          break;
        case "Escape":
          if (isFullscreen) {
            // Browser handles exiting fullscreen on Escape
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, goToSlide, toggleFullscreen, totalSlides, isFullscreen]);

  // Auto-hide cursor in fullscreen after 3s of inactivity
  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      return;
    }

    const handleMouseMove = () => {
      setShowControls(true);
      if (cursorTimerRef.current) {
        clearTimeout(cursorTimerRef.current);
      }
      cursorTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    handleMouseMove(); // Start timer on entering fullscreen
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (cursorTimerRef.current) {
        clearTimeout(cursorTimerRef.current);
      }
    };
  }, [isFullscreen]);

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${
        isFullscreen
          ? "h-screen w-screen bg-slate-900"
          : "h-full min-h-0 space-y-4"
      }`}
      style={{
        cursor: isFullscreen && !showControls ? "none" : "default",
      }}
    >
      {/* Header (normal mode only) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/deliverables`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowThumbnails((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              title="Toggle thumbnails (T)"
            >
              {showThumbnails ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRight className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              title="Fullscreen (F)"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {!isFullscreen && (
        <SlideProgress
          current={currentSlide}
          total={totalSlides}
          brandPrimary={brandPrimary}
        />
      )}

      {/* Main content area */}
      <div
        className={`relative flex flex-1 min-h-0 ${
          isFullscreen ? "h-full items-center justify-center p-4" : ""
        }`}
      >
        {/* Slide + nav container */}
        <div
          className={`relative flex-1 min-h-0 ${
            isFullscreen ? "flex items-center justify-center" : ""
          }`}
        >
          {/* Left arrow navigation */}
          <button
            onClick={goPrev}
            disabled={isFirstSlide}
            className={`absolute left-0 top-0 z-20 flex h-full w-16 items-center justify-center transition-opacity duration-300 ${
              isFirstSlide
                ? "pointer-events-none opacity-0"
                : "opacity-0 hover:opacity-100"
            } ${isFullscreen ? "" : "group-hover:opacity-100"}`}
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.08), transparent)",
            }}
            aria-label="Previous slide"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all ${
                showControls || !isFullscreen ? "" : "opacity-0"
              }`}
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </div>
          </button>

          {/* Slide area */}
          <div
            className={`group relative ${
              isFullscreen
                ? "aspect-video w-full max-h-full max-w-[calc(100vh*16/9)]"
                : "aspect-video w-full"
            }`}
          >
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-white shadow-lg">
              <SlideRenderer
                content={slides[currentSlide]}
                brandPrimary={brandPrimary}
              />
            </div>

            {/* Left arrow (inside slide for hover) */}
            <button
              onClick={goPrev}
              disabled={isFirstSlide}
              className={`absolute left-0 top-0 z-20 flex h-full w-20 items-center justify-start pl-3 transition-opacity duration-300 ${
                isFirstSlide
                  ? "pointer-events-none opacity-0"
                  : "opacity-0 group-hover:opacity-100"
              }`}
              aria-label="Previous slide"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </div>
            </button>

            {/* Right arrow (inside slide for hover) */}
            <button
              onClick={goNext}
              disabled={isLastSlide}
              className={`absolute right-0 top-0 z-20 flex h-full w-20 items-center justify-end pr-3 transition-opacity duration-300 ${
                isLastSlide
                  ? "pointer-events-none opacity-0"
                  : "opacity-0 group-hover:opacity-100"
              }`}
              aria-label="Next slide"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </div>
            </button>

            {/* Fullscreen controls overlay */}
            {isFullscreen && (
              <div
                className={`absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 transition-opacity duration-500 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                <SlideProgress
                  current={currentSlide}
                  total={totalSlides}
                  brandPrimary={brandPrimary}
                />
              </div>
            )}

            {/* Fullscreen bottom bar */}
            {isFullscreen && (
              <div
                className={`absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-6 py-4 transition-opacity duration-500 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                <button
                  onClick={() => setShowThumbnails((prev) => !prev)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  title="Toggle thumbnails (T)"
                >
                  {showThumbnails ? (
                    <PanelRightClose className="h-4 w-4" />
                  ) : (
                    <PanelRight className="h-4 w-4" />
                  )}
                </button>
                <span className="rounded-lg bg-black/40 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
                  {currentSlide + 1} / {totalSlides}
                </span>
                <button
                  onClick={toggleFullscreen}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  title="Exit fullscreen (F)"
                >
                  <Minimize className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnails panel */}
        {showThumbnails && (
          <SlideThumbnails
            slides={slides}
            currentSlide={currentSlide}
            onSelect={goToSlide}
            brandPrimary={brandPrimary}
          />
        )}
      </div>

      {/* Footer (normal mode only) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Use arrow keys to navigate, <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono">F</kbd> for fullscreen, <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono">T</kbd> for thumbnails
          </div>
          <span className="text-sm font-medium text-gray-500">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>
      )}
    </div>
  );
}
