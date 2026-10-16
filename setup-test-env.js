import "@testing-library/jest-dom"

// jsdom has no IntersectionObserver. Motion uses it for whileInView;
// in tests nothing scrolls into view, so a no-op observer is enough.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

global.IntersectionObserver = MockIntersectionObserver
