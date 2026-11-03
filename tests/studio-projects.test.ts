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
