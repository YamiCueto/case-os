## Local Web Validation

When UI changes are made:

1. Start the application locally.
2. Detect the configured development port.
3. Open the application using a browser automation tool.
4. Detect the actual local development URL from the terminal output.
For Angular, the usual default is:
http://localhost:4200

5. Validate:
   - visual layout
   - responsive behavior
   - browser console errors
   - network errors
   - interactive flows

6. Capture screenshots when visual verification is required.

Prefer Playwright for browser automation and visual validation.