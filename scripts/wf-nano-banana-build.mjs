export const meta = {
  name: 'nano-banana-build',
  description: 'Replace fake AI (text-model SVG + timer theater) with real Nano Banana image pipeline across 5 disjoint files, then verify with lint+build',
  phases: [
    { title: 'Rewrite', detail: '5 disjoint files in parallel: generate.js, logo.js, mockup.js, MockupStudio.jsx, LogoStudio.jsx' },
    { title: 'Verify', detail: 'npm run lint + npm run build + cross-file contract check' },
  ],
}

// ---------------------------------------------------------------------------
// Structured return schemas (declared before use — const is not hoisted).
// ---------------------------------------------------------------------------
const REWRITE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['file', 'summary', 'contractConfirmed'],
  properties: {
    file: { type: 'string' },
    summary: { type: 'string', description: 'What was changed' },
    contractConfirmed: { type: 'boolean', description: 'Whether the response/request contract matches the spec' },
    notes: { type: 'string' },
  },
}

const VERIFY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lintPassed', 'buildPassed', 'issues'],
  properties: {
    lintPassed: { type: 'boolean' },
    buildPassed: { type: 'boolean' },
    buildResult: { type: 'string', description: 'Final build stdout/stderr summary' },
    fixesApplied: { type: 'array', items: { type: 'string' } },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['severity', 'file', 'problem'],
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          file: { type: 'string' },
          problem: { type: 'string' },
          fixed: { type: 'boolean' },
        },
      },
    },
  },
}

// ---------------------------------------------------------------------------
// Shared, authoritative facts injected into every agent so contracts never drift.
// ---------------------------------------------------------------------------
const APP = 'C:/Users/Admin/Desktop/Unipreneur/prototype-app'

const IMAGE_API = `
PROVEN-WORKING Gemini image call (verified by smoke tests in claude-solutions/_smoketest.mjs and _wraptest.mjs):
  URL:    https://generativelanguage.googleapis.com/v1beta/models/\${MODEL}:generateContent?key=\${apiKey}
  MODEL:  read from process.env.GEMINI_IMAGE_MODEL, default 'gemini-3.1-flash-image'
  METHOD: POST, header Content-Type: application/json
  BODY:   {
            contents: [{ parts: [ {text: PROMPT}, {inlineData:{mimeType,data}} ...optional more images ] }],
            generationConfig: { responseModalities: ['IMAGE'] }
          }
  PARSE:  const parts = data?.candidates?.[0]?.content?.parts || [];
          const imgPart = parts.find(p => p.inlineData || p.inline_data);
          const b64 = (imgPart.inlineData || imgPart.inline_data).data;   // base64 PNG
          const finish = data?.candidates?.[0]?.finishReason;             // for error messages
  inlineData data is RAW base64 with NO "data:" prefix.
`

const RULES = `
HARD RULES:
- Edit ONLY the one file you are assigned. Do not touch any other file.
- Read the file first, then make surgical edits that fit the existing code style (2-space indent, same import style).
- The API key is process.env.GEMINI_API_KEY. NEVER hardcode a key. If missing, return HTTP 500 JSON { error: ... }.
- Keep all existing graceful-fallback behavior unless told to remove it.
- This is a Vite + React 19 app deployed on Vercel (serverless functions in api/, ESM, "type":"module").
`

phase('Rewrite')

