// src/setupTests.ts
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'

// Extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// Automatically unmount and cleanup DOM after the test is finished.
afterEach(() => {
  cleanup()
})