'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useId, useMemo, useState, type CSSProperties } from 'react'
import type { LandingContent } from '@/payload-types'
import { clamp } from './motion'
import { useStudioMotion } from './motion-provider'
import { ProjectArt } from './project-art'
import { resolveProject } from './projects-data'
import './projects-ux.css'

export function ProjectJourney({ data }: { data: NonNullable<LandingContent['portfolio']> }) {
  const projects = useMemo(() => (data.items ?? []).map(resolveProject), [data.items])
  const { enabled } = useStudioMotion()
  const [active, setActive] = useState(0)
  const choiceId = useId()
  const showcaseId = useId()
  if (!projects.length) return null

  const currentIndex = clamp(active, 0, projects.length - 1)
  const current = projects[currentIndex]
  const goTo = (index: number) => setActive(clamp(index, 0, projects.length - 1))

  return (
    <section
      id="work"
      className="project-journey"
      data-mode="showcase"
      data-effects={enabled ? 'on' : 'off'}
      style={{ '--project-accent': current.accent } as CSSProperties}
      aria-label={data.eyebrow || 'Selected projects'}
    >
      <div className="journey-sticky">
        <div className="journey-heading wrap">
          <div>
            <span className="mono">02 / {data.eyebrow || 'Selected projects'}</span>
            <h2>
              What we build.
              <br />
              <span>Why it matters.</span>
            </h2>
          </div>
          <div className="journey-intro">
            <p>
              {data.heading}
              <span>
                {projects.some((project) => project.concept)
                  ? 'Interface concepts are marked below.'
                  : 'Software built around your business.'}
              </span>
            </p>
          </div>
        </div>
        <div className="journey-navigation wrap">
          <div className="journey-choice">
            <label className="mono" htmlFor={choiceId}>
              Choose a project
            </label>
            <select
              id={choiceId}
              value={currentIndex}
              aria-controls={showcaseId}
              onChange={(event) => goTo(Number(event.target.value))}
            >
              {projects.map((project, index) => (
                <option key={project.id ?? index} value={index}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          <div className="journey-controls" role="group" aria-label="Project navigation">
            <span className="journey-count mono" role="status" aria-atomic="true">
              <span className="sr-only">{current.title}. Project </span>
              {String(currentIndex + 1).padStart(2, '0')} /{' '}
              {String(projects.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="journey-prev"
              aria-label="Previous project"
              aria-controls={showcaseId}
              aria-disabled={currentIndex === 0}
              onClick={() => goTo(currentIndex - 1)}
            >
              <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
            </button>
            <button
              type="button"
              className="journey-next"
              aria-label="Next project"
              aria-controls={showcaseId}
              aria-disabled={currentIndex === projects.length - 1}
              onClick={() => goTo(currentIndex + 1)}
            >
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </div>
        <div className="project-viewport" id={showcaseId}>
          <div className="journey-floor" aria-hidden />
          <div className="journey-ring" aria-hidden />
          <span className="journey-ghost" aria-hidden>
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          {projects.map((project, index) => (
            <article
              key={project.id ?? index}
              className={`project-scene ${currentIndex === index ? 'scene-focused' : ''}`}
              data-scene={index % 4}
              data-selected={currentIndex === index}
              aria-label={`${project.title}${project.concept ? ' — illustrative concept' : ''}`}
              style={{ '--project-accent': project.accent } as CSSProperties}
            >
              <div className="scene-topline mono">
                <span>
                  PROJECT / {String(index + 1).padStart(2, '0')} — {project.title}
                </span>
                <span>{project.tag}</span>
              </div>
              <div className="project">
                <div className={`project-art ${project.kind === 'system' ? 'design-art' : ''}`}>
                  {project.image?.url ? (
                    <Image
                      src={project.image.url}
                      alt={project.image.alt || project.title}
                      fill
                      sizes="(max-width:760px) 90vw, 930px"
                      className="project-upload"
                    />
                  ) : (
                    <>
                      <span className="concept-tag">
                        {project.concept ? 'Interface concept' : 'Product illustration'} /{' '}
                        {project.tag}
                      </span>
                      <ProjectArt kind={project.kind} />
                    </>
                  )}
                </div>
                <div className="project-caption">
                  <div>
                    <span className="mono">{project.service}</span>
                    <h3>{project.line}</h3>
                    {project.layers && <p className="project-connection">{project.layers}</p>}
                    <p className="project-body">{project.body}</p>
                  </div>
                  <a
                    className="project-link"
                    href={project.href || '#contact'}
                    target={project.href ? '_blank' : undefined}
                    rel={project.href ? 'noopener noreferrer' : undefined}
                    aria-label={
                      project.href ? `Visit ${project.title} website` : `Discuss ${project.title}`
                    }
                  >
                    {project.href ? 'Visit website' : 'Discuss project'}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
