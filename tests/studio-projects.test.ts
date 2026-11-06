import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveProject } from '../src/components/studio/projects-data'

test('concept context preserves CMS-authored notes in the animated description', () => {
  const result = resolveProject({
    title: 'Scheduling platform',
    tag: 'Operations',
    note: 'Our team-specific CMS note',
  })
  assert.ok(result.body.includes('Our team-specific CMS note'))
  assert.equal(result.concept, true)
})

test('an uploaded project uses authored copy rather than illustrative case-study claims', () => {
  const result = resolveProject({
    title: 'Scheduling platform',
    tag: 'Our real project',
    note: 'An actual case study.',
    image: {
      id: 1,
      alt: 'Our scheduling application',
      url: '/api/media/file/project.png',
      createdAt: '2026-11-03T00:00:00Z',
      updatedAt: '2026-11-03T00:00:00Z',
    },
  })
  assert.equal(result.concept, false)
  assert.equal(result.line, 'Scheduling platform')
  assert.equal(result.body, 'An actual case study.')
  assert.equal(result.service, 'Our real project')
  assert.equal(result.layers, '')
})

test('arbitrary CMS projects retain their name, tag, and note', () => {
  const result = resolveProject({
    title: 'A completely new project',
    tag: 'Custom systems',
    note: 'A bespoke description.',
  })
  assert.equal(result.line, 'A completely new project')
  assert.equal(result.body, 'A bespoke description.')
  assert.equal(result.category, 'Custom systems')
})

test('real products use their own previews when no CMS screenshot is supplied', () => {
  for (const title of ['Tally', 'Motorpool Management System']) {
    const result = resolveProject({
      title,
      tag: 'Software product',
      note: 'Built by Code Box Studios.',
    })
    assert.equal(result.concept, false, `${title} should remain a real project`)
    assert.ok(result.image?.url, `${title} should show its own product preview`)
    assert.equal(result.line, title)
    assert.equal(result.body, 'Built by Code Box Studios.')
  }
})

test('a CMS screenshot takes precedence over a built-in product preview', () => {
  const result = resolveProject({
    title: 'Tally',
    tag: 'Personal finance',
    image: {
      id: 2,
      alt: 'An updated Tally screenshot',
      url: '/api/media/file/updated-tally.png',
      createdAt: '2026-11-07T00:00:00Z',
      updatedAt: '2026-11-07T00:00:00Z',
    },
  })
  assert.equal(result.image?.url, '/api/media/file/updated-tally.png')
  assert.equal(result.image?.alt, 'An updated Tally screenshot')
  assert.equal(result.concept, false)
})
