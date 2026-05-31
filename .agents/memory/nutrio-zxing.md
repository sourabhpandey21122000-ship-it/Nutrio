---
  name: Nutrio ZXing barcode scanner setup
  description: @zxing/browser peer dependency quirk that breaks Vite build
  ---

  ## Rule
  When adding `@zxing/browser` to a Vite project, also install `@zxing/library` explicitly. The browser package does not declare it as a peerDependency in npm metadata, so pnpm won't auto-install it, but Vite's dep optimizer tries to resolve it from the ESM index and fails with "Could not resolve @zxing/library".

  **Why:** @zxing/browser@0.2.x re-exports from @zxing/library but lists it only as a peerDep without a peerDepMeta required:true, so package managers skip it silently.

  **How to apply:** Any time the scan page uses BrowserMultiFormatReader, run `pnpm add @zxing/library` in the same package alongside `@zxing/browser`.
  