const results = await parallel([
  // 1) api/generate.js — harden only (stays gemini-2.5-pro JSON; no image model)
  () => agent(`${RULES}

TASK: Harden ${APP}/api/generate.js (the Khmer label-compliance endpoint). Do NOT change the model — it correctly uses gemini-2.5-pro with responseMimeType application/json to return structured label JSON.

Current weaknesses to fix:
1. It destructures req.body without guarding — on Vercel req.body can be undefined or a string. Add: a safe body parse (if typeof req.body === 'string', JSON.parse it inside try/catch; if missing, default {}). If rawInput is absent, return 400 JSON { error:'Missing rawInput' }.
2. The final JSON.parse(resultText) can throw if the model wraps output in markdown fences or returns prose. Strip \`\`\`json / \`\`\` fences, extract the first {...} block as a fallback, and wrap the parse in try/catch. On parse failure return 502 JSON { error:'Model returned non-JSON', details: <first 300 chars> }.
3. Keep the existing success shape: respond with the parsed label object directly (res.status(200).json(parsed)). Do NOT wrap it.
Return a short summary of exactly what you changed.`,
    { label: 'rewrite:generate.js', phase: 'Rewrite', schema: REWRITE_SCHEMA }),

  // 2) api/logo.js — real image logo
  () => agent(`${RULES}
${IMAGE_API}

TASK: Rewrite ${APP}/api/logo.js to generate a REAL raster logo via the image model instead of asking a text model to hand-write SVG.

Request body (unchanged): { userPrompt, brandName, estYear, primaryColor, secondaryColor }.
Build a strong text prompt for a premium, retail food-brand emblem/logo: incorporate the motif (userPrompt), brandName, "EST. {estYear}", and use primaryColor + secondaryColor. CRITICAL for compositing: demand a clean, FLAT logo centered on a PURE WHITE background, no photographic scene, no drop shadow, square framing, crisp edges (it will be composited onto labels with multiply blending, so white background must read as transparent).
Call the image API exactly as specified above. Parse the returned base64.
RESPONSE CONTRACT (must match the client): res.status(200).json({ image: 'data:image/png;base64,' + b64 }).
Error handling: if !response.ok -> forward status + details; if no image part -> 502 JSON { error:'No image returned', finishReason }.
Return a short summary of what you changed and confirm the response key is exactly "image".`,
    { label: 'rewrite:logo.js', phase: 'Rewrite', schema: REWRITE_SCHEMA }),

  // 3) api/mockup.js — real image-to-image wrap
  () => agent(`${RULES}
${IMAGE_API}

TASK: Completely rewrite ${APP}/api/mockup.js. The OLD version asked a text model (gemini-2.5-flash) to emit an SVG and read mockup files from disk with a hardcoded C:\\Users\\Admin fallback path that is broken on Vercel. Replace it entirely.

NEW behavior — real image-to-image product-shot compositing:
1. Import the pre-encoded blanks:  import { MOCKUPS } from './_mockups.js';
   MOCKUPS is { [mockupId]: { mimeType:'image/jpeg', data:<base64> } }. (File already exists — read it to confirm the shape and available ids; ids include pouch-lifestyle, pouch-isometric, pouch-front-back, jar-front, jar-lifestyle, box-isometric, box-lifestyle, tube-front, tub-front.)
2. Request body: { mockupId, labelPng, userPrompt }. labelPng is RAW base64 PNG (no data: prefix) of the rendered compliance label. Guard req.body (may be string/undefined). If labelPng missing -> 400 JSON { error:'Missing labelPng' }.
3. const blank = MOCKUPS[mockupId] || MOCKUPS['pouch-lifestyle'].
4. Prompt the image model as a product photographer: image 1 = the blank package photo; image 2 = the finished label/artwork design. Instruct it to print/wrap the label from image 2 naturally onto the front panel of the package in image 1, following the package's curvature, the clear window if present, and matching the existing lighting, shadows, and material texture; keep all text sharp and legible; do not change the background, surface, or props; output one photorealistic retail product photograph. Fold in userPrompt as extra steering if provided.
   parts order: [ {text:prompt}, {inlineData: blank}, {inlineData:{mimeType:'image/png', data: labelPng}} ].
5. RESPONSE CONTRACT (must match the client): res.status(200).json({ image: 'data:image/png;base64,' + b64 }).
6. Errors: !response.ok -> forward status + details (first 400 chars); no image part -> 502 JSON { error:'No image returned', finishReason }. No fs/path imports at all.
Return a short summary and confirm: no filesystem access remains, and the response key is exactly "image".`,
    { label: 'rewrite:mockup.js', phase: 'Rewrite', schema: REWRITE_SCHEMA }),

  // 4) MockupStudio.jsx — wire real endpoint, remove theater, hero fallback
  () => agent(`${RULES}

TASK: Edit ${APP}/src/components/MockupStudio.jsx to call the real /api/mockup wrap endpoint and remove the fake-AI theater. Read the whole file first.

Requirements:
1. KEEP generateCompositeMockup() and the client perspective warp — it is now an INSTANT LOCAL PREVIEW (compositeDataUrl). Keep showing it before/while the real wrap runs.
2. The component already renders the label to a scratch canvas via drawLabel2D. In handleAiMockupGeneration, after drawing the scratch canvas, extract the PNG:
     const labelPng = scratchCanvas.toDataURL('image/png').split(',')[1];
   POST to /api/mockup with JSON body { mockupId: selectedMockup.id, labelPng, userPrompt: mockupPrompt }. Read { image } from the response and store it in a new state setResultImage(data.image). NOTE: currently drawLabel2D runs inside generateCompositeMockup on a local scratch canvas that is not in scope here — refactor so the scratch canvas (and its label PNG) is available to the AI handler (e.g. draw it again into a fresh scratch canvas inside handleAiMockupGeneration using the same drawLabel2D call and the same props).
3. DELETE the fake bake: remove handleBakeDenoising/isDenoising/setTimeout(...,1500) theater and the "Denoise Refined (0.12)" text. Remove the aiComposedSvg SVG rendering path entirely (the endpoint no longer returns SVG).
4. Display priority in the render area: if resultImage -> show <img src={resultImage}> as the hero "AI MARKETING MOCKUP"; else show the local compositeDataUrl preview. While generating show a real spinner.
5. HERO FALLBACK (insurance): if the fetch fails or returns no image, set resultImage to a pre-baked hero based on selectedMockup.packageType: \`/hero/\${selectedMockup.packageType}.jpg\` (files may not exist yet; add onError on the <img> to fall back to the local compositeDataUrl so nothing breaks). Show an honest small note like "Showing pre-rendered sample (live generation unavailable)" in that case.
6. Honesty cleanup: remove "Free Tier" wording. Change the "API Generator" summary value from "gemini-2.5-flash (Free)" to "gemini-3.1-flash-image". Button label: "Generate AI Mockup" (not "Bake ... Free Tier"). Update the "Texture Compositor" line to "Nano Banana image-to-image".
7. Two-output download: handleDownload should let the user download BOTH the print-ready label (the scratch canvas PNG, name \`\${selectedMockup.id}-label.png\`) and, when present, the marketing mockup (resultImage, name \`\${selectedMockup.id}-mockup.png\`). Keep it simple (two buttons or download both sequentially).
Do not change MockupStudio's props or Dashboard. Return a summary of changes and confirm the request body uses key "labelPng" and reads response key "image".`,
    { label: 'rewrite:MockupStudio.jsx', phase: 'Rewrite', schema: REWRITE_SCHEMA }),

  // 5) LogoStudio.jsx — consume raster image, apply as customLogoUrl
  () => agent(`${RULES}

TASK: Edit ${APP}/src/components/LogoStudio.jsx so AI logo generation uses the new raster endpoint. Read the whole file first.

Context: /api/logo now returns { image: <pngDataUrl> } (NOT { svg }). Dashboard's onApplyLogo(svgCode, imgUrl) already accepts a raster url as the 2nd arg, and the label renderer composites customLogoUrl via drawImage. The local getMotifSvg/generateVectorSvg presets must REMAIN as the offline fallback.

Requirements:
1. Add state: const [generatedImage, setGeneratedImage] = useState(null).
2. handleRealAiGeneration: read data.image (not data.svg). On success setGeneratedImage(data.image) and clear generatedSvg. On failure keep the existing fallback to a local SVG preset (setGeneratedSvg(generateVectorSvg())).
3. Preview area: if generatedImage -> render <img src={generatedImage} className="w-full h-full object-contain" />; else keep the existing dangerouslySetInnerHTML SVG preview.
4. handleApplyLogo: if generatedImage exists -> onApplyLogo(null, generatedImage) (apply as raster url). Else -> onApplyLogo(generatedSvg || generateVectorSvg(), null) (existing behavior).
5. Reset generatedImage to null wherever generatedSvg is currently reset (the input onChange handlers and preset buttons).
6. Honesty: remove "(Free Tier)" from the generate button label.
Do not change props or Dashboard. Return a summary and confirm Apply passes the raster as the 2nd arg of onApplyLogo.`,
    { label: 'rewrite:LogoStudio.jsx', phase: 'Rewrite', schema: REWRITE_SCHEMA }),
])

