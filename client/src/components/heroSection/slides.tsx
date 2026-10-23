import * as React from "react"
import Autoplay, { type AutoplayType } from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { heroData } from "@/data/heroData"
import { cn } from "@/lib/utils"

export function HeroSlides() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [selected, setSelected] = React.useState(0)
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)
  const [plugins, setPlugins] = React.useState<AutoplayType[]>([])

  const autoplayRef = React.useRef<AutoplayType | null>(null)

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }
    const instance = Autoplay({
      delay: 5500,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    })
    autoplayRef.current = instance
    setPlugins([instance])
  }, [])

  React.useEffect(() => {
    if (!api) return

    const sync = () => {
      setSelected(api.selectedScrollSnap())
      setCanPrev(api.canScrollPrev())
      setCanNext(api.canScrollNext())
    }

    sync()
    api.on("select", sync)
    api.on("reInit", sync)

    return () => {
      api.off("select", sync)
      api.off("reInit", sync)
    }
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  const onMouseEnter = React.useCallback(() => {
    if (plugins.length === 0) return
    autoplayRef.current?.stop?.()
  }, [plugins.length])

  const onMouseLeave = React.useCallback(() => {
    if (plugins.length === 0) return
    autoplayRef.current?.reset?.()
  }, [plugins.length])

  const slideCount = heroData.length

  return (
    <Carousel
      setApi={setApi}
      plugins={plugins}
      className="home-hero-carousel w-full max-w-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label="Picha za mbele za ukurasa wa nyumbani"
    >
      <CarouselContent className="home-hero-carousel__track w-full">
        {heroData.map((data, idx) => {
          const TitleTag = idx === 0 ? "h1" : "p"
          return (
            <CarouselItem
              key={data.img}
              className="home-hero-slide-item m-0 w-full basis-full bg-transparent p-0 pl-0"
            >
              <div className="home-hero-slide">
                <img
                  src={data.img}
                  alt={data.desc}
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : "auto"}
                  decoding="async"
                  className={cn(
                    "home-hero-slide__img",
                    data.classNames ?? ""
                  )}
                />

                <div className="home-hero-slide__overlay" aria-hidden />

                <div className="home-hero-slide__inner">
                  <div className="home-hero-slide__content">
                    <TitleTag className="home-hero-slide__title">
                      {data.title}
                    </TitleTag>
                    <p className="home-hero-slide__desc">{data.desc}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>

      <div
        className="home-hero-carousel__chrome"
        aria-label="Udhibiti wa slaidi"
      >
        <div className="home-hero-carousel__nav">
          <button
            type="button"
            className="home-hero-carousel__btn"
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Slaidi iliyopita"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            className="home-hero-carousel__btn"
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
            aria-label="Slaidi inayofuata"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div
          className="home-hero-carousel__dots"
          role="group"
          aria-label="Chagua slaidi"
        >
          {heroData.map((data, idx) => (
            <button
              key={data.img}
              type="button"
              aria-pressed={selected === idx}
              aria-label={`Slaidi ${idx + 1} kati ya ${slideCount}`}
              className={cn(
                "home-hero-carousel__dot",
                selected === idx && "home-hero-carousel__dot--active"
              )}
              onClick={() => scrollTo(idx)}
            />
          ))}
        </div>
      </div>
    </Carousel>
  )
}