const ok = results.filter(Boolean)
log(`Rewrite phase done: ${ok.length}/5 files edited.`)

phase('Verify')

const verify = await agent(`${RULES}

You are the verification gate for a 5-file change in ${APP}. Do NOT rewrite features; only verify and fix BUILD-BREAKING issues (syntax errors, bad imports, obvious contract mismatches).

Steps:
1. cd ${APP} and run: npm run lint   (capture output)
2. Then run: npm run build           (capture output; this is the real gate)
3. Read all 5 changed files: api/generate.js, api/logo.js, api/mockup.js, src/components/MockupStudio.jsx, src/components/LogoStudio.jsx.
4. CROSS-FILE CONTRACT CHECKS:
   - api/logo.js and api/mockup.js both respond with { image: 'data:image/png;base64,...' }.
   - MockupStudio reads response key "image" and POSTs body key "labelPng"; api/mockup.js reads "labelPng".
   - LogoStudio reads response key "image" and Apply passes raster as 2nd arg to onApplyLogo.
   - api/mockup.js has NO fs/path import and imports MOCKUPS from './_mockups.js'.
   - No hardcoded API keys anywhere.
5. If lint shows only pre-existing warnings unrelated to these files, that's fine. If build FAILS, fix the minimal cause (in the offending one of the 5 files only) and re-run npm run build until it passes or you hit a blocker you cannot fix without changing behavior.
Report: did lint pass, did build pass, the final build result, and a list of any issues (with severity high/medium/low, file, problem, and whether you fixed it).`,
  { label: 'verify:lint+build', phase: 'Verify', schema: VERIFY_SCHEMA })

return { rewrites: ok, verify }